import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(fileURLToPath(import.meta.url));
const preflight = 'D:/AMD/phase1-validation/p10-compat-v3';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const put = (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const write = (name, value) => writeFile(join(root, name), value, { flag: 'wx' });
const order = await json(join(preflight, 'selection-order.json'));
const catalog = await json(join(preflight, 'catalog.json'));
const calibration = await json(join(preflight, 'compat-positive-negative-results.json'));
const preflightResults = await json(join(preflight, 'compat-preflight-results.json'));
const compatibility = await json(join(preflight, 'compatibility-manifest.json'));
const modelFreeze = await json(join(root, 'freeze.json'));
const preflightFreeze = await json(join(preflight, 'freeze.json'));
const issues = [];
for (const [file, expected] of Object.entries(modelFreeze.files)) if (hash(await readFile(file)) !== expected) issues.push('Frozen model input changed: ' + file);
for (const [file, expected] of Object.entries(preflightFreeze.historical)) if (hash(await readFile(file)) !== expected) issues.push('Historical v8 changed: ' + file);
for (const task of catalog) for (const [file, expected] of Object.entries(task.assets)) if (hash(await readFile(join('D:/AMD/verilog-eval', file))) !== expected) issues.push('Upstream changed: ' + file);
const rows = [], models = [], runs = [];
async function inspectResult(directory, scored) {
  const result = await json(join(directory, 'result.json'));
  for (const modelRoot of result.model_runs) {
    const model = await json(join(modelRoot, 'model.json'));
    const wirePath = join(modelRoot, result.command === 'generate' ? 'prompt-final.json' : 'prompt-final.txt');
    let wire = null;
    try { wire = await readFile(wirePath, 'utf8'); } catch (error) { if (model.dispatched) issues.push('Missing dispatched request: ' + modelRoot); }
    if (wire && /module\s+RefModule\b|preflight_reference\s*\(/.test(wire)) issues.push('Trusted source leaked: ' + modelRoot);
    if (result.command === 'generate' && wire) {
      const body = JSON.parse(wire);
      if (body.tools?.length) issues.push('Baseline tools exposed: ' + modelRoot);
      for (const message of body.messages ?? []) if (message.role === 'user') {
        const content = JSON.parse(typeof message.content === 'string' ? message.content : message.content[0].text);
        if (content.current !== null || content.observed !== null || content.history.length || content.guidance.length) issues.push('Baseline feedback contaminated: ' + modelRoot);
      }
    }
    models.push({ task_id: result.task_id, route: result.command, scored, directory: modelRoot, dispatched: model.dispatched,
      prompt_tokens: model.usage?.prompt_tokens ?? model.prompt_tokens ?? null, completion_tokens: model.usage?.completion_tokens ?? model.completion_tokens ?? null,
      wall_ms: model.timing?.request_wall_ms ?? model.request_wall_ms, request_sha256: wire ? hash(wire) : null });
  }
  for (const run of result.verification_runs) {
    const record = await json(join(run, 'result.json'));
    const manifestPath = record.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path));
    const manifest = await json(join(run, manifestPath));
    const derived = compatibility.tasks.find(t => t.task_id === result.task_id);
    if (manifest.files['trusted/tb.sv'] !== derived.effective_tb_sha256 || manifest.evaluation.defaultTimescale !== '1ps/1ps') issues.push('Wrong effective evaluator: ' + run);
    for (const invocation of record.stages.synthesis?.invocations ?? []) if (invocation.sources.some(s => s.role !== 'dut')) issues.push('Synthesis reference exposure: ' + run);
    for (const stage of Object.values(record.stages)) if (stage.status === 'PASS' && stage.processes.some(p => p.exit_code !== 0 || p.cancelled || p.timed_out || p.log_truncated)) issues.push('Unclean PASS: ' + run);
    if (record.final_verified && (Object.values(record.stages).some(s => s.status !== 'PASS') || record.stages.simulation.evidence.checks_executed <= 0 || record.stages.simulation.evidence.mismatch_count !== 0)) issues.push('Invalid final verification: ' + run);
    runs.push({ task_id: result.task_id, route: result.command, directory: run, source_sha256: record.final_source_sha256,
      verified: record.final_verified, stages: Object.fromEntries(Object.entries(record.stages).map(([k, v]) => [k, v.status])) });
  }
  if (result.status === 'VERIFIED') {
    const exported = hash(await readFile(join(directory, 'final.sv')));
    if (exported !== result.final_exported_sha256 || exported !== result.current_source_sha256 || exported !== result.verified_source_sha256) issues.push('Export binding failed: ' + directory);
  }
  return result;
}
for (const task of order.slice(0, 10)) {
  const generated = await inspectResult(join(root, 'generate-' + task), true);
  let compared = null;
  if (generated.status === 'GENERATED_UNVERIFIED') compared = await inspectResult(join(root, 'compare-' + task), true);
  rows.push({ task_id: task, generation: generated, comparison: compared, baseline_status: compared?.initial_status ?? generated.status,
    agent_status: compared?.status ?? 'NOT_RUN', evaluable: calibration.find(t => t.task_id === task).evaluable });
}
const control = await inspectResult(join(root, 'repair-control-Prob038_count15'), false);
const tickets = (await readdir(join(root, 'dispatches'))).filter(name => name.endsWith('.json'));
const dispatched = models.filter(m => m.dispatched).length;
if (tickets.length !== dispatched) issues.push('Dispatch tickets disagree with model records');
const totals = { selected: 10, evaluable: rows.filter(r => r.evaluable).length, baseline_pass: rows.filter(r => r.baseline_status === 'PASS').length,
  agent_pass: rows.filter(r => r.agent_status === 'VERIFIED').length, physical_dispatches: dispatched,
  shared_initial_dispatches: models.filter(m => m.route === 'generate' && m.dispatched).length,
  scored_agent_incremental_dispatches: models.filter(m => m.route === 'compare' && m.dispatched).length,
  control_dispatches: models.filter(m => !m.scored && m.dispatched).length,
  provider_prompt_tokens: models.reduce((n, m) => n + (m.prompt_tokens ?? 0), 0), provider_completion_tokens: models.reduce((n, m) => n + (m.completion_tokens ?? 0), 0) };
const extension = order.slice(10).map(id => ({ task_id: id, status: 'NOT_RUN', reason: 'COMPAT_RULE_UNSUPPORTED_NOT_REVIEWED', interface_error: catalog.find(t => t.task_id === id).interface_error }));
await put('p10-compat-results-10.json', { protocol: modelFreeze.protocol, totals, rows, issues, model_records: models, eda_records: runs, repair_control: control });
await put('p10-compat-single-task-baseline-agent.json', { ...rows[0], repair_control_separate_not_scored: control, shared_initial_semantics: 'Marginal repair benefit from the same one-shot candidate; not independent sampling.' });
await put('expansion-40-readiness.json', { status: 'NOT_RUN', order, selected10_audit: issues.length ? 'FAIL' : 'PASS', automatic_40_authorized: false,
  reason: 'The reviewed rule deliberately covers 11 exact TB hashes only. The other 30 assets require a separately reviewed evaluator version and real positive/negative calibration. No replacement tasks or synthetic failures were inserted.', extension });
for (const name of ['compatibility-manifest.json', 'compat-preflight-results.json', 'compat-positive-negative-results.json']) await write(name, await readFile(join(preflight, name)));
await put('evidence-index.json', { preflight_root: preflight, model_root: root, model_records: models, eda_records: runs,
  historical_v8_files_checked: Object.keys(preflightFreeze.historical).length, upstream_assets_checked: catalog.reduce((n, t) => n + Object.keys(t.assets).length, 0), frozen_model_inputs_checked: Object.keys(modelFreeze.files).length,
  assertions: issues.length ? 'FAIL' : 'PASS', issues });
const table = calibration.map(r => `| ${r.task_id} | ${r.positive.evidence.checks_executed} | ${r.positive.evidence.mismatch_count} | ${r.negative.evidence.mismatch_count} | ${r.evaluable ? 'READY' : 'BLOCKED'} |`).join('\n');
await write('compatibility-review.md', `# P10 Compatibility Review\n\nProtocol: pinned VerilogEval + Vivado 2025.2 development compatibility evaluator, not upstream Icarus or official hidden scoring.\n\nThe only TB edit moves the original two complete net declaration lines above the waveform initial block in module tb. The original lines and CRLF bytes are retained. The derived directory is external to the dataset. Eleven exact raw hashes are accepted; all others fail closed. Each task retains a diff, inverse line map and adapter-source hash under ${preflight}/derived. Prompts, reference, stimulus, comparison, timeout and sample rules are unchanged.\n\nThe declaration-only probes for notgate/count15 really passed xvlog, then failed xelab with XSIM 43-4099. The separate recorded policy supplies only the default -timescale 1ps/1ps. No override switches or TB delay edits are used. Subsequent positive/negative runs share those exact evaluator bytes.\n\n| Task | Positive checks | Positive mismatches | Negative mismatches | Status |\n|---|---:|---:|---:|---|\n${table}\n\nReference self-comparison establishes runtime health only. Independent faulty DUTs demonstrate observable rejection, not exhaustive correctness. Full OS isolation and cross-simulator equivalence remain unverified.\n`);
await write('p10-compat-acceptance.md', `# P10 兼容修复验收\n\n## 实际结论\n\n- 原 10 题及独立 Prob038 的声明前引用错误在真实 xvlog 中消失，11 题均完成正负例校准。\n- 仅搬动声明后真实出现下一层 XSIM 43-4099；记录证据后采用默认 1ps/1ps，未覆盖 TB 显式时间单位。\n- 正例均有唯一有效判据且 checks > 0；负例均先通过编译/展开，再产生 mismatches > 0。\n- Baseline：${totals.baseline_pass}/10 四阶段通过；共享初始候选 Agent：${totals.agent_pass}/10。修复收益只比较同一候选，不声称独立采样优势。\n- 真正模型派发 ${dispatched} 次：公共初始 ${totals.shared_initial_dispatches}，评分 Agent 增量 ${totals.scored_agent_incremental_dispatches}，独立修复校准 ${totals.control_dispatches}。不是仅做预检。\n- count15 负例副本经真实 edit_dut 和 verify_rtl 修复，终态 ${control.status}，不计入模型成绩。\n- 当前、已验证、最终导出源码 SHA 一致性已逐个审计。上游全部 468 份资产与历史 v8 的 ${Object.keys(preflightFreeze.historical).length} 个普通文件哈希保持不变。\n- 审计问题：${issues.length ? issues.join('; ') : '无已发现不一致'}。\n\n## 验收矩阵\n\n| 条目 | 结果 | 证据 |\n|---|---|---|\n| C01-C04 | PASS | upstream hash audit; compatibility-manifest; derived diff/map; exact-hash rejection tests |\n| C05-C08 | PASS | declaration-only probes; evaluator-policy; 11 positive/negative real runs |\n| C09 | PASS | phase1-verification evidence tests: timeout/missing/duplicate/unknown/contradictory verdicts fail closed |\n| C10-C11 | PASS | all 10 + sentinel retained; original and compatibility status separated |\n| C12-C13 | PASS | real request/response records; one-shot baseline with no tools/skills/feedback |\n| C14 | PASS for separate repair control | genuine failed DUT -> model edit -> new four-stage verification; excluded from scored gain |\n| C15 | ${issues.length ? 'REVIEW_REQUIRED' : 'PASS'} | evidence-index and source binding audit |\n| C16 | 10-task audit ${issues.length ? 'FAIL' : 'PASS'}; 40 NOT_RUN | expansion-40-readiness.json preserves original order; remaining 30 TB hashes unreviewed |\n\n## 未完成与限制\n\n本次已完成兼容修复、真实正负例校准、单题和完整十题模型对照。四十题尚未运行：当前经审查规则只覆盖十一份精确原始输入，剩余三十份需要新规则版本的审查与真实校准，且 Prob080 的公开接口静态解析不受支持；未换题，也未把这些任务记为模型失败。未验证完整 OS 隔离、官方隐藏评分或 Icarus 等价。当前模型协议对格式/传输错误直接停止，没有执行计划设想的一次格式恢复；该差异已写入冻结协议，不能与其他恢复策略的成绩混合。\n\n开发期入口失败和模型 v3 的 provider retry 配置阻塞均独立保留，不拼入 v4 的成绩；v3 曾产生额外 1 次真实生成。所有正式本轮模型记录位于本目录。\n`);
const inventory = [];
async function scan(path) { for (const entry of await readdir(path, { withFileTypes: true })) { const child = join(path, entry.name); if (entry.isDirectory()) await scan(child); else if (entry.isFile()) { const bytes = await readFile(child); inventory.push({ path: relative(root, child).replaceAll('\\', '/'), size: bytes.length, sha256: hash(bytes) }); } } }
await scan(root);
await put('campaign-artifact-manifest.json', { files: inventory, exclusions: ['campaign-artifact-manifest.json'], created_at: new Date().toISOString() });
console.log(JSON.stringify({ totals, issues, artifacts: root }));
