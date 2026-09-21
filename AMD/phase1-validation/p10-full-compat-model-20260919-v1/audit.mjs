import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, 'report');
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const freeze = await json(join(root, 'freeze.json'));
const preflight = freeze.preflight_root;
const suitePath = join(preflight, 'derived/verilogeval-vivado2025.2-compat-v1-manifest.json');
const suiteHash = hash(await readFile(suitePath));
const suite = await json(suitePath);
const catalog = await json(join(preflight, 'catalog.json'));
const ready = await json(join(preflight, 'p10-compat-preflight-10.json'));
const issues = [], models = [], runs = [], rows = [];
if (suiteHash !== freeze.protocol.compatibility_manifest_sha256) issues.push('Suite manifest changed');
for (const group of ['files', 'historical']) {
  for (const [file, expected] of Object.entries(freeze[group])) if (hash(await readFile(file)) !== expected) issues.push(`${group} changed: ${file}`);
}
for (const task of catalog) for (const [file, expected] of Object.entries(task.assets)) {
  if (hash(await readFile(join('D:/AMD/verilog-eval', file))) !== expected) issues.push(`Upstream changed: ${file}`);
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
      stages: Object.fromEntries(Object.entries(record.stages).map(([k, v]) => [k, v.status])), simulation: record.stages.simulation.evidence });
  }
  if (result.status === 'VERIFIED') {
    const exported = hash(await readFile(join(directory, 'final.sv')));
    if (exported !== result.current_source_sha256 || exported !== result.verified_source_sha256 || exported !== result.final_exported_sha256) issues.push(`Export SHA mismatch: ${directory}`);
  }
  return result;
}
for (const task of freeze.task_ids) {
  const generation = await inspect(join(root, 'generate-' + task));
  const comparison = generation.status === 'GENERATED_UNVERIFIED' ? await inspect(join(root, 'compare-' + task)) : null;
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
    generation, comparison });
}
const tickets = (await readdir(join(root, 'dispatches'))).filter(name => name.endsWith('.json'));
const dispatched = models.filter(m => m.dispatched).length;
if (tickets.length !== dispatched) issues.push('Dispatch ledger/model record count mismatch');
if (new Set(runs.map(r => r.directory)).size !== runs.length || new Set(runs.map(r => r.verification_key)).size !== runs.length) issues.push('Run directories or verification keys reused');
const totals = { selected: 10, evaluable: rows.filter(r => r.evaluator_status === 'EVALUATOR_READY').length,
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
await put('p10-results-10.json', { protocol: freeze.protocol, dataset_revision: suite.dataset_revision, manifest_sha256: suiteHash, totals, rows, issues });
await put('evidence-index.json', { assertions: issues.length ? 'FAIL' : 'PASS', frozen_inputs_checked: Object.keys(freeze.files).length,
  historical_files_checked: Object.keys(freeze.historical).length, upstream_assets_checked: catalog.reduce((n, t) => n + Object.keys(t.assets).length, 0), models, runs, issues });
const columns = ['task_id','evaluator_status','baseline_status','agent_status','checks','mismatches','semantic_repairs','agent_extra_requests','physical_dispatches','prompt_tokens','completion_tokens','baseline_agent_same_evaluator','evaluator_sha256'];
await writeFile(join(output, 'p10-results-10.csv'), columns.join(',') + '\n' + rows.map(r => columns.map(k => r[k] ?? '').join(',')).join('\n') + '\n', { flag: 'wx' });
const table = rows.map(r => `| ${r.task_id} | ${r.baseline_status} | ${r.agent_status} | ${r.checks ?? '-'} | ${r.mismatches ?? '-'} | ${r.semantic_repairs} |`).join('\n');
await writeFile(join(output, 'p10-baseline-vs-agent-10.md'), `# P10 新兼容套件十题重测\n\n协议：${freeze.protocol.evaluator_protocol}。不是未经修改的官方 VerilogEval 分数。\n\n- 全部十题重新调用模型生成，不复用历史候选。模型为 deepseek-flash，reasoning high，temperature 0，maxTokens 8192；Agent、Prompt、Skill 和修复预算未修改。\n- Baseline：${totals.baseline_pass}/10；Agent 最终：${totals.agent_pass}/10；修复成功题数：${totals.recovered_tasks}。\n- 共享初始候选协议：每题先评分一次初始候选，仅在未通过时进入 Agent 修复；不是两个独立随机采样实验。\n- 真实模型请求：${totals.physical_dispatches}，其中初始 ${totals.shared_initial_dispatches}，Agent 增量 ${totals.agent_incremental_dispatches}；语义修复 ${totals.semantic_repairs} 次。\n- Token：输入 ${totals.prompt_tokens}，输出 ${totals.completion_tokens}；真实 EDA ${runs.length} 次，要求 compile、elaborate、simulation、synthesis 四阶段通过。\n- 套件 SHA256：${suiteHash}。\n- 审计：${issues.length ? 'FAIL: ' + issues.join('; ') : 'PASS，未发现不一致'}。原始数据集、冻结套件及历史结果保持不变。\n\n| 任务 | Baseline | Agent 最终 | 检查次数 | Mismatch | 修复次数 |\n|---|---|---|---:|---:|---:|\n${table}\n\n本次只执行原固定十题。四十题扩展和其余 145 题完整工具校准未执行，Prob156 仍为人工审查项。若所有初始候选都通过，则本次数据不能证明 Agent 的增量修复能力。未声称完整 OS 隔离或 Icarus 等价。\n`, { flag: 'wx' });
const inventory = [];
async function scan(path) { for (const entry of await readdir(path, { withFileTypes: true })) { const child = join(path, entry.name); if (entry.isDirectory()) await scan(child); else if (entry.isFile()) { const bytes = await readFile(child); inventory.push({ path: relative(root, child).replaceAll('\\', '/'), bytes: bytes.length, sha256: hash(bytes) }); } } }
await scan(root);
await put('campaign-artifact-manifest.json', { files: inventory, exclusions: ['report/campaign-artifact-manifest.json'], created_at: new Date().toISOString() });
console.log(JSON.stringify({ totals, issues, report: output }, null, 2));
if (issues.length) process.exitCode = 1;
