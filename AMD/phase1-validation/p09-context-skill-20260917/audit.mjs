import { readFile, writeFile, readdir, lstat, mkdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url));
const read = async p => JSON.parse((await readFile(p, 'utf8')).replace(/^\uFEFF/, ''));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = async (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const freeze = await read(join(root, 'freeze.json'));
for (const [path, expected] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), expected, path);
const probeFreeze = await read(join(root, 'probe-v2-freeze.json'));
for (const [path, expected] of Object.entries(probeFreeze.files)) assert.equal(hash(await readFile(join(root, path))), expected.toLowerCase(), path);
async function scan(directory, excluded) {
  const files = [];
  async function visit(relative = '') {
    for (const name of (await readdir(join(directory, relative))).sort()) {
      const path = relative ? relative + '/' + name : name;
      if (path === excluded) continue;
      const stat = await lstat(join(directory, path)); assert.ok(!stat.isSymbolicLink());
      if (stat.isDirectory()) await visit(path);
      else if (stat.isFile()) { const bytes = await readFile(join(directory, path)); files.push({ path, bytes: bytes.length, sha256: hash(bytes) }); }
    }
  }
  await visit(); return files;
}
const manifests = [], requests = [], archives = [];
async function auditManifest(directory) {
  const manifest = await read(join(directory, 'artifacts.json'));
  const actual = await scan(directory, 'artifacts.json'); assert.deepEqual(actual, manifest.files);
  manifests.push({ directory, files: actual.length, status: 'PASS' });
}
async function auditModel(path, kind) {
  const model = await read(join(path, 'model.json')), audit = await read(join(path, 'context-audit.json'));
  const body = await read(join(path, 'prompt-final.txt'));
  assert.equal(model.prompt_sha256, hash(JSON.stringify(body)));
  assert.equal(audit.final_prompt_sha256, model.prompt_sha256);
  assert.equal(audit.tokens, model.local_tokens);
  assert.equal(audit.budget, 121856); assert.equal(audit.output_reserve, 8192); assert.equal(body.max_tokens, 8192);
  assert.ok(audit.tokens <= audit.budget); assert.equal(audit.full_request_counted, true);
  await auditManifest(path);
  requests.push({ path, kind, dispatched: model.dispatched, local_tokens: model.local_tokens, provider_input_tokens: model.prompt_tokens,
    provider_output_tokens: model.completion_tokens, error: model.error_code, response_bytes: model.response_bytes,
    input_budget: audit.budget, selected_skills: audit.selected_skills, context_reduced: audit.prompt_view_reduced,
    reasoning_replay: body.messages.some(m => typeof m.reasoning_content === 'string') });
}
const experiments = await readdir(join(root, 'experiments')); assert.equal(experiments.length, 1);
const directory = join(root, 'experiments', experiments[0]), state = await read(join(directory, 'state.json'));
assert.equal(state.phase, 'TERMINAL'); assert.equal(state.outcome, 'VERIFIED'); assert.equal(state.fixture, 'rising_edge');
const config = await read(join(directory, 'configuration.json'));
assert.equal(config.p09.limits.window, 131072); assert.equal(config.p09.limits.output, 8192);
const result = await read(join(state.verification_run, 'result.json')), exported = await read(join(directory, 'export.json'));
assert.equal(result.final_verified, true); assert.equal(exported.revision_id, state.current.revision_id);
assert.equal(exported.verification_key, result.verification_key); assert.equal(result.final_source_sha256, state.current.source_sha256);
assert.equal(hash(await readFile(join(directory, 'output/solution.sv'))), state.current.source_sha256);
assert.ok(Object.values(result.stages).every(s => s.status === 'PASS'));
const positive = await read(join(state.calibration_run, 'result.json'));
assert.equal(positive.final_verified, true);
const initial = await read(join(state.verification_runs[0], 'result.json'));
assert.equal(initial.final_verified, false); assert.equal(initial.stages.simulation.status, 'FAIL');
assert.equal(initial.final_source_sha256, freeze.task_hashes.find(t => t.id === 'rising_edge').bad_source_sha256);
for (const path of state.model_runs) await auditModel(path, 'live_autonomous_repair');
for (const path of [...state.verification_runs, state.calibration_run]) await auditManifest(path);
const probes = await read(join(root, 'native-skill-probes.json'));
for (const probe of probes) {
  assert.equal(probe.retrieved, true);
  const model = await read(join(probe.model_runs[0], 'model.json'));
  const call = model.message.content.filter(b => b.type === 'tool-call'); assert.equal(call.length, 1); assert.equal(call[0].name, 'retrieve_skill');
  const tool = await read(join(probe.directory, 'tool-result.json'));
  assert.equal(tool.tool_call_id, call[0].id); assert.ok(tool.observation.skills.some(s => s.id === probe.skill));
  for (const path of probe.model_runs) await auditModel(path, 'prompted_native_retrieval_diagnostic');
  const second = await read(join(probe.model_runs[1], 'prompt-final.txt'));
  assert.ok(second.messages.some(m => m.role === 'tool' && m.tool_call_id === call[0].id));
  await auditManifest(probe.directory);
}
for (const prior of freeze.preserved_archives) {
  const manifest = await read(join(prior.path, 'campaign-artifact-manifest.json'));
  const actual = await scan(prior.path, 'campaign-artifact-manifest.json'); assert.deepEqual(actual, manifest.files);
  archives.push({ directory: prior.path, files: actual.length, unchanged: true });
}
const old = 'D:/AMD/phase1-validation/p09-real-loop-20260917/experiments/repair-6af80fca-df2d-43d7-8916-a23286c8a6c6';
const oldState = await read(old + '/state.json'), oldCalibration = await read(join(oldState.calibration_run, 'result.json'));
assert.equal(oldState.model_runs.length, 0); assert.equal(oldState.outcome, 'CALIBRATION_FAILED');
const oldCause = { directory: old, outcome: oldState.outcome, model_requests: 0, stop_reason: oldCalibration.stop_reason,
  stages: Object.fromEntries(Object.entries(oldCalibration.stages).map(([name, s]) => [name, { status: s?.status ?? null, errors: s?.errors ?? [] }])),
  code_fix_preexisting: 'Ignore ENOENT only for disappearing live child directories; keep other failures strict.' };
const tickets = (await readdir(join(root, 'dispatches'))).filter(n => n.endsWith('.json'));
assert.equal(tickets.length, requests.filter(r => r.dispatched).length); assert.ok(tickets.length <= freeze.new_dispatch_cap);
const qualityRoot = 'D:/AMD/p09-context-skill-change';
const focused = await read(qualityRoot + '/focused-final.json'), regression = await read(qualityRoot + '/rtl-regression.json');
assert.equal(focused.success, true); assert.equal(regression.success, true);
const deployed = await read(qualityRoot + '/deployed.json');
for (const path of Object.keys(deployed)) {
  assert.equal(hash(await readFile(join('D:/deepseek-harness', path))), deployed[path].toLowerCase(), path);
  const target = join(root, 'source-after', path); await mkdir(dirname(target), { recursive: true });
  await copyFile(join('D:/deepseek-harness', path), target);
}
for (const path of ['rtl-tools/phase1/p09/README.i18n.yaml', '.agents/notes/implemented/feature/2026-09-17-p09-autonomous-repair.i18n.yaml']) {
  const target = join(root, 'source-after', path); await mkdir(dirname(target), { recursive: true }); await copyFile(join('D:/deepseek-harness', path), target);
}
await copyFile(qualityRoot + '/focused-final.json', join(root, 'focused-tests.json'));
await copyFile(qualityRoot + '/rtl-regression.json', join(root, 'rtl-regression.json'));
const summary = { schema_version: 'p09-context-skill-followup-1', context: await read(join(root, 'counter-128k.json')),
  calibration: { directory, status: 'PASS', model_requests: state.model_runs.length, accepted_repairs: state.attempts,
    current_revision: state.current.revision_id, source_sha256: state.current.source_sha256, verification_key: result.verification_key,
    stages: Object.fromEntries(Object.entries(result.stages).map(([k, v]) => [k, v.status])) },
  old_calibration_block: oldCause, skills: await read(join(root, 'skill-content-audit.json')),
  native_probes: probes.map(p => ({ skill: p.skill, retrieved: p.retrieved, round_trip: p.round_trip, errors: p.errors, directory: p.directory })),
  native_retrieval_callable: 'PASS_3_OF_3_PROMPTED_PROBES', full_round_trip: probes.every(p => p.round_trip) ? 'PASS' : 'PARTIAL_TRANSPORT_FAILURE',
  autonomous_retrieval_observed: false, manifests_checked: manifests.length, archived_evidence: archives,
  dispatches: tickets.length, previous_plus_new: 66 + tickets.length, cap: 375, unknown_usage_requests: requests.filter(r => r.provider_output_tokens === null).length,
  tests: { focused: focused.numPassedTests, regression: regression.numPassedTests, skipped: regression.numPendingTests, failed: regression.numFailedTests },
  full_os_isolation_verified: false, server_side_long_context_stress_test: 'NOT_RUN', skill_causal_benefit: 'NOT_ESTABLISHED',
  diagnostic_driver_setup_failure: { model_dispatches: 0, retained_in: 'launch-probe.log', corrected_driver: 'probe-v2.mts', main_calibration_rerun: false } };
await put('acceptance.json', summary);
await put('request-audit.json', requests); await put('artifact-manifest-audit.json', manifests);
await writeFile(join(root, 'acceptance.zh.md'), `# P09 128K 上下文与技能排查\n\n## 结论\n\n项目示例与新部署配置采用 131072 Token（128K）上下文、8192 输出预留、1024 安全余量，完整请求输入预算为 121856。提供方声明的窗口仍可进一步收紧它。旧配置和旧实验未改写。\n\n官方 Rust 计量器离线验证包含 system、五个工具 schema、assistant 工具调用、工具返回及必要推理回传的完整请求：121856 输入 Token 接受，121857 拒绝；相同大请求在原 16K 项目窗口拒绝。该测试 API 派发为 0，不是服务端 128K 压力测试。此前输出截断与输入窗口不足是不同问题，本次没有宣称历史截断由上下文不足造成。\n\n## 校准阻塞\n\n历史 rising_edge/C 在模型请求为 0 时校准失败，根因是 Vivado 临时子目录消失引发实时扫描错误，不是模型无法调用 Skill。现有 Host 的 ENOENT 定向修复保持其他文件错误严格失败。本次同题 C 组在 128K 配置下完成真实正例校准、初始错误 FAIL、模型 edit_dut、verify_rtl 和四阶段 PASS，用了 ${state.model_runs.length} 次 API、${state.attempts} 次接受修复。单次复验成功不保证消除所有未来 EDA 环境故障。\n\n## 模型能否调用 Skill\n\n历史自主轨迹中未观察到 retrieve_skill，但 C 组上下文已自动注入适用规则，因此不调用不等于不可调用。本次三条技能均收到真实模型的原生 retrieve_skill 调用，Host 使用与生产流程相同的检索函数返回了对应规则。它们是明确要求检索的诊断探针，不冒充模型自主选择检索。\n\n| 技能 | 原生检索并返回规则 | 后续往返 |\n| --- | --- | --- |\n${probes.map(p => `| ${p.skill} | ${p.retrieved ? 'PASS' : 'FAIL'} | ${p.round_trip ? 'PASS' : p.errors.join(', ')} |`).join('\n')}\n\n时序技能的后续请求遭遇零内容 TRANSPORT 错误；该请求 usage 为 null，没有重抽样或将其标为完成。这不否定已经收到的 retrieve_skill 调用，也不证明模型已接收完该次工具返回。诊断驱动另有一次派发前的目录/退出接口错误，API 为 0，原失败保留，校准没有重复运行。\n\n## 技能自身检查与修复\n\n三条规则的内容哈希、15 个引用验证文件及保存的真实 EDA 适用正反例均复核通过；这些正反例是历史真实证据的重新检查，不是本轮新的 EDA 运行。未发现规则内容损坏、引用篡改或这些适用性案例失效。规则仍是诊断指导，不是可执行修复程序，也未证明带来因果收益；历史 Skill Selector 修改差异仍无法从保留证据恢复。\n\n已实施的代码修复：C 组在 EDA 校准前验证技能包结构、唯一 ID、规则哈希及证据文件；缺失、格式错误或变化统一返回 SKILL_EVIDENCE_INVALID，不再混为通用模型失败。A/B 不读技能包。原生检索与提示注入统一只使用当前阻塞阶段，避免从已成功阶段或旧反馈选取不适用规则。三条规则正文及历史 validated 状态未改写。\n\n## 验证与审计\n\n定向测试 ${focused.numPassedTests} 通过；RTL 范围回归 ${regression.numPassedTests} 通过、${regression.numFailedTests} 失败、${regression.numPendingTests} 跳过。类型检查、定向 oxlint 和快速文档检查另见 quality-checks.json。${manifests.length} 份终态清单完成文件集合、大小与 SHA256 核对；两个旧归档共 ${archives.reduce((n, a) => n + a.files, 0)} 个文件保持不变。本轮 API 派发 ${tickets.length}，累计 ${66 + tickets.length}/375；未知 usage 不估算补零。\n\n完整模型/EDA 记录保存在 experiments 与 native-probe-*；request-audit.json 保存请求计量、组别技能选择和必要回传字段检查；counter-128k.json 保存离线精确边界；skill-content-audit.json 保存技能正反例审计。完整 OS 隔离、全面时序收敛、Prob038 兼容性及统计显著收益不随本次验证签收。\n`, { flag: 'wx' });
console.log(JSON.stringify({ calibration: summary.calibration.status, retrievals: probes.filter(p => p.retrieved).length,
  round_trips: probes.filter(p => p.round_trip).length, manifests: manifests.length, dispatches: tickets.length, tests: summary.tests }));
