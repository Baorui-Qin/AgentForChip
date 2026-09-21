import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { createHash } from 'node:crypto'

const root = process.argv[2]
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const maybe = async path => { try { return await json(path) } catch (error) { if (error.code === 'ENOENT') return null; throw error } }
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const canonical = value => value === null || typeof value !== 'object' ? value : Array.isArray(value) ? value.map(canonical) : Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
const evidenceHash = value => hash(JSON.stringify(canonical(value)))
const lines = async path => (await readFile(path, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse)
const freeze = await json(join(root, 'campaign-freeze.json'))
for (const [path, digest] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), digest, `freeze:${path}`)
const settings = await json(join(root, 'stability.json'))
const tasks = (await json(join(root, settings.manifestFile))).task_ids
assert.equal(hash(await readFile(join(root, settings.manifestFile))), settings.manifestSha256)
const excluded = new Map(settings.calibrationExcluded.map(item => [item.task_id, item]))
const calls = [], trajectories = [], rows = []
const reportRoot = join(root, 'report'), analysisRoot = join(root, 'analysis')
await mkdir(reportRoot, { recursive: true }); await mkdir(analysisRoot, { recursive: true })

async function auditCall(directory, task, phase, sequence) {
  const model = await json(join(directory, 'model.json')), transcript = await json(join(directory, 'transcript.json'))
  for (const [path, entry] of Object.entries(transcript.files)) {
    const bytes = await readFile(join(directory, path))
    assert.equal(bytes.length, entry.bytes); assert.equal(hash(bytes), entry.sha256)
  }
  const chunks = await lines(join(directory, 'stream.jsonl'))
  assert.equal(chunks.length, transcript.chunk_count)
  const projection = new Map(), toolProjection = new Map()
  for (const [index, event] of chunks.entries()) {
    assert.equal(event.seq, index)
    const c = event.chunk
    if (c.type === 'text-delta' || c.type === 'reasoning-delta') {
      const item = projection.get(c.index) ?? { type: c.type === 'text-delta' ? 'text' : 'reasoning', text: '' }
      if (!item.closed) item.text += c.text
      projection.set(c.index, item)
    }
    if (c.type === 'block-end' && ['text', 'reasoning'].includes(c.block.type)) projection.set(c.index, { ...c.block, closed: true })
    if (c.type === 'tool-call-delta') {
      const item = toolProjection.get(c.index) ?? { id: c.id, name: '', arguments: '' }
      if (!item.closed) { item.id = c.id; if (c.name) item.name = c.name; item.arguments += c.argumentsDelta }
      toolProjection.set(c.index, item)
    }
    if (c.type === 'block-end' && c.block.type === 'tool-call') toolProjection.set(c.index, { ...c.block, closed: true })
    if (c.type === 'finish' && ['error', 'aborted'].includes(c.reason.kind)) assert.equal(c.reason.failure, undefined)
  }
  const reasoning = await readFile(join(directory, 'reasoning.txt'), 'utf8'), output = await readFile(join(directory, 'output.txt'), 'utf8')
  for (const [type, actual] of [['reasoning', reasoning], ['text', output]]) {
    assert.equal(actual, [...projection.values()].filter(b => b.type === type && b.text.trim()).map(b => b.text).join(''))
  }
  const wire = await maybe(join(directory, 'prompt-final.json')) ?? await maybe(join(directory, 'prompt-final.txt'))
  const dispatch = await maybe(join(directory, 'dispatch.json'))
  if (wire && dispatch?.request_sha256) assert.equal(hash(JSON.stringify(wire)), dispatch.request_sha256)
  const context = await maybe(join(directory, 'context.json'))
  const transport = await json(join(directory, 'transport.json'))
  for (const call of model.message?.content.filter(b => b.type === 'tool-call') ?? []) {
    const raw = [...toolProjection.values()].find(t => t.id === call.id)
    assert.ok(raw); assert.equal(raw.name, call.name); assert.equal(raw.arguments, call.arguments)
  }
  const call = { task_id: task, phase, sequence, directory, dispatched: model.dispatched, request: wire, context,
    request_sha256: dispatch?.request_sha256 ?? null, reasoning, output, model, transport, transcript, chunks }
  calls.push(call)
  return call
}

for (const task of tasks) {
  const genDir = join(root, `generate-${task}`), target = join(root, `compare-${task}`)
  const generation = await maybe(join(genDir, 'result.json')), comparison = await maybe(join(target, 'result.json'))
  if (excluded.has(task)) { assert.equal(generation, null); assert.equal(comparison, null) }
  for (const [index, directory] of (generation?.model_runs ?? []).entries()) await auditCall(directory, task, 'generation', index + 1)
  for (const [index, directory] of (comparison?.model_runs ?? []).entries()) await auditCall(directory, task, 'agent', index + 1)
  if (generation?.status === 'GENERATED_UNVERIFIED') {
    assert.equal(hash(await readFile(join(genDir, 'initial.sv'))), generation.source_sha256)
    assert.equal(generation.logical_initial_requests, 1)
    assert.equal(generation.generation_attempts.filter(a => a.candidate_valid).length, 1)
  }
  let trace = [], verifications = []
  const verificationDetails = []
  if (comparison) {
    trace = await lines(join(target, 'tool-trace.jsonl'))
    verifications = trace.filter(e => e.event === 'verification')
    assert.equal(comparison.shared_initial_sha256, generation.source_sha256)
    assert.equal(comparison.initial_generation_charged_again, false)
    if (verifications.length) assert.equal(verifications[0].source_sha256, generation.source_sha256)
    const receipts = new Map()
    for (const [index, event] of verifications.entries()) {
      const bytes = await readFile(join(event.verification_run_id, 'result.json')), record = JSON.parse(bytes)
      const receipt = await json(join(target, `feedback-${index + 1}.json`))
      verificationDetails.push({ directory: event.verification_run_id, trigger: event.verification_trigger,
        diagnostic_completeness: receipt.stages.map(s => ({ stage: s.stage, complete: s.complete, process_clean: s.process_clean,
          diagnostics_omitted: record.stages[s.stage]?.diagnostics_omitted ?? null,
          diagnostic_excerpt_truncated: record.stages[s.stage]?.diagnostic_excerpt_truncated ?? null })),
        final_status: record.final_status, failed_stages: Object.entries(record.stages).filter(([, s]) => s && !['PASS', 'SKIPPED'].includes(s.status)).map(([stage, s]) => ({
          stage, status: s.status, failure_domain: s.failure_domain, errors: s.errors, evidence: s.evidence })) })
      assert.equal(hash(bytes), event.result_sha256); assert.equal(evidenceHash(receipt), event.feedback_sha256)
      assert.equal(record.final_source_sha256, event.source_sha256); assert.equal(receipt.result_sha256, event.result_sha256)
      assert.equal(event.checks, record.stages.simulation?.evidence.checks_executed ?? null)
      assert.equal(event.mismatches, record.stages.simulation?.evidence.mismatch_count ?? null)
      assert.equal(event.final_status, record.final_status)
      for (const log of event.simulation_logs) assert.equal(hash(await readFile(join(event.verification_run_id, log.path))), log.sha256)
      const invocations = record.stages.simulation?.invocations.filter(i => i.version_matches === null) ?? []
      assert.equal(event.xsim_executed, invocations.length > 0)
      if (event.xsim_executed) assert.ok(invocations.some(i => /xsim\.(?:bat|exe)$/i.test(i.executable)))
      receipts.set(event.feedback_sha256, receipt)
    }
    for (const event of trace.filter(e => e.event === 'model_request')) {
      const call = calls.find(c => c.directory === event.model_run_id)
      assert.ok(call); assert.equal(hash(JSON.stringify(call.request)), event.request_sha256)
      assert.deepEqual(call.request.tools.map(t => t.function.name), event.available_tools)
      if (event.consumed_feedback_sha256) {
        assert.equal(evidenceHash(call.context.feedback), event.consumed_feedback_sha256)
        assert.ok(receipts.has(event.consumed_feedback_sha256)); assert.equal(call.transport.model_output_observed, true)
        const rendered = JSON.parse(call.request.messages.find(m => m.role === 'user').content)
        assert.equal(evidenceHash({ observed: rendered.observed, additional_diagnostics: rendered.additional_diagnostics }), event.feedback_projection_sha256)
      }
    }
    for (const event of trace.filter(e => e.event === 'agent_tool')) {
      const call = calls.find(c => c.directory === event.model_run_id).model.message.content.find(b => b.type === 'tool-call')
      assert.equal(call.name, event.selected_tool); assert.equal(call.id, event.tool_call_id); assert.equal(hash(call.arguments), event.arguments_sha256)
      if (event.host_accepted) assert.ok(event.available_tools.includes(event.selected_tool))
    }
    if (comparison.status === 'VERIFIED') {
      assert.equal(hash(await readFile(join(target, 'final.sv'))), comparison.verified_source_sha256)
      assert.equal((await json(join(comparison.final_verification_run, 'result.json'))).final_verified, true)
    }
    trajectories.push({ task_id: task, result: comparison, trace })
  }
  const selectedCalls = calls.filter(c => c.task_id === task)
  const row = { task_id: task, calibration_exclusion: excluded.get(task) ?? null,
    generation_status: excluded.has(task) ? 'EVALUATOR_BLOCKED' : generation?.status ?? 'NOT_RUN',
    baseline_status: comparison?.initial_status ?? 'NOT_RUN', agent_status: comparison?.status ?? 'NOT_RUN',
    model_calls: selectedCalls.filter(c => c.dispatched).length, transport_retries: (generation?.transport_retries ?? 0) + (comparison?.transport_retries ?? 0),
    output_recoveries: (generation?.output_recovery_attempts ?? 0) + (comparison?.output_recovery_attempts ?? 0),
    reasoning_bytes: selectedCalls.reduce((n, c) => n + c.transcript.files['reasoning.txt'].bytes, 0),
    output_bytes: selectedCalls.reduce((n, c) => n + c.transcript.files['output.txt'].bytes, 0),
    tool_calls: trace.filter(e => e.event === 'agent_tool').length,
    verification_details: verificationDetails,
    policy_decisions: comparison?.repair_decisions ?? [],
    semantic_repairs: comparison?.semantic_repairs ?? 0, recovered_by_agent: comparison?.recovered_by_agent ?? false,
    verification_runs: verifications.map(e => ({ directory: e.verification_run_id, trigger: e.verification_trigger,
      status: e.final_status, checks: e.checks, mismatches: e.mismatches, xsim_executed: e.xsim_executed, synthesis_executed: e.synthesis_executed })),
    analysis_file: `../analysis/${task}.md` }
  rows.push(row)
  const fence = (language, value) => { const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2); const runs = text.match(/`+/g) ?? []; const marker = '`'.repeat(Math.max(3, ...runs.map(v => v.length + 1))); return `${marker}${language}\n${text}\n${marker}\n` }
  let md = `# ${task}\n\n${fence('json', row)}\n`
  for (const call of selectedCalls) {
    md += `## ${call.phase} ${call.sequence}\n\n原始目录：\`${call.directory}\`\n\n### 请求\n\n${fence('json', call.request)}\n### 接口返回 reasoning\n\n${fence('text', call.reasoning)}\n### 接口返回正文\n\n${fence('text', call.output)}\n### 模型终态与工具调用\n\n${fence('json', call.model)}\n### 完整性\n\n${fence('json', call.transcript)}\n`
  }
  md += `## Host 工具与验证轨迹\n\n${fence('json', trace)}\n`
  await writeFile(join(analysisRoot, task + '.md'), md)
}
for (const name of (await readdir(root)).filter(name => name.startsWith('probe-'))) {
  const probe = await json(join(root, name, 'result.json'))
  for (const [index, directory] of probe.model_runs.entries()) await auditCall(directory, probe.task_id, 'health_probe', index + 1)
}
const dispatched = calls.filter(c => c.dispatched)
const liveState = await maybe(join(reportRoot, 'latest.json'))
if (liveState?.state === 'COMPARISON_FINISHED') {
  const tickets = (await readdir(join(root, 'dispatches'))).filter(name => name.endsWith('.json'))
  assert.equal(tickets.length, dispatched.length, 'every reserved dispatch has a retained model result')
  const indexed = new Set(calls.map(call => call.directory))
  for (const name of (await readdir(root)).filter(name => /^(generate|compare|probe)-/.test(name))) {
    for (const child of await readdir(join(root, name, 'models'))) assert.ok(indexed.has(join(root, name, 'models', child)), 'unindexed model run')
  }
}
const known = dispatched.filter(c => (c.model.usage?.prompt_tokens ?? c.model.prompt_tokens) != null && (c.model.usage?.completion_tokens ?? c.model.completion_tokens) != null)
const summary = { selected: rows.length, calibration_blocked: excluded.size, runnable: tasks.length - excluded.size,
  generation_failures: rows.filter(r => !['EVALUATOR_BLOCKED', 'GENERATED_UNVERIFIED', 'NOT_RUN'].includes(r.generation_status)).length,
  candidates: rows.filter(r => r.generation_status === 'GENERATED_UNVERIFIED').length,
  compared: rows.filter(r => r.baseline_status !== 'NOT_RUN').length,
  baseline_pass: rows.filter(r => r.baseline_status === 'PASS').length, agent_pass: rows.filter(r => r.agent_status === 'VERIFIED').length,
  repaired: rows.filter(r => r.recovered_by_agent).length,
  natural_repair_opportunities: trajectories.filter(t => t.result.repair_eligible).length,
  physical_dispatches: dispatched.length, generation_dispatches: dispatched.filter(c => c.phase === 'generation').length,
  agent_dispatches: dispatched.filter(c => c.phase === 'agent').length, probe_dispatches: dispatched.filter(c => c.phase === 'health_probe').length,
  transport_retries: rows.reduce((n, r) => n + r.transport_retries, 0), output_recoveries: rows.reduce((n, r) => n + r.output_recoveries, 0),
  tool_calls: rows.reduce((n, r) => n + r.tool_calls, 0),
  tasks_with_agent_tools: rows.filter(r => r.tool_calls > 0).length,
  known_prompt_tokens: known.reduce((n, c) => n + (c.model.usage?.prompt_tokens ?? c.model.prompt_tokens), 0),
  known_completion_tokens: known.reduce((n, c) => n + (c.model.usage?.completion_tokens ?? c.model.completion_tokens), 0),
  unknown_usage_requests: dispatched.length - known.length,
  calls_with_returned_reasoning: dispatched.filter(c => c.transcript.reasoning_status === 'returned').length,
  reasoning_bytes: calls.reduce((n, c) => n + c.transcript.files['reasoning.txt'].bytes, 0),
  complete_responses: dispatched.filter(c => c.transcript.response_complete).length,
  http_200_responses: dispatched.filter(c => c.transport.http_status === 200).length,
  max_token_responses: dispatched.filter(c => c.transcript.provider_finish_kind === 'max-tokens').length,
  reasoning_only_truncations: dispatched.filter(c => c.transcript.provider_finish_kind === 'max-tokens' && c.output.length === 0 && !c.chunks.some(e => e.chunk.type === 'tool-call-delta')).length,
  simulation_runs: rows.flatMap(r => r.verification_runs).filter(v => v.xsim_executed).length,
  synthesis_runs: rows.flatMap(r => r.verification_runs).filter(v => v.synthesis_executed).length }
const audit = { schema_version: 'p10-analysis-1', integrity_audit: 'PASS', verified_at: new Date().toISOString(),
  frozen_files_checked: Object.keys(freeze.files).length, model_archives_checked: calls.length,
  transcript_scope: 'all received Harness-normalized chunks; excludes secrets and unpublished reasoning; request limits still apply', summary, rows }
await writeFile(join(reportRoot, 'evidence-audit.json'), JSON.stringify(audit, null, 2))
await writeFile(join(analysisRoot, 'calls.jsonl'), calls.map(c => JSON.stringify(c)).join('\n') + (calls.length ? '\n' : ''))
await writeFile(join(analysisRoot, 'tool-traces.jsonl'), trajectories.flatMap(t => t.trace.map(event => JSON.stringify({ task_id: t.task_id, ...event }))).join('\n') + (trajectories.length ? '\n' : ''))
await writeFile(join(reportRoot, 'call-index.json'), JSON.stringify(calls.map(({ chunks, request, context, reasoning, output, model, ...c }) => ({ ...c, model_status: model.error?.category ?? model.error_code ?? 'complete',
  finish_reason: model.finish_reason ?? model.finish_kind, prompt_tokens: model.usage?.prompt_tokens ?? model.prompt_tokens ?? null,
  completion_tokens: model.usage?.completion_tokens ?? model.completion_tokens ?? null,
  request_wall_ms: model.timing?.request_wall_ms ?? model.request_wall_ms,
  available_tools: request?.tools?.map(t => t.function.name) ?? [],
  selected_tools: model.message?.content?.filter(b => b.type === 'tool-call').map(b => b.name) ?? [],
  relative_directory: relative(root, c.directory).replaceAll('\\', '/') })), null, 2))
const fields = ['task_id', 'generation_status', 'baseline_status', 'agent_status', 'model_calls', 'tool_calls', 'semantic_repairs', 'recovered_by_agent', 'reasoning_bytes', 'output_bytes']
await writeFile(join(reportRoot, 'tasks.csv'), fields.join(',') + '\n' + rows.map(r => fields.map(f => JSON.stringify(r[f] ?? '')).join(',')).join('\n') + '\n')
const rate = (n, d) => d ? `${n}/${d} (${(100 * n / d).toFixed(2)}%)` : 'N/A'
const pending = rows.filter(r => !excluded.has(r.task_id) && (r.generation_status === 'NOT_RUN' || r.generation_status === 'GENERATED_UNVERIFIED' && r.agent_status === 'NOT_RUN'))
let md = `# 固定 40 题完整记录报告\n\n状态：${pending.length ? '未完成，以下不是最终成绩' : '本批次执行结束'}。固定清单 ${settings.manifestSha256}。\n\n## 结果\n\n| 指标 | 结果 |\n|---|---:|\n| 固定题数 | ${summary.selected} |\n| 历史校准阻塞 | ${summary.calibration_blocked} |\n| 可运行题数 | ${summary.runnable} |\n| 合法新候选 | ${summary.candidates} |\n| 已进行初始对照 | ${summary.compared} |\n| Baseline 四阶段通过（已对照分母） | ${rate(summary.baseline_pass, summary.compared)} |\n| Agent 四阶段通过（已对照分母） | ${rate(summary.agent_pass, summary.compared)} |\n| Agent 固定清单覆盖 | ${rate(summary.agent_pass, summary.selected)} |\n| 自然修复恢复 | ${rate(summary.repaired, summary.natural_repair_opportunities)} |\n| 实际模型 dispatch | ${summary.physical_dispatches} |\n| 生成 / Agent / 探针 | ${summary.generation_dispatches} / ${summary.agent_dispatches} / ${summary.probe_dispatches} |\n| 工具调用 | ${summary.tool_calls} |\n| 传输重试 / 输出恢复 | ${summary.transport_retries} / ${summary.output_recoveries} |\n| XSim / 综合执行 | ${summary.simulation_runs} / ${summary.synthesis_runs} |\n| 返回 reasoning 的调用 | ${summary.calls_with_returned_reasoning} |\n| reasoning UTF-8 字节数 | ${summary.reasoning_bytes} |\n| 已知输入 / 输出 token | ${summary.known_prompt_tokens} / ${summary.known_completion_tokens} |\n| 缺少 usage 的请求 | ${summary.unknown_usage_requests} |\n\n`
md += `## 分析入口\n\n- [逐调用索引](call-index.json)：关联任务、阶段、请求哈希、完整性、文件路径。\n- [完整调用 JSONL](../analysis/calls.jsonl)：每行含完整请求、接口返回 reasoning、正文、规范化流、模型终态及工具参数。\n- [完整工具轨迹 JSONL](../analysis/tool-traces.jsonl)：Host 初始验证与 Agent 选中工具分开记录。\n- [逐题 CSV](tasks.csv) 与 [证据审计](evidence-audit.json)。\n- 原始模型目录保留 prompt-final、context、stream.jsonl、reasoning.txt、output.txt、transcript.json、model.json、transport.json。\n- 原始 EDA 目录保留快照、每次工具命令、stdout/stderr、仿真及综合结果。\n\n## 口径与限制\n\n使用 deepseek-flash、high reasoning、temperature 0、8192 输出 token、120 秒请求超时及 65536 响应字节上限；模型输入、技能和修复策略沿用前一轮。生成串行，EDA 最多两个独立作业。只保留第一个完整合法候选，不择优重采样。有限重试由冻结配置决定。\n\n日志包含接口实际返回并交给 Harness 的全部规范化 chunk，包括触发限制的最后一个 chunk；不是原始 HTTP/SSE 抓包。未公开的内部思考无法取得；凭据、请求头、原始异常文本不记录。截断或超时请求的归档包含已收到的部分内容，不能声称包含服务端未发送的剩余输出。\n\nProb080_timer 因 PUBLIC_INTERFACE_UNSUPPORTED 阻塞；Prob031_dff 因公开输入 q 与参考输出 q 冲突导致正例校准不通过。两题均保留在固定 40 题中，不调用模型、不换题、不算模型错误。正负例校准复用历史已封存结果，未在本轮重跑。full_os_isolation_verified=false；真实 EDA 不是完整操作系统隔离。\n\n未生成合法候选、未完成 EDA 和基础设施异常不应统称为 RTL 逻辑失败；已对照分母、可运行分母与固定 40 题覆盖须分别使用。本批次不混入旧十题的候选或成绩。\n\n## 逐题结果\n\n| 题目 | 生成 | Baseline | Agent | 模型调用 | 工具调用 | reasoning 字节 |\n|---|---|---|---|---:|---:|---:|\n`
md += rows.map(r => `| [${r.task_id}](${r.analysis_file}) | ${r.generation_status} | ${r.baseline_status} | ${r.agent_status} | ${r.model_calls} | ${r.tool_calls} | ${r.reasoning_bytes} |`).join('\n') + '\n'
md += `\n## 固定分母补充\n\n生成失败 ${summary.generation_failures} 题。以上已对照分母排除了没有合法候选的题目，不能单独用来代表端到端成功率。按全部 ${summary.runnable} 道已校准题目计算（生成失败仍计入分母），Baseline 为 ${rate(summary.baseline_pass, summary.runnable)}，Agent 为 ${rate(summary.agent_pass, summary.runnable)}；按固定 40 题覆盖计算，Agent 为 ${rate(summary.agent_pass, summary.selected)}。\n`
md += `\n## 工具调用口径\n\n生成阶段不提供 Agent 工具。每个合法候选先由 Host 进行初始验证；只有初始失败且符合修复策略时才请求模型选择工具。因此 Agent 通过总数包含无需修复的初始通过项，不能解释为每题都发生了模型工具调用。本轮有 ${summary.tasks_with_agent_tools} 题发生 Agent 工具调用，共 ${summary.tool_calls} 次。\n`
for (const row of rows.filter(r => r.tool_calls > 0)) {
  const trajectory = trajectories.find(t => t.task_id === row.task_id)
  const toolEvents = trajectory.trace.filter(e => e.event === 'agent_tool')
  md += `\n${row.task_id} 的真实工具顺序：${toolEvents.map(e => `${e.selected_tool}（${e.host_accepted ? 'Host 接受' : 'Host 拒绝'}）`).join(' → ')}。仿真轨迹：${row.verification_runs.map(v => `${v.trigger}: ${v.mismatches}/${v.checks} 失配`).join(' → ')}。最终状态 ${row.agent_status}，不能记为成功修复。\n`
}
const failures = rows.filter(r => r.calibration_exclusion || !['NOT_RUN', 'VERIFIED'].includes(r.agent_status) || !['NOT_RUN', 'GENERATED_UNVERIFIED'].includes(r.generation_status))
md += `\n## 响应完整性\n\n${summary.http_200_responses}/${summary.physical_dispatches} 次调用观测到 HTTP 200。${summary.complete_responses} 次完整终态；${summary.max_token_responses} 次为服务端 max-tokens，其中 ${summary.reasoning_only_truncations} 次仅返回 reasoning，既无正文，也无工具参数增量。这里没有把 HTTP 200 等同于任务成功，也没有将已完整保存的部分流误称为完整模型回答。\n\n原始证据文件、字节数和 SHA-256 见 [完整文件清单](../evidence-files.json)。该清单不递归复制依赖库链接或外部封存 evaluator；对应链接目标另行列明，评测输入受 campaign-freeze.json 哈希约束。\n`
if (failures.length) {
  md += '\n## 未通过或受限项目\n\n'
  for (const row of failures) {
    const last = row.verification_details.at(-1)
    const callErrors = calls.filter(c => c.task_id === row.task_id && !c.transcript.response_complete).map(c => `${c.phase} ${c.sequence}: ${c.transcript.error}, provider finish=${c.transcript.provider_finish_kind ?? '未收到'}`)
    md += `### ${row.task_id}\n\n生成：${row.generation_status}；Baseline：${row.baseline_status}；Agent：${row.agent_status}。\n\n`
    if (row.calibration_exclusion) md += `校准阻塞：${row.calibration_exclusion.reason}，不计为模型失败。\n\n`
    for (const decision of row.policy_decisions.filter(d => d.action === 'blocked')) md += `Host 策略阻塞：${decision.rule}；${decision.reason}\n\n`
    if (row.baseline_status === 'PASS' && row.agent_status !== 'VERIFIED') md += `注意：原始四阶段结果为 PASS，但 Agent 流程未接受最终导出，不能将此差异归为模型 RTL 功能退化。诊断完整性：${JSON.stringify(last?.diagnostic_completeness)}。\n\n`
    if (callErrors.length) md += callErrors.map(value => `- ${value}`).join('\n') + '\n\n'
    if (last?.failed_stages?.length) md += last.failed_stages.map(s => `- ${s.stage}: ${s.status}; failure_domain=${s.failure_domain ?? 'unknown'}; ${s.errors.map(e => e.message).join(' ')}`).join('\n') + '\n\n'
  }
}
await writeFile(join(reportRoot, 'report.zh.md'), md)
console.log(JSON.stringify({ integrity_audit: audit.integrity_audit, frozen_files_checked: audit.frozen_files_checked, ...summary }, null, 2))
