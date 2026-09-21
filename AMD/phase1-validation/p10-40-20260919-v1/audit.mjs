import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'report-v2');
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const freeze = await json(join(root, 'preflight-freeze.json'));
const selection = await json(join(root, 'manifest-40.json'));
const protocol = { ...freeze.protocol, authorized_model_dispatch_cap: selection.max_total_dispatches,
  per_group_dispatch_cap: freeze.protocol.authorized_model_dispatch_cap, explicit_selected_count: selection.task_ids.length };
const preflight = join(root, 'group-1');
const suitePath = join(preflight, 'derived/verilogeval-vivado2025.2-compat-v1-manifest.json');
const suiteHash = hash(await readFile(suitePath));
const suite = await json(suitePath);
const catalog = await json(join(preflight, 'catalog.json'));
const ready = await json(join(root, 'preflight-40.json'));
const issues = [], models = [], runs = [], rows = [];
const calibrationRuns = [];
if (suiteHash !== freeze.protocol.compatibility_manifest_sha256) issues.push('Suite manifest changed');
for (const group of ['files', 'historical']) {
  for (const [file, expected] of Object.entries(freeze[group])) if (hash(await readFile(file)) !== expected) issues.push(`${group} changed: ${file}`);
}
for (const task of catalog) for (const [file, expected] of Object.entries(task.assets)) {
  if (hash(await readFile(join('D:/AMD/verilog-eval', file))) !== expected) issues.push(`Upstream changed: ${file}`);
}
for (const row of ready) for (const kind of ['positive', 'negative']) {
  const control = row[kind];
  if (!control) continue;
  const record = await json(join(control.run, 'result.json'));
  const manifestPath = record.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path));
  const manifest = await json(join(control.run, manifestPath));
  const effective = suite.tasks.find(t => t.task_id === row.task_id);
  if (manifest.files['trusted/tb.sv'] !== effective.effective_tb_sha256 || manifest.evaluation.compatibility.manifest_sha256 !== suiteHash || manifest.evaluation.defaultTimescale !== '1ps/1ps') issues.push(`Calibration identity changed: ${control.run}`);
  for (const [file, expected] of Object.entries(manifest.files)) if (hash(await readFile(join(control.run, dirname(manifestPath), file))) !== expected) issues.push(`Calibration snapshot changed: ${control.run}/${file}`);
  const sim = record.stages.simulation;
  if (row.evaluable && (record.stages.compile.status !== 'PASS' || record.stages.elaborate.status !== 'PASS' || !sim.evidence.test_completed || !(sim.evidence.checks_executed > 0) ||
    (kind === 'positive' ? sim.status !== 'PASS' || sim.evidence.mismatch_count !== 0 : sim.status !== 'FAIL' || !(sim.evidence.mismatch_count > 0)))) issues.push(`Invalid calibration verdict: ${control.run}`);
  calibrationRuns.push({task_id:row.task_id,kind,directory:control.run,status:sim.status,evidence:sim.evidence});
}
async function inspect(directory) {
  const result = await json(join(directory, 'result.json'));
  for (const modelRoot of result.model_runs) {
    const model = await json(join(modelRoot, 'model.json'));
    const path = join(modelRoot, result.command === 'generate' ? 'prompt-final.json' : 'prompt-final.txt');
    let wire = null;
    try { wire = await readFile(path, 'utf8'); } catch (error) { if (error.code !== 'ENOENT') throw error; if (model.dispatched) issues.push(`Dispatched prompt missing: ${modelRoot}`); }
    if (wire && /module\s+(?:RefModule|stimulus_gen|tb)\b|preflight_reference\s*\(|VIVADO_COMPAT_001/.test(wire)) issues.push(`Trusted evaluator content exposed: ${modelRoot}`);
    if (result.command === 'generate' && wire) {
      const body = JSON.parse(wire);
      if (body.tools?.length) issues.push(`Baseline has tools: ${modelRoot}`);
      for (const message of body.messages ?? []) if (message.role === 'user') {
        const user = JSON.parse(typeof message.content === 'string' ? message.content : message.content[0].text);
        if (user.current !== null || user.observed !== null || user.history.length || user.guidance.length) issues.push(`Baseline has feedback or guidance: ${modelRoot}`);
      }
    }
    models.push({ task_id: result.task_id, route: result.command, directory: modelRoot, dispatched: model.dispatched,
      prompt_tokens: model.usage?.prompt_tokens ?? model.prompt_tokens ?? null, completion_tokens: model.usage?.completion_tokens ?? model.completion_tokens ?? null,
      request_wall_ms: model.timing?.request_wall_ms ?? model.request_wall_ms ?? null, request_sha256: wire ? hash(wire) : null, error: model.error ?? model.error_code ?? null });
  }
  for (const run of result.verification_runs) {
    const record = await json(join(run, 'result.json'));
    const manifestPath = record.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path));
    if (!manifestPath) throw new Error(`Snapshot manifest missing: ${run}`);
    const manifest = await json(join(run, manifestPath));
    const effective = suite.tasks.find(t => t.task_id === result.task_id);
    const identity = manifest.evaluation.compatibility;
    if (manifest.files['trusted/tb.sv'] !== effective.effective_tb_sha256 || identity.effective_tb_sha256 !== effective.effective_tb_sha256 ||
      identity.manifest_sha256 !== suiteHash || identity.compatibility_version !== suite.compatibility_version ||
      identity.vivado_version !== '2025.2' || identity.dataset_revision !== suite.dataset_revision || manifest.evaluation.defaultTimescale !== '1ps/1ps') issues.push(`Wrong evaluator identity: ${run}`);
    for (const [path, expected] of Object.entries(manifest.files)) {
      if (hash(await readFile(join(run, dirname(manifestPath), path))) !== expected) issues.push(`Snapshot bytes changed: ${run}/${path}`);
    }
    for (const invocation of record.stages.synthesis?.invocations ?? []) if (invocation.sources.some(s => s.role !== 'dut')) issues.push(`Synthesis uses non-DUT source: ${run}`);
    let edaWallMs = 0;
    for (const stage of Object.values(record.stages)) {
      for (const invocation of stage.invocations ?? []) {
        const p = invocation.process;
        edaWallMs += p.duration_ms;
        if (stage.status === 'PASS' && (p.cancelled || p.timed_out || p.log_truncated || p.signal ||
          (invocation.version_matches === true && invocation.args.length === 1 && invocation.args[0] === '-version' ? ![0, 1].includes(p.exit_code) : p.exit_code !== 0))) issues.push(`Unclean PASS: ${run}`);
      }
    }
    if (record.final_verified && (Object.values(record.stages).some(s => s.status !== 'PASS') || record.stages.simulation.evidence.checks_executed <= 0 || record.stages.simulation.evidence.mismatch_count !== 0)) issues.push(`Invalid final verdict: ${run}`);
    runs.push({ task_id: result.task_id, directory: run, source_sha256: record.final_source_sha256, verification_key: record.verification_key,
      evaluator_sha256: effective.effective_tb_sha256, compatibility_version: identity.compatibility_version, manifest_sha256: suiteHash,
      verified: record.final_verified, status: record.final_status, eda_wall_ms: edaWallMs,
      stages: Object.fromEntries(Object.entries(record.stages).map(([k, v]) => [k, v.status])), simulation: record.stages.simulation.evidence,
      diagnostics: Object.values(record.stages).flatMap(stage => stage.errors.map(error => ({stage:stage.stage, failure_domain:stage.failure_domain, ...error}))) });
  }
  if (result.status === 'VERIFIED') {
    const exported = hash(await readFile(join(directory, 'final.sv')));
    if (exported !== result.current_source_sha256 || exported !== result.verified_source_sha256 || exported !== result.final_exported_sha256) issues.push(`Export SHA mismatch: ${directory}`);
  }
  return result;
}
let ticketCount = 0;
for (let group = 1; group <= 4; group++) {
  const groupRoot = join(root, `group-${group}`);
  const groupFreeze = await json(join(groupRoot, 'freeze.json'));
  for (const [file, expected] of Object.entries(groupFreeze.files)) {
    if (hash(await readFile(file)) !== expected) issues.push(`Group freeze changed: ${file}`);
  }
  const groupOrder = await json(join(groupRoot, 'selection-order.json'));
  if (JSON.stringify(groupOrder) !== JSON.stringify(selection.task_ids.slice((group - 1) * 10, group * 10))) issues.push(`Group ${group} selection mismatch`);
  ticketCount += (await readdir(join(groupRoot, 'dispatches'))).filter(name => name.endsWith('.json')).length;
}
for (const [index, task] of selection.task_ids.entries()) {
  const calibration = ready.find(r => r.task_id === task);
  const groupRoot = join(root, `group-${Math.floor(index / 10) + 1}`);
  if (!calibration?.evaluable) {
    rows.push({ task_id: task, evaluator_status: calibration?.compat_status ?? 'INCONCLUSIVE',
      baseline_status: 'NOT_RUN', agent_status: 'NOT_RUN', category: calibration?.category,
      reason: calibration?.reason, model_failure: false, semantic_repairs: 0, agent_extra_requests: 0,
      physical_dispatches: 0, prompt_tokens: 0, completion_tokens: 0 });
    continue;
  }
  const generation = await inspect(join(groupRoot, 'generate-' + task));
  const comparison = generation.status === 'GENERATED_UNVERIFIED' ? await inspect(join(groupRoot, 'compare-' + task)) : null;
  if (comparison && comparison.shared_initial_sha256 !== generation.source_sha256) issues.push(`Shared initial candidate mismatch: ${task}`);
  const baseline = comparison ? runs.find(r => r.directory === comparison.baseline_run) : null;
  const final = comparison ? runs.find(r => r.directory === comparison.final_verification_run) : null;
  const shared = !!baseline && !!final && baseline.evaluator_sha256 === final.evaluator_sha256 && baseline.compatibility_version === final.compatibility_version && baseline.manifest_sha256 === final.manifest_sha256;
  if (comparison?.status === 'VERIFIED' && !shared) issues.push(`Baseline/Agent evaluator mismatch: ${task}`);
  const taskModels = models.filter(m => m.task_id === task);
  rows.push({ task_id: task, evaluator_status: ready.find(r => r.task_id === task)?.compat_status ?? 'INCONCLUSIVE',
    baseline_status: comparison?.initial_status ?? generation.status, agent_status: comparison?.status ?? 'NOT_RUN',
    baseline_stages: baseline?.stages ?? null, agent_stages: final?.stages ?? null,
    baseline_checks: baseline?.simulation.checks_executed ?? null, baseline_mismatches: baseline?.simulation.mismatch_count ?? null,
    checks: final?.simulation.checks_executed ?? null, mismatches: final?.simulation.mismatch_count ?? null,
    semantic_repairs: comparison?.semantic_repairs ?? 0, agent_extra_requests: comparison?.agent_incremental_model_requests ?? 0,
    physical_dispatches: taskModels.filter(m => m.dispatched).length,
    prompt_tokens: taskModels.reduce((n, m) => n + (m.prompt_tokens ?? 0), 0), completion_tokens: taskModels.reduce((n, m) => n + (m.completion_tokens ?? 0), 0),
    baseline_agent_same_evaluator: shared, evaluator_sha256: baseline?.evaluator_sha256 ?? null,
    initial_sha256: generation.source_sha256 ?? null, final_sha256: comparison?.final_exported_sha256 ?? null,
    generation_status: generation.status, final_diagnostics: final?.diagnostics ?? baseline?.diagnostics ?? [], generation, comparison });
}
const dispatched = models.filter(m => m.dispatched).length;
if (ticketCount !== dispatched) issues.push('Dispatch ledger/model record count mismatch');
if (new Set(runs.map(r => r.directory)).size !== runs.length || new Set(runs.map(r => r.verification_key)).size !== runs.length) issues.push('Run directories or verification keys reused');
const totals = { selected: selection.task_ids.length, evaluable: rows.filter(r => r.evaluator_status === 'EVALUATOR_READY').length,
  evaluator_blocked: rows.filter(r => r.evaluator_status !== 'EVALUATOR_READY').length,
  generation_statuses: Object.fromEntries([...new Set(rows.map(r => r.generation_status).filter(Boolean))].map(status => [status, rows.filter(r => r.generation_status === status).length])),
  agent_statuses: Object.fromEntries([...new Set(rows.map(r => r.agent_status))].map(status => [status, rows.filter(r => r.agent_status === status).length])),
  baseline_pass: rows.filter(r => r.baseline_status === 'PASS').length, agent_pass: rows.filter(r => r.agent_status === 'VERIFIED').length,
  recovered_tasks: rows.filter(r => r.baseline_status !== 'PASS' && r.agent_status === 'VERIFIED').length,
  semantic_repairs: rows.reduce((n, r) => n + r.semantic_repairs, 0), physical_dispatches: dispatched,
  shared_initial_dispatches: models.filter(m => m.route === 'generate' && m.dispatched).length,
  agent_incremental_dispatches: models.filter(m => m.route === 'compare' && m.dispatched).length,
  prompt_tokens: models.reduce((n, m) => n + (m.prompt_tokens ?? 0), 0), completion_tokens: models.reduce((n, m) => n + (m.completion_tokens ?? 0), 0),
  unknown_usage_requests: models.filter(m => m.dispatched && (m.prompt_tokens === null || m.completion_tokens === null)).length,
  model_wall_ms: models.reduce((n, m) => n + (m.request_wall_ms ?? 0), 0), eda_wall_ms: runs.reduce((n, r) => n + r.eda_wall_ms, 0), real_eda_runs: runs.length };
await mkdir(output);
const put = (name, value) => writeFile(join(output, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
await put('p10-results-40.json', { protocol, selection_manifest: selection, dataset_revision: suite.dataset_revision, manifest_sha256: suiteHash, totals, rows, issues });
await put('evidence-index.json', { assertions: issues.length ? 'FAIL' : 'PASS', frozen_inputs_checked: Object.keys(freeze.files).length,
  historical_files_checked: Object.keys(freeze.historical).length, upstream_assets_checked: catalog.reduce((n, t) => n + Object.keys(t.assets).length, 0), calibrationRuns, models, runs, issues });
const columns = ['task_id','evaluator_status','baseline_status','agent_status','checks','mismatches','semantic_repairs','agent_extra_requests','physical_dispatches','prompt_tokens','completion_tokens','baseline_agent_same_evaluator','evaluator_sha256'];
await writeFile(join(output, 'p10-results-40.csv'), columns.join(',') + '\n' + rows.map(r => columns.map(k => r[k] ?? '').join(',')).join('\n') + '\n', { flag: 'wx' });
const table = rows.map(r => `| ${r.task_id} | ${r.baseline_status} | ${r.agent_status} | ${r.checks ?? '-'} | ${r.mismatches ?? '-'} | ${r.semantic_repairs} |`).join('\n');
await writeFile(join(output, 'p10-baseline-vs-agent-40.md'), `# P10 固定四十题重测\n\n协议：${freeze.protocol.evaluator_protocol}。不是未经修改的官方 VerilogEval 分数，也不是本地 Qwen 成绩。\n\n- 固定选择 40 题，按原顺序分为四组；未更换被阻塞题目，未合并历史模型成绩。\n- 可评测 ${totals.evaluable} 题，评测阻塞 ${totals.evaluator_blocked} 题。每道可评测题重新调用 deepseek-flash 生成；reasoning high、temperature 0、maxTokens 8192，Agent、Prompt、Skill 和修复预算未修改。\n- 可评测题 Baseline：${totals.baseline_pass}/${totals.evaluable}；Agent：${totals.agent_pass}/${totals.evaluable}。固定选择覆盖口径：${totals.baseline_pass}/40 与 ${totals.agent_pass}/40，阻塞不是模型失败。\n- 共享初始候选：仅未通过时进入 Agent 修复，不是两个独立采样实验。恢复 ${totals.recovered_tasks} 题；语义修复 ${totals.semantic_repairs} 次。\n- 模型请求 ${totals.physical_dispatches}，初始 ${totals.shared_initial_dispatches}，Agent 增量 ${totals.agent_incremental_dispatches}；输入 token ${totals.prompt_tokens}，输出 ${totals.completion_tokens}。\n- 模型候选 EDA ${runs.length} 次，要求编译、展开、仿真、综合四阶段通过。正负校准另见 preflight-40.json。\n- 套件 SHA256：${suiteHash}。审计：${issues.length ? 'FAIL: ' + issues.join('; ') : 'PASS，未发现不一致'}。\n\n| 任务 | Baseline | Agent 最终 | 检查次数 | Mismatch | 修复次数 |\n|---|---|---|---:|---:|---:|\n${table}\n\n## 评测阻塞\n\n${rows.filter(r => r.evaluator_status !== 'EVALUATOR_READY').map(r => `- ${r.task_id}: ${r.category}; ${r.reason}`).join('\n')}\n\nProb031_dff 的正对照出现 120/121 mismatch；当前协议不能对它产生有效模型分数。未在本轮中途修改测试平台或计时规则。未声称完整 OS 隔离、Icarus 等价或全 156 题工具校准。\n`, { flag: 'wx' });
const inventory = [];
async function scan(path) { for (const entry of await readdir(path, { withFileTypes: true })) { const child = join(path, entry.name); if (entry.isDirectory()) await scan(child); else if (entry.isFile()) { const bytes = await readFile(child); inventory.push({ path: relative(root, child).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) }); } } }
await scan(root);
await put('campaign-artifact-manifest.json', { files: inventory, exclusions: [relative(root, join(output, 'campaign-artifact-manifest.json')).replaceAll('\\', '/')], created_at: new Date().toISOString() });
console.log(JSON.stringify({ totals, issues, report: output }, null, 2));
if (issues.length) process.exitCode = 1;
