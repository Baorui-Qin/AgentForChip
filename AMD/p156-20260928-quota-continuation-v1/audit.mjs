import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, readdir, lstat, readlink, realpath } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { auditComparison } from 'file:///D:/deepseek-harness/rtl-tools/phase1/p10/acceptance-audit.mjs';

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
const continuation = await json(join(root, settings.manifestFile));
assert.equal(tasks.length, 2); assert.equal(new Set(tasks).size, 2);
assert.equal(continuation.context_restarted, true);
assert.equal(continuation.initial_candidates_regenerated, false);
assert.equal(hash(await readFile(join(root, settings.manifestFile))), settings.manifestSha256);
assert.equal(freeze.protocol.max_repair_rounds, 15); assert.equal(freeze.protocol.max_agent_requests, 120);
assert.equal(freeze.protocol.max_tool_steps, 60); assert.equal(freeze.protocol.max_generation_resumes, 0);
const campaignCap = freeze.protocol.campaign_max_dispatches;
assert.equal(campaignCap, continuation.added_dispatch_cap);
assert.equal(freeze.protocol.prior_campaign_dispatches, continuation.prior_combined_dispatches);
assert.ok(campaignCap + freeze.protocol.prior_campaign_dispatches <= 20124);
assert.equal(freeze.protocol.acceptance_protocol, 'p10-netlist-1');
assert.equal(freeze.protocol.rtl_evaluator, 'p10-settled-rtl-1');
const specConflicts = new Set(['Prob093_ece241_2014_q3', 'Prob149_ece241_2013_q4']);
assert.deepEqual(freeze.protocol.known_spec_conflicts, [...specConflicts]);
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
    const publicTask = catalog.find(item => item.task_id === task);
    assert.equal(context.task.spec, publicTask.spec);
    assert.deepEqual(context.task.interface, publicTask.interface);
    if (publicTask.public_interface_erratum) assert.ok(context.task.constraints.includes(publicTask.public_interface_erratum.explanation));
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
  const allocation = continuation.tasks.find(item => item.task_id === task);
  assert.equal(hash(await readFile(join(generationDirectory, 'result.json'))), hash(await readFile(join(continuation.prior_root, `generate-${task}/result.json`))));
  assert.equal(generation.source_sha256, allocation.source_sha256);
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
    await auditComparison(comparison, freeze.protocol.acceptance_protocol);
    assert.ok(comparison.semantic_repairs + allocation.used.edits <= 15);
    assert.ok(comparison.model_call_attempts + allocation.used.requests <= 120);
    assert.ok(comparison.actions.length + allocation.used.tools <= 60);
    assert.equal(comparison.budget_limits.agent_requests, allocation.remaining.requests);
    assert.equal(comparison.budget_limits.tool_actions, allocation.remaining.tools);
    assert.equal(comparison.shared_initial_sha256, generation.source_sha256); assert.equal(comparison.initial_generation_charged_again, false);
    trace = await lines(join(target, 'tool-trace.jsonl'));
    const receipts = new Map(), verifications = trace.filter(event => event.event === 'verification');
    assert.equal(verifications[0].source_sha256, generation.source_sha256);
    for (const [index, event] of verifications.entries()) {
      const bytes = await readFile(join(event.verification_run_id, 'result.json')), result = JSON.parse(bytes);
      const receipt = await json(join(target, `feedback-${index + 1}.json`));
      const snapshotPath = result.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest\.json$/.test(path));
      assert.ok(snapshotPath);
      const snapshot = await json(join(event.verification_run_id, snapshotPath));
      assert.equal(snapshot.evaluation.compatibility.protocol, freeze.protocol.rtl_evaluator);
      assert.equal(snapshot.evaluation.compatibility.manifest_sha256, hash(await readFile(join(freeze.preflight_root, 'derived/settled-rtl-manifest.json'))));
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
    }
    for (const revision of comparison.revisions) assert.equal(hash(await readFile(join(revision.directory, 'solution.sv'))), revision.sha256);
    for (const attempt of comparison.repair_attempts) {
      if (attempt.edit?.accepted) {
        const before = comparison.revisions.find(r => r.sha256 === attempt.edit.previous_source_sha256);
        const after = comparison.revisions.find(r => r.revision === attempt.edit.revision_id);
        assert.ok(before && after);
        let diff;
        try { diff = execFileSync('git', ['diff', '--no-index', '--no-ext-diff', '--', join(before.directory, 'solution.sv'), join(after.directory, 'solution.sv')], { encoding: 'utf8', windowsHide: true }); }
        catch (error) { if (error.status !== 1) throw error; diff = error.stdout; }
        await writeFile(join(analysisRoot, `${task}-revision-${attempt.semantic_round}.diff`), diff);
      }
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
    spec_reference_conflict: specConflicts.has(task), acceptance_protocol: comparison?.acceptance_protocol ?? null, netlist_acceptance: comparison?.acceptance_results ?? [],
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
assert.equal(state.state, 'SUPPLEMENTAL_FINISHED');
const dispatched = calls.filter(c => c.dispatched);
assert.ok(dispatched.length <= campaignCap);
const expected = new Map(), claimed = new Map();
for (const call of dispatched) expected.set(call.request_sha256, (expected.get(call.request_sha256) ?? 0) + 1);
for (const name of (await readdir(join(root, 'dispatches'))).filter(n => n.endsWith('.json'))) {
  const ticket = await json(join(root, 'dispatches', name)), digest = ticket.owner.request_sha256;
  claimed.set(digest, (claimed.get(digest) ?? 0) + 1);
}
assert.deepEqual(claimed, expected);
const indexed = new Set(await Promise.all(calls.map(c => realpath(c.directory))));
for (const task of tasks) for (const name of await readdir(join(root, `compare-${task}`, 'models'))) {
  assert.ok(indexed.has(await realpath(join(root, `compare-${task}`, 'models', name))));
}
const original = await json(join(continuation.prior_root, 'report/evidence-audit.json'));
const originalInventory = await json(join(continuation.prior_root, 'evidence-files.json'));
for (const file of originalInventory.files) assert.equal(hash(await readFile(join(continuation.prior_root, file.path))), file.sha256, file.path);
const power = await lines(join(root, 'power-request.jsonl'));
assert.equal(power.length, 2); assert.equal(power[0].event, 'acquired'); assert.equal(power[1].event, 'released');
assert.equal(power[0].pid, power[1].pid); assert.equal(power[1].campaign_exit, 0);
assert.equal(power[0].permanent_settings_changed, false); assert.equal(power[0].ac_line, 1);
const combined = original.rows.map(old => {
  const next = rows.find(row => row.task_id === old.task_id);
  if (!next) return old;
  assert.equal(old.agent_status, 'QUOTA'); assert.equal(next.baseline_status, old.baseline_status);
  assert.equal(next.verification_details[0].checks, old.verification_details[0].checks);
  assert.equal(next.verification_details[0].mismatches, old.verification_details[0].mismatches);
  return { ...next, original_agent_status: old.agent_status, supplemental_context_restarted: true };
});
const toolEvents = trajectories.flatMap(t => t.trace).filter(e => e.event === 'agent_tool');
const known = dispatched.filter(c => c.model.prompt_tokens != null && c.model.completion_tokens != null);
const summary = {
  interpretation: 'Independent supplemental evidence, not a rewritten original score or continuous-context repair experiment.',
  tasks: tasks.length, completed: rows.length, verified: rows.filter(r => r.agent_status === 'VERIFIED').length,
  added_dispatches: dispatched.length, prior_combined_dispatches: continuation.prior_combined_dispatches,
  combined_dispatches: continuation.prior_combined_dispatches + dispatched.length,
  added_dispatch_cap: campaignCap, original_total_authorized_cap: 20124,
  tool_calls: toolEvents.length, accepted_tool_calls: toolEvents.filter(e => e.host_accepted).length,
  known_prompt_tokens: known.reduce((n, c) => n + c.model.prompt_tokens, 0),
  known_completion_tokens: known.reduce((n, c) => n + c.model.completion_tokens, 0),
  unknown_usage_calls: dispatched.length - known.length,
  reasoning_returned_calls: dispatched.filter(c => c.transcript.reasoning_status === 'returned').length,
  context_restarted: true, initial_candidates_regenerated: false,
  original_baseline_pass: original.summary.baseline_pass, original_agent_pass: original.summary.agent_pass,
  supplemental_acceptance_coverage: combined.filter(r => r.agent_status === 'VERIFIED').length, denominator: 156,
  remaining_not_verified: combined.filter(r => r.agent_status !== 'VERIFIED').map(r => ({ task_id: r.task_id, status: r.agent_status }))
};
assert.ok(summary.combined_dispatches <= 20124);
const audit = { integrity_audit: 'PASS', checked_at: new Date().toISOString(), state: state.state,
  frozen_inputs_checked: Object.keys(freeze.files).length, original_files_rechecked: originalInventory.files.length,
  dispatch_ticket_request_hash_multiset_matches: true, power_request_released: true, summary, rows };
await writeFile(join(reportRoot, 'evidence-audit.json'), JSON.stringify(audit, null, 2) + '\n');
await writeFile(join(reportRoot, 'combined-results.json'), JSON.stringify({ summary, rows: combined }, null, 2) + '\n');
await writeFile(join(reportRoot, 'combined-results.csv'), ['task_id,baseline,original_agent,supplemental_agent,acceptance_after_supplement', ...combined.map(row => {
  const old = original.rows.find(r => r.task_id === row.task_id), extra = rows.find(r => r.task_id === row.task_id);
  return [row.task_id, old.baseline_status, old.agent_status, extra?.agent_status ?? '', row.agent_status].join(',');
})].join('\n') + '\n');
await writeFile(join(analysisRoot, 'calls.jsonl'), calls.map(c => JSON.stringify(c)).join('\n') + '\n');
await writeFile(join(analysisRoot, 'tool-traces.jsonl'), trajectories.flatMap(t => t.trace.map(e => JSON.stringify({ task_id: t.task_id, ...e }))).join('\n') + '\n');
await writeFile(join(reportRoot, 'call-index.json'), JSON.stringify(calls.map(({ request, context, chunks, reasoning, output, model, ...c }) => ({ ...c,
  request_wall_ms: model.request_wall_ms, prompt_tokens: model.prompt_tokens, completion_tokens: model.completion_tokens,
  model_status: model.error_code ?? 'complete', selected_tools: model.message?.content.filter(b => b.type === 'tool-call').map(b => b.name) ?? [] })), null, 2) + '\n');
const toolCounts = {};
for (const event of toolEvents) {
  const t = toolCounts[event.selected_tool] ??= { accepted: 0, rejected: 0 };
  t[event.host_accepted ? 'accepted' : 'rejected']++;
}
await writeFile(join(reportRoot, 'report.zh.md'), `# API 配额恢复后的独立续测报告

检查时间：${audit.checked_at}。源码仍为 \`25828d28f1064c6d265aefcca4031641115bd62c\`；评测器、模型参数和原始候选不变。

## 结果

| 题目 | 原批终态 | 独立续测 | 新增调用 | 累计修复调用 | 新增修改 |
|---|---|---|---:|---:|---:|
${rows.map(r => { const a = continuation.tasks.find(t => t.task_id === r.task_id); return `| [${r.task_id}](../analysis/${r.task_id}.md) | QUOTA | ${r.agent_status} | ${r.model_calls} | ${r.model_calls + a.used.dispatches} | ${r.semantic_repairs} |`; }).join('\n')}

原始 156 题结果保持为 Baseline **${summary.original_baseline_pass}/156**、Agent **${summary.original_agent_pass}/156**。加入独立续测后的验收覆盖为 **${summary.supplemental_acceptance_coverage}/156**，不替换原始评分。尚未验收的任务：${summary.remaining_not_verified.map(t => `${t.task_id} (${t.status})`).join('、') || '无'}。

## 口径与限制

用户确认配额恢复后追加独立记录。通过原批正常调度请求观察到 HTTP 200 和模型输出后执行，无额外健康探针。续测从同一初始 RTL 重建上下文，不是连续上下文的断点恢复；原题两次初始验证的状态、检查数和失配数均与原批相同。原有修复调用、工具动作、修改额度全部扣除，初始生成调用不重复计费。

两题新增调用 ${summary.added_dispatches} 次；含网络中断批次、原 156 题批次及本次续测，共 ${summary.combined_dispatches}/20124 次。新增已知输入/输出 token 为 ${summary.known_prompt_tokens}/${summary.known_completion_tokens}，缺失 usage ${summary.unknown_usage_calls} 次。保存接口实际返回的 reasoning，未公开内部思考不可记录；原批 HTTP 402 缺失 usage 的事实不改写。

Prob062/093/149 题面与参考冲突、Prob053 初态限制和 Prob058 工具故障仍存在；这些不是本次续测修复的内容。Agent 额外工具和预算仍不支持等资源的框架净贡献结论。有限仿真不是形式等价。

## 新增工具活动

| 工具 | 接受 | 拒绝 |
|---|---:|---:|
${Object.entries(toolCounts).map(([name, t]) => `| ${name} | ${t.accepted} | ${t.rejected} |`).join('\n')}

## 证据

- [原始 156 题报告](../../p156-20260927-v3/report/summary.zh.md)
- [156 行并列结果 CSV](combined-results.csv)；[并列结果 JSON](combined-results.json)
- [新增完整模型调用 JSONL](../analysis/calls.jsonl)；[新增 Host 工具轨迹](../analysis/tool-traces.jsonl)
- [新增逐调用索引](call-index.json)；[续测完整性审计](evidence-audit.json)；[文件哈希清单](../evidence-files.json)
- [扣减额度、候选来源及上下文重建声明](../continuation.json)

逐题 Markdown 含完整请求、返回 reasoning/输出和工具记录；revision diff、RTL 版本、原始 EDA 日志、VCD 和综合网表保留在本目录。原批完整文件逐一重算哈希，未覆盖或修改原结果。
`);
const files = [], links = [];
async function inventory(directory) {
  for (const name of (await readdir(directory)).sort()) {
    const path = join(directory, name), rel = relative(root, path).replaceAll('\\', '/');
    if (rel === 'evidence-files.json') continue;
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) { links.push({ path: rel, target: await readlink(path) }); continue; }
    if (stat.isDirectory()) { await inventory(path); continue; }
    if (stat.isFile()) { const bytes = await readFile(path); files.push({ path: rel, bytes: bytes.length, sha256: hash(bytes) }); }
  }
}
await inventory(root);
await writeFile(join(root, 'evidence-files.json'), JSON.stringify({ status: 'PASS', files, links, total_files: files.length,
  total_bytes: files.reduce((n, f) => n + f.bytes, 0), excludes: ['evidence-files.json'] }, null, 2) + '\n');
for (const file of files) assert.equal(hash(await readFile(join(root, file.path))), file.sha256, file.path);
console.log(JSON.stringify({ ...audit, rows: undefined, inventory_files: files.length, inventory_readback: 'PASS' }, null, 2));
