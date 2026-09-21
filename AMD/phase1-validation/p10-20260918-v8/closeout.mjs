import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url));
const json = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const putText = (name, text) => writeFile(join(root, name), text + '\n', { flag: 'wx' });
const freeze = await json(join(root, 'freeze.json'));
for (const [path, expected] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), expected, path);
const regression = await json('D:/AMD/p10-change/regression-final.json');
assert.equal(regression.numFailedTests, 0); assert.equal(regression.numPassedTests, 328);
const docs = await readFile('D:/AMD/p10-change/docs-quick-final.log', 'utf8');
assert.match(docs, /16 passed, 0 failed/);
const sync = await readFile('D:/AMD/p10-change/doc-sync.log', 'utf8');
assert.match(sync, /33 passed, 1 failed/); assert.match(sync, /EPERM.*symlink/);
for (const check of await json(join(root, 'quality/commands.json'))) assert.equal(check.exit_code, 0);
for (const name of ['regression.json', 'regression-final.json', 'regression-final.log', 'focused.json', 'focused-final.json',
  'dataset-tests.json', 'dataset-tests-final.json', 'docs-quick.log', 'docs-quick-final.log', 'doc-sync.log']) {
  await copyFile(join('D:/AMD/p10-change', name), join(root, 'quality', name));
}
const docFiles = ['rtl-tools/phase1/p10/README.md', 'rtl-tools/phase1/p10/README.zh.md', 'rtl-tools/phase1/p10/README.i18n.yaml',
  '.agents/notes/implemented/feature/2026-09-18-p10-evaluator-preflight.md', '.agents/notes/implemented/feature/2026-09-18-p10-evaluator-preflight.zh.md',
  '.agents/notes/implemented/feature/2026-09-18-p10-evaluator-preflight.i18n.yaml'];
const fileIds = {};
for (const path of [...docFiles, 'rtl-tools/tests/p10.spec.ts', 'rtl-tools/tests/phase1-verification.spec.ts']) {
  const bytes = await readFile(join('D:/deepseek-harness', path));
  const target = join(root, 'delivery-source', path);
  await mkdir(dirname(target), { recursive: true }); await writeFile(target, bytes, { flag: 'wx' }); fileIds[path] = hash(bytes);
}
await put('delivery-source-identity.json', fileIds);
const audit = await json(join(root, 'audit-results.json'));
assert.equal(audit.status, 'PASS');
const report = await json(join(root, 'pilot-10/p10-results-10.json'));
const quality = { rtl_regression: { passed: 328, skipped: 4, failed: 0, evidence: 'quality/regression-final.json' },
  focused_p10: { passed: 6, failed: 0 }, typecheck: 'PASS', targeted_lint: 'PASS', git_diff_check: 'PASS',
  docs_quick: { passed: 16, failed: 0 }, doc_sync: { passed: 33, failed: 1, status: 'ENVIRONMENT_BLOCKED',
    reason: 'EPERM creating a file symlink in scripts/project-doc-site.spec.ts:160; 68/69 tests in that gate passed.', evidence: 'quality/doc-sync.log' } };
await put('quality-summary.json', quality);
const acceptance = { schema_version: 'p10-acceptance-1', created_at: new Date().toISOString(), run: 'p10-20260918-v8',
  decision: 'NO_GO', reason: 'NO_EVALUABLE_TASKS', implemented_scope: 'dataset identity, deterministic selection, host-only evaluator preflight and blocked reporting',
  selected: 10, evaluator_ready: 0, testbench_compatibility_blocked: 10, reference_compatibility_blocked: 0, tool_environment_blocked: 0, inconclusive: 0,
  sentinel: { task_id: 'Prob038_count15', status: 'TESTBENCH_COMPATIBILITY_BLOCKED', included_in_denominator: false },
  dataset_revision: freeze.dataset_revision, raw_dataset_assets_unchanged: 468, common_diagnostic: 'VRFC 10-3380: tb_mismatch used before its declaration',
  baseline: 'NOT_RUN', agent: 'NOT_RUN', main_40: 'NOT_RUN', model_comparison_audit: 'NOT_RUN',
  baseline_pass_rate: null, agent_pass_rate: null, repair_gain: null, physical_provider_dispatches: 0,
  p10_budget: { pilot_cap: 150, main_cap: 600, total_cap: 750, consumed: 0, model_dispatch_ledger_implemented: false },
  p09_budget_modified: false, official_tokenizer_real_requests: 'NOT_RUN',
  preflight_wall_ms: report.wall_ms, selected_preflight_ms: report.metrics.preflight_eda_wall_ms,
  sentinel_preflight_ms: audit.rows.find(r => !r.selected).eda_wall_ms,
  audit: 'PASS_PREFLIGHT_SCOPE_ONLY', quality, evidence_classes: {
    real_eda: '11 original-evaluator preflights; compile blocked', real_model: 'NOT_RUN', replay: 'NOT_USED_FOR_SCORES',
    mock: 'unit/integration regression only', handwritten_calibration: 'transparent Host wrappers only, no problem solutions' },
  full_os_isolation_verified: false, not_accepted: ['Baseline-vs-Agent gains', 'P10 shared-candidate repair/format recovery/dispatch ledger',
    'task-aware Skill filtering', 'forty-task campaign', 'evaluator compatibility changes', 'local models/ROCm/offline deployment',
    'complete OS isolation', 'implementation timing closure', 'statistical significance'],
  historical_runs: 'startup-history.md', artifact_manifest: 'campaign-artifact-manifest.json',
  artifact_manifest_excludes_itself: true, post_seal_receipt: '../p10-20260918-v8.receipt.json' };
await put('p10-acceptance.json', acceptance);
const table = audit.rows.map(r => `| ${r.task_id} | ${r.selected ? '正式选题' : '独立哨兵'} | 测试台编译阻塞 | ${r.line} |`).join('\n');
await putText('p10-acceptance.md', `# P10 验收：NO-GO

## 结论

固定版本的完整十题预检得到 **0/10 可评测、10/10 测试台兼容性阻塞**；独立 Prob038 哨兵同样阻塞，不计入分母。已按计划停止：Baseline、Agent、40 题均为 **NOT_RUN**，真实模型派发 **0 次**，P09 预算和历史归档未修改。

这不是模型通过率为 0%。可评测分母为零，模型通过率、修复率及收益全部为 null。没有模型生成、模型修复或 Skill 效果证据。已完成的是预检与 NO-GO 交付，不是完整 P10 模型对照实现。

## 原因与边界

Vivado 2025.2 对未修改原始测试台报告 **VRFC 10-3380: identifier 'tb_mismatch' is used before its declaration**，随后 **VRFC 10-8530** 忽略 tb 模块。11 次运行均停在 compile，elaborate、simulation、synthesis 全部 SKIPPED。没有修改 reference/testbench、没有换题、没有调用模型尝试修复 Host 拥有的测试台。

| 任务 | 归属 | 结果 | 原测试台诊断行 |
| --- | --- | --- | --- |
${table}

这里仅确认所列 11 个评测器的真实 EDA 结果，不由静态相似模式推断其余全部 156 题都失败。版本探测中 vivado -version 返回 1，但输出匹配 2025.2；实际 xvlog 编译日志明确将失败归于测试台。保留原始返回码，不将其改写为成功。

## 已实现

- 固定 origin/revision、干净工作树与 468 个原始资产身份；仅对 Git 声明的 LF/CRLF 检出做身份比较，不改写运行字节。
- 结果前冻结十题选题、完整四十题顺序、公开接口与 5 ns 真实/虚拟时钟策略；manifest 自身哈希使用独立收据。
- dsh Host 专用无模型 profile，永久任务 claim、配置/源码漂移检查及独立目录；复用 VerificationRunner 的前三阶段，预检永远不产生候选 VERIFIED。
- JSON/CSV 对照占位、兼容性表、错误分布、轨迹索引及 GO/NO-GO；普通候选仍要求四阶段。
- 双语 P10 文档与 Agent Note。完整模型分支、P10 派发总账、共享候选接入及公开属性 Skill 过滤未在此停止分支实现。

## 验证与审计

RTL 回归：328 通过、4 跳过、0 失败；P10 定向测试 6 通过；类型检查、定向 lint、git diff --check 通过。双语文档快速检查 16/16 通过。完整 doc-sync 为 33 通过、1 项环境阻塞：Windows 在文档站点测试创建符号链接时返回 EPERM，未修改无关测试。Mock/集成测试不替代真实模型证据。

11 份 EDA 终态 manifest 共 ${audit.eda_manifest_files} 项文件已逐项核对大小/SHA-256及完整文件集；结果、verification key、源码哈希、任务身份和最后 run_finished 事件一致。468 个数据集资产未变，72 个冻结运行文件未变，进程快照无遗留 EDA/campaign 进程。P09 三份历史归档合计 9038 个文件及 277 个运行链接复核通过。

预检实际墙钟 ${report.wall_ms} ms；十题预检合计 ${report.metrics.preflight_eda_wall_ms} ms，哨兵 ${acceptance.sentinel_preflight_ms} ms。模型与候选评分成本未发生。既有工具接口限制、凭据环境清理、进程回收和哈希检查不构成完整 OS 隔离，full_os_isolation_verified=false。

## 交付索引

- [十题 JSON](pilot-10/p10-results-10.json) / [CSV](pilot-10/p10-results-10.csv)
- [对照报告](pilot-10/p10-baseline-vs-agent-10.md)、[兼容性表](pilot-10/p10-benchmark-compatibility-10.csv)、[错误分布](pilot-10/p10-failure-distribution-10.csv)
- [十题 manifest](pilot-10/manifest/p10-manifest-10.json)、[四十题预先冻结顺序](pilot-10/manifest/selection-order.json)、[轨迹索引](pilot-10/trajectory-index.json)
- [GO/NO-GO](pilot-10/p10-go-no-go.json)、[40 题未运行](main-40/NOT_RUN.json)、[审计结果](audit-results.json)、[质量检查](quality-summary.json)
- [归档审计](artifact-manifest-audit.md)、[启动与纠正记录](startup-history.md)、[机器可读验收](p10-acceptance.json)

旧启动失败、解析器缺陷版本及用户中断版本均单独保留，不与当前样本合并。未来如授权兼容性研究，必须另建明确标注的评测器版本，不能补写本次成绩。完整 OS 隔离、ROCm/本地模型/断网部署、全面时序收敛和统计显著收益均未签收。`);
await putText('artifact-manifest-audit.md', `# Artifact Manifest Audit

## Verified Before Sealing

- 11 terminal EDA manifests: complete file sets, ${audit.eda_manifest_files} file sizes and SHA-256 digests match; result.json equals the final run_finished event.
- Independent task, wrapper hash and verification key bindings match. No candidate export or stale PASS exists.
- All 468 original dataset assets and 72 frozen runtime inputs match. Raw reference/testbench bytes are unchanged.
- Three P09 archives retain 9038 regular files and 277 runtime links. Their existing manifest bytes match the pre-run freeze.
- The model-free profile dispatched no model requests. Model-route audits are NOT_RUN, not vacuous model acceptance.
- Process snapshot contains no surviving EDA or campaign Node/cmd processes. This is not OS isolation evidence.

## Campaign Seal

The campaign manifest is generated only after this document, acceptance files and quality logs are closed. It records every regular file with size/SHA-256 and excludes only campaign-artifact-manifest.json itself. Only dsh profile node_modules runtime links are permitted; targets are recorded without following them or claiming their contents are archived.

The seal procedure scans twice before writing and once afterward. A separate read-only verification is required after sealing. Its receipt is stored beside, not inside, the archive as ../p10-20260918-v8.receipt.json, avoiding a self-referential manifest. Earlier P10 launches are sealed independently and never pooled into the v8 scores.

The artifact audit does not sign off Baseline/Agent execution, tokenizer requests, repair gain, forty-task results, full isolation or benchmark compatibility fixes.`);
console.log(JSON.stringify({ status: 'READY_TO_SEAL', acceptance: join(root, 'p10-acceptance.md'), quality }));
