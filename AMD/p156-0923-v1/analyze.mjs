import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir, lstat, readlink, realpath } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

const root = process.argv[2];
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const maybe = async path => { try { return await json(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
const lines = async path => (await readFile(path, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);
const hash = value => createHash('sha256').update(value).digest('hex');
const canonical = value => value === null || typeof value !== 'object' ? value : Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
const evidenceHash = value => hash(JSON.stringify(canonical(value)));
const freeze = await json(join(root, 'campaign-freeze.json'));
for (const [path, digest] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), digest, `freeze:${path}`);
const settings = await json(join(root, 'stability.json'));
const tasks = (await json(join(root, settings.manifestFile))).task_ids;
assert.equal(tasks.length, 156); assert.equal(new Set(tasks).size, 156);
assert.equal(hash(await readFile(join(root, settings.manifestFile))), settings.manifestSha256);
assert.equal(freeze.protocol.max_repair_rounds, 15); assert.equal(freeze.protocol.max_agent_requests, 120);
assert.equal(freeze.protocol.max_tool_steps, 60); assert.equal(freeze.protocol.max_generation_resumes, 0);
assert.equal(freeze.protocol.campaign_max_dispatches, 20124);
const catalog = await json(join(freeze.preflight_root, 'catalog.json'));
const excluded = new Map(settings.calibrationExcluded.map(row => [row.task_id, row]));
const interfaceBlocked = new Map(settings.generationExcluded.map(row => [row.task_id, row]));
const calls = [], rows = [], trajectories = [];
const reportRoot = join(root, 'report'), analysisRoot = join(root, 'analysis');
await mkdir(reportRoot, { recursive: true }); await mkdir(analysisRoot, { recursive: true });

async function auditCall(directory, task, phase, sequence, generationDirectory) {
  const model = await json(join(directory, 'model.json')), transcript = await json(join(directory, 'transcript.json'));
  for (const [path, entry] of Object.entries(transcript.files)) {
    const bytes = await readFile(join(directory, path)); assert.equal(bytes.length, entry.bytes); assert.equal(hash(bytes), entry.sha256);
  }
  const chunks = await lines(join(directory, 'stream.jsonl'));
  assert.equal(chunks.length, transcript.chunk_count);
  const projection = new Map(), tools = new Map();
  for (const [index, event] of chunks.entries()) {
    assert.equal(event.seq, index);
    const c = event.chunk;
    if (c.type === 'text-delta' || c.type === 'reasoning-delta') {
      const item = projection.get(c.index) ?? { type: c.type === 'text-delta' ? 'text' : 'reasoning', text: '' };
      if (!item.closed) item.text += c.text; projection.set(c.index, item);
    }
    if (c.type === 'block-end' && ['text', 'reasoning'].includes(c.block.type)) projection.set(c.index, { ...c.block, closed: true });
    if (c.type === 'tool-call-delta') {
      const item = tools.get(c.index) ?? { id: c.id, name: '', arguments: '' };
      if (!item.closed) { item.id = c.id; if (c.name) item.name = c.name; item.arguments += c.argumentsDelta; } tools.set(c.index, item);
    }
    if (c.type === 'block-end' && c.block.type === 'tool-call') tools.set(c.index, { ...c.block, closed: true });
    if (c.type === 'finish' && ['error', 'aborted'].includes(c.reason.kind)) assert.equal(c.reason.failure, undefined);
  }
  const reasoning = await readFile(join(directory, 'reasoning.txt'), 'utf8'), output = await readFile(join(directory, 'output.txt'), 'utf8');
  for (const [type, actual] of [['reasoning', reasoning], ['text', output]]) assert.equal(actual, [...projection.values()].filter(b => b.type === type && b.text.trim()).map(b => b.text).join(''));
  const request = await maybe(join(directory, 'prompt-final.json')) ?? await maybe(join(directory, 'prompt-final.txt'));
  const dispatch = await maybe(join(directory, 'dispatch.json')), context = await maybe(join(directory, 'context.json'));
  if (request && dispatch?.request_sha256) assert.equal(hash(JSON.stringify(request)), dispatch.request_sha256);
  if (context) {
    assert.equal(context.task.spec, catalog.find(item => item.task_id === task).spec);
    assert.deepEqual(Object.keys(context.task).sort(), ['constraints', 'id', 'interface', 'spec']);
  }
  const rendered = phase === 'agent' && request ? JSON.parse(request.messages.find(message => message.role === 'user').content) : null;
  const recovery = phase === 'generation' && !!context?.generation_recovery;
  const resolved = phase === 'agent' ? await maybe(join(directory, 'resolved-model.json')) : await maybe(join(generationDirectory, recovery ? 'resolved-generation-recovery-model.json' : 'resolved-model.json'));
  if (model.dispatched) {
    const forced = rendered?.repair_control?.mode === 'forced_action';
    const disabled = recovery || forced;
    const tokens = phase === 'generation' ? recovery ? 16384 : 8192 : forced ? 4096 : 16384;
    assert.equal(resolved.config.maxTokens, tokens); assert.equal(request.max_tokens, tokens);
    assert.equal(resolved.config.reasoningEffort, disabled ? 'off' : 'high');
    assert.equal(request.thinking.type, disabled ? 'disabled' : 'enabled');
    if (forced) assert.ok(request.tools.every(tool => tool.function.name !== 'finish'));
    if (phase === 'generation') assert.ok(!request.tools?.length);
  }
  for (const tool of model.message?.content.filter(b => b.type === 'tool-call') ?? []) {
    const raw = [...tools.values()].find(t => t.id === tool.id); assert.ok(raw); assert.equal(raw.name, tool.name); assert.equal(raw.arguments, tool.arguments);
  }
  const transport = await json(join(directory, 'transport.json'));
  const call = { task_id: task, phase, sequence, directory, dispatched: model.dispatched, request, context, resolved_model: resolved,
    repair_mode: rendered?.repair_control?.mode ?? null, generation_recovery: recovery,
    simulation_feedback: rendered?.observed?.simulation_feedback ?? null, request_sha256: dispatch?.request_sha256 ?? null,
    reasoning, output, model, transport, transcript, chunks };
  calls.push(call); return call;
}

for (const task of tasks) {
  const generationDirectory = join(root, `generate-${task}`), target = join(root, `compare-${task}`);
  const generation = await maybe(join(generationDirectory, 'result.json')), comparison = await maybe(join(target, 'result.json'));
  if (interfaceBlocked.has(task)) assert.equal(generation, null);
  if (excluded.has(task)) assert.equal(comparison, null);
  for (const [index, directory] of (generation?.model_runs ?? []).entries()) await auditCall(directory, task, 'generation', index + 1, generationDirectory);
  for (const [index, directory] of (comparison?.model_runs ?? []).entries()) await auditCall(directory, task, 'agent', index + 1, generationDirectory);
  if (generation) {
    assert.ok(generation.physical_dispatches <= 9); assert.ok(generation.output_recovery_attempts <= 2);
    assert.equal(generation.generation_resumes, 0);
    if (generation.status === 'GENERATED_UNVERIFIED') {
      assert.equal(hash(await readFile(join(generationDirectory, 'initial.sv'))), generation.source_sha256);
      assert.equal(generation.generation_attempts.filter(attempt => attempt.candidate_valid).length, 1);
    }
  }
  let trace = [], verificationDetails = [];
  if (comparison) {
    assert.ok(comparison.semantic_repairs <= 15); assert.ok(comparison.physical_dispatches <= 120); assert.ok(comparison.actions.length <= 60);
    assert.equal(comparison.shared_initial_sha256, generation.source_sha256); assert.equal(comparison.initial_generation_charged_again, false);
    trace = await lines(join(target, 'tool-trace.jsonl'));
    const receipts = new Map(), verifications = trace.filter(event => event.event === 'verification');
    assert.equal(verifications[0].source_sha256, generation.source_sha256);
    for (const [index, event] of verifications.entries()) {
      const bytes = await readFile(join(event.verification_run_id, 'result.json')), result = JSON.parse(bytes);
      const receipt = await json(join(target, `feedback-${index + 1}.json`));
      assert.equal(hash(bytes), event.result_sha256); assert.equal(evidenceHash(receipt), event.feedback_sha256);
      assert.equal(result.final_source_sha256, event.source_sha256); assert.equal(receipt.result_sha256, event.result_sha256);
      assert.equal(event.checks, result.stages.simulation?.evidence.checks_executed ?? null);
      assert.equal(event.mismatches, result.stages.simulation?.evidence.mismatch_count ?? null);
      for (const log of event.simulation_logs) assert.equal(hash(await readFile(join(event.verification_run_id, log.path))), log.sha256);
      receipts.set(event.feedback_sha256, receipt);
      verificationDetails.push({ directory: event.verification_run_id, trigger: event.verification_trigger, status: result.final_status,
        checks: event.checks, mismatches: event.mismatches, xsim_executed: event.xsim_executed, synthesis_executed: event.synthesis_executed,
        failed_stages: Object.entries(result.stages).filter(([, stage]) => stage && !['PASS', 'SKIPPED'].includes(stage.status)),
        simulation_feedback: receipt.stages.find(stage => stage.stage === 'simulation')?.simulation_feedback ?? null });
    }
    for (const event of trace.filter(item => item.event === 'model_request')) {
      const call = calls.find(item => item.directory === event.model_run_id); assert.ok(call);
      assert.equal(hash(JSON.stringify(call.request)), event.request_sha256); assert.deepEqual(call.request.tools.map(tool => tool.function.name), event.available_tools);
      if (event.consumed_feedback_sha256) {
        assert.equal(evidenceHash(call.context.feedback), event.consumed_feedback_sha256); assert.ok(receipts.has(event.consumed_feedback_sha256));
        assert.equal(call.transport.model_output_observed, true);
        const rendered = JSON.parse(call.request.messages.find(message => message.role === 'user').content);
        assert.equal(evidenceHash({ observed: rendered.observed, additional_diagnostics: rendered.additional_diagnostics }), event.feedback_projection_sha256);
      }
    }
    for (const event of trace.filter(item => item.event === 'agent_tool')) {
      const physical = calls.find(item => item.directory === event.model_run_id);
      const tool = physical.model.message.content.find(block => block.type === 'tool-call');
      assert.equal(tool.name, event.selected_tool); assert.equal(tool.id, event.tool_call_id); assert.equal(hash(tool.arguments), event.arguments_sha256);
      if (event.host_accepted) assert.ok(event.available_tools.includes(event.selected_tool));
      const next = calls.find(call => call.task_id === task && call.phase === 'agent' && call.sequence > physical.sequence);
      if (physical.repair_mode === 'forced_action' && next?.request) {
        assert.ok(next.request.messages.every(message => !['assistant', 'tool'].includes(message.role)));
        assert.deepEqual(next.context.previous_tool_result, { tool: event.selected_tool, accepted: event.host_accepted, observation: event.tool_result });
      }
    }
    if (comparison.status === 'VERIFIED') {
      assert.equal(hash(await readFile(join(target, 'final.sv'))), comparison.verified_source_sha256);
      assert.equal((await json(join(comparison.final_verification_run, 'result.json'))).final_verified, true);
    }
    if (comparison.best_source_sha256) {
      assert.equal(hash(await readFile(join(target, 'best-observed.sv'))), comparison.best_source_sha256);
      assert.equal(comparison.current_source_sha256, comparison.best_source_sha256);
      assert.equal((await json(join(comparison.final_verification_run, 'result.json'))).final_source_sha256, comparison.best_source_sha256);
    }
    for (const attempt of comparison.repair_attempts) {
      if (!attempt.valid) continue;
      assert.equal(attempt.baseline_failed, true); assert.equal(attempt.feedback.evidence_kind, 'live_verification');
      assert.equal(attempt.feedback.source_sha256, attempt.edit.previous_source_sha256);
      assert.equal(attempt.verification.revision_id, attempt.edit.revision_id);
      assert.equal(hash(await readFile(join(attempt.verification.verification_run, 'result.json'))), attempt.verification.result_sha256);
    }
    trajectories.push({ task_id: task, result: comparison, trace });
  }
  const selectedCalls = calls.filter(call => call.task_id === task);
  const row = { task_id: task, calibration_exclusion: excluded.get(task) ?? null, generation_exclusion: interfaceBlocked.get(task) ?? null,
    generation_status: generation?.status ?? (interfaceBlocked.has(task) ? 'INTERFACE_BLOCKED' : 'NOT_RUN'),
    generation_attempts: generation?.generation_attempts ?? [], generation_recoveries: generation?.output_recovery_attempts ?? 0,
    candidate_rejection: generation?.candidate_rejection ?? null, baseline_status: comparison?.initial_status ?? 'NOT_RUN', agent_status: comparison?.status ?? 'NOT_RUN',
    terminal_policy_rule: comparison?.terminal_policy_rule ?? null, repair_eligible: comparison?.repair_eligible ?? false,
    repair_requested: comparison?.repair_requested ?? false, semantic_repairs: comparison?.semantic_repairs ?? 0, recovered_by_agent: comparison?.recovered_by_agent ?? false,
    policy_decisions: comparison?.repair_decisions ?? [], revision_decisions: comparison?.revision_decisions ?? [],
    model_calls: selectedCalls.filter(call => call.dispatched).length, tool_calls: trace.filter(event => event.event === 'agent_tool').length,
    verification_details: verificationDetails, reasoning_bytes: selectedCalls.reduce((n, call) => n + call.transcript.files['reasoning.txt'].bytes, 0) };
  rows.push(row);
  const fence = value => { const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2); const marker = '`'.repeat(Math.max(3, ...(text.match(/`+/g) ?? []).map(v => v.length + 1))); return `${marker}text\n${text}\n${marker}\n`; };
  let md = `# ${task}\n\n${fence(row)}`;
  for (const call of selectedCalls) md += `\n## ${call.phase} ${call.sequence}\n\n目录：${call.directory}\n\n### 请求\n\n${fence(call.request)}\n### 接口返回 reasoning\n\n${fence(call.reasoning)}\n### 接口返回输出\n\n${fence(call.output)}\n### 模型终态\n\n${fence(call.model)}\n`;
  md += `\n## Host 工具轨迹\n\n${fence(trace)}`; await writeFile(join(analysisRoot, task + '.md'), md);
}
const state = await json(join(reportRoot, 'latest.json'));
const dispatched = calls.filter(call => call.dispatched), tickets = (await readdir(join(root, 'dispatches'))).filter(name => name.endsWith('.json'));
assert.ok(tickets.length <= 20124); assert.equal(tickets.length, dispatched.length);
const indexed = new Set(await Promise.all(calls.map(call => realpath(call.directory))));
for (const name of (await readdir(root)).filter(name => /^(generate|compare|probe)-/.test(name))) {
  assert.ok(!name.startsWith('probe-'));
  for (const child of await readdir(join(root, name, 'models'))) assert.ok(indexed.has(await realpath(join(root, name, 'models', child))), 'unindexed model archive');
}
const toolEvents = trajectories.flatMap(item => item.trace).filter(event => event.event === 'agent_tool');
const known = dispatched.filter(call => (call.model.usage?.prompt_tokens ?? call.model.prompt_tokens) != null && (call.model.usage?.completion_tokens ?? call.model.completion_tokens) != null);
const summary = { selected: rows.length, calibration_blocked: excluded.size, interface_blocked: interfaceBlocked.size,
  calibrated: tasks.length - excluded.size, legal_candidates: rows.filter(row => row.generation_status === 'GENERATED_UNVERIFIED').length,
  initial_attempt_legal: rows.filter(row => row.generation_attempts[0]?.candidate_valid).length,
  recovered_candidates: rows.filter(row => row.generation_status === 'GENERATED_UNVERIFIED' && row.generation_recoveries > 0).length,
  generation_failed: rows.filter(row => !['NOT_RUN', 'INTERFACE_BLOCKED', 'GENERATED_UNVERIFIED'].includes(row.generation_status)).length,
  compared: rows.filter(row => row.baseline_status !== 'NOT_RUN').length,
  baseline_pass: rows.filter(row => row.baseline_status === 'PASS').length, agent_pass: rows.filter(row => row.agent_status === 'VERIFIED').length,
  repair_opportunities: rows.filter(row => row.repair_eligible).length, repaired: rows.filter(row => row.recovered_by_agent).length,
  rtl_edits: rows.reduce((n, row) => n + row.semantic_repairs, 0), physical_dispatches: dispatched.length,
  generation_dispatches: dispatched.filter(call => call.phase === 'generation').length, agent_dispatches: dispatched.filter(call => call.phase === 'agent').length,
  tool_calls: toolEvents.length, accepted_tool_calls: toolEvents.filter(event => event.host_accepted).length,
  provider_max_tokens: dispatched.filter(call => call.transcript.provider_finish_kind === 'max-tokens').length,
  reasoning_only_truncations: dispatched.filter(call => call.transcript.provider_finish_kind === 'max-tokens' && !call.output && !call.chunks.some(event => event.chunk.type === 'tool-call-delta')).length,
  local_truncations: dispatched.filter(call => ['OUTPUT_TRUNCATED', 'truncated'].includes(call.transcript.error) && call.transcript.provider_finish_kind !== 'max-tokens').length,
  http_400: dispatched.filter(call => call.transport.http_status === 400).length,
  reasoning_returned_calls: dispatched.filter(call => call.transcript.reasoning_status === 'returned').length,
  reasoning_bytes: calls.reduce((n, call) => n + call.transcript.files['reasoning.txt'].bytes, 0),
  known_prompt_tokens: known.reduce((n, call) => n + (call.model.usage?.prompt_tokens ?? call.model.prompt_tokens), 0),
  known_completion_tokens: known.reduce((n, call) => n + (call.model.usage?.completion_tokens ?? call.model.completion_tokens), 0),
  unknown_usage_calls: dispatched.length - known.length };
await writeFile(join(analysisRoot, 'calls.jsonl'), calls.map(call => JSON.stringify(call)).join('\n') + '\n');
await writeFile(join(analysisRoot, 'tool-traces.jsonl'), trajectories.flatMap(item => item.trace.map(event => JSON.stringify({ task_id: item.task_id, ...event }))).join('\n') + '\n');
const audit = { integrity_audit: 'PASS', state: state.state, checked_at: new Date().toISOString(), frozen_files_checked: Object.keys(freeze.files).length, model_archives_checked: calls.length, summary, rows };
await writeFile(join(reportRoot, 'evidence-audit.json'), JSON.stringify(audit, null, 2));
await writeFile(join(reportRoot, 'call-index.json'), JSON.stringify(calls.map(({ request, context, chunks, reasoning, output, model, ...call }) => ({ ...call,
  model_status: model.error?.category ?? model.error_code ?? 'complete', selected_tools: model.message?.content.filter(block => block.type === 'tool-call').map(block => block.name) ?? [] })), null, 2));
const rate = (n, d) => d ? `${n}/${d} (${(100 * n / d).toFixed(2)}%)` : 'N/A';
let md = `# 全量 156 题测试报告\n\n状态：${state.state}。题单及源码以 campaign-freeze.json 为准。旧批次不覆盖，本次全部重新生成。\n\n## 核心结果\n\n| 指标 | 结果 |\n|---|---:|\n| 全部题目 | 156 |\n| 校准通过 / 阻塞 | ${summary.calibrated} / ${summary.calibration_blocked} |\n| 接口阻塞 | ${summary.interface_blocked} |\n| 首次调用合法 / 纠正后新增合法 | ${summary.initial_attempt_legal} / ${summary.recovered_candidates} |\n| 最终合法候选 | ${summary.legal_candidates} |\n| 已比较 | ${summary.compared} |\n| Baseline 已比较分母 | ${rate(summary.baseline_pass, summary.compared)} |\n| Agent 已比较分母 | ${rate(summary.agent_pass, summary.compared)} |\n| Baseline 校准题分母 | ${rate(summary.baseline_pass, summary.calibrated)} |\n| Agent 校准题分母 | ${rate(summary.agent_pass, summary.calibrated)} |\n| Baseline / Agent 全题库已验证覆盖 | ${rate(summary.baseline_pass, 156)} / ${rate(summary.agent_pass, 156)} |\n| 自然修复成功 | ${rate(summary.repaired, summary.repair_opportunities)} |\n| 实际 RTL 修改 | ${summary.rtl_edits} |\n| 物理调用 / 授权上限 | ${summary.physical_dispatches} / 20124 |\n| 生成 / 修复调用 | ${summary.generation_dispatches} / ${summary.agent_dispatches} |\n| 工具动作 / 接受 | ${summary.tool_calls} / ${summary.accepted_tool_calls} |\n| 已知输入 / 输出 token | ${summary.known_prompt_tokens} / ${summary.known_completion_tokens} |\n| 缺少 usage 调用 | ${summary.unknown_usage_calls} |\n\n`;
md += `## 口径\n\n全题库覆盖不是将评测阻塞算作模型答错。生成候选与可计分候选分开；非法候选不冒充 RTL 功能失败。生成最多初次加两次纠正，首次合法后不择优采样，因此不是严格单调用 pass@1。Baseline 和 Agent 共享同一候选及冻结评测器。每题最多 15 次接受的修改、60 个工具动作和 120 次修复请求；重试不重置预算。综合单次 600 秒，总验证 900 秒；模型请求 120 秒；总活动 8 小时仅容纳最坏情况，不延长各阶段上限。\n\n模型为 deepseek-flash；初次 high reasoning/8192 token，候选恢复 off/16384，普通修复 high/16384，修复强制动作 off/4096。思考模式下 temperature=0 不是确定性保证。多项协议与候选同时改变，不能把跨批次通过率差异仅归因于 15 轮。full_os_isolation_verified=false，开发环境运行不是完整操作系统隔离。\n\n`;
md += `## 日志与完整性\n\n- [完整调用 JSONL](../analysis/calls.jsonl)：请求、接口返回 reasoning/输出、全部已收到的规范化 chunk、工具参数和调用终态。\n- [Host 工具轨迹](../analysis/tool-traces.jsonl)：调用、拒绝、修改、验证、回滚与证据绑定。\n- [逐调用索引](call-index.json)；[证据审计](evidence-audit.json)；[完整文件清单](../evidence-files.json)。\n- 原始模型目录和 EDA 目录保留哈希、源码版本、命令、stdout/stderr、诊断及波形。\n\n保存的是接口实际返回的 reasoning，不是未公开内部思考；stream.jsonl 是 Harness 规范化流，不是原始 SSE 抓包。未发送的服务端内容无法保存；缺少 usage 不猜测计费。凭据不保存。共 ${summary.provider_max_tokens} 次 provider max-tokens，${summary.reasoning_only_truncations} 次仅 reasoning 截断，${summary.local_truncations} 次本地截断，${summary.http_400} 次 HTTP 400。\n\n## 逐题结果\n\n| 题目 | 生成 | 校准 | Baseline | Agent | 修改轮数 | 调用 |\n|---|---|---|---|---|---:|---:|\n`;
md += rows.map(row => `| [${row.task_id}](../analysis/${row.task_id}.md) | ${row.generation_status} | ${row.calibration_exclusion ? row.calibration_exclusion.reason : '通过'} | ${row.baseline_status} | ${row.agent_status} | ${row.semantic_repairs} | ${row.model_calls} |`).join('\n') + '\n';
md += '\n## 进一步分析\n\n不合法候选原因、Agent 增益限制、逐题修复轨迹及改进方向见 [分析结论](findings.zh.md)。\n';
await writeFile(join(reportRoot, 'report.zh.md'), md);
const files = [], links = [];
async function inventory(directory) {
  for (const name of (await readdir(directory)).sort()) {
    const path = join(directory, name), rel = relative(root, path).replaceAll('\\', '/'); if (rel === 'evidence-files.json') continue;
    const info = await lstat(path);
    if (info.isSymbolicLink()) { links.push({ path: rel, target: await readlink(path) }); continue; }
    if (info.isDirectory()) { await inventory(path); continue; }
    if (info.isFile()) { const bytes = await readFile(path); files.push({ path: rel, bytes: bytes.length, sha256: hash(bytes) }); }
  }
}
await inventory(root);
await writeFile(join(root, 'evidence-files.json'), JSON.stringify({ integrity_audit: 'PASS', created_at: new Date().toISOString(), state: state.state, summary,
  total_files: files.length, total_bytes: files.reduce((n, file) => n + file.bytes, 0), excluded: ['evidence-files.json'], links, files }, null, 2));
process.stdout.write(JSON.stringify({ integrity_audit: 'PASS', ...summary }, null, 2) + '\n');
