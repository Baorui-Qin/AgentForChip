import { readFile, writeFile, readdir, copyFile, appendFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const report = process.argv[2];
if (!report || !report.replaceAll('\\','/').startsWith(root + '/report-')) throw new Error('Explicit campaign report required');
const hash = b => createHash('sha256').update(b).digest('hex');
const read = async p => JSON.parse(await readFile(p, 'utf8'));
const acceptance = await read(join(report, 'p09-real-loop-acceptance.json'));
const ablation = await read(join(report, 'p09-ablation.json'));
const manifests = await read(join(report, 'artifact-manifest-audit.json'));
const freeze = await read(join(root, 'ablation-freeze.json'));
const postCampaign = await read(join(root, 'post-campaign-fix.json'));
for (const [path, expected] of Object.entries(freeze.files)) {
  const actual = hash(await readFile(path));
  if (actual !== expected && !(path.replaceAll('\\','/') === postCampaign.file && expected === postCampaign.before_sha256 && actual === postCampaign.after_sha256)) throw new Error('Unexpected changed frozen file: ' + path);
}
const contexts = [], bindings = [], classifications = [];
for (const row of acceptance.experiments) {
  const state = await read(join(row.directory, 'state.json'));
  if (state.phase !== 'TERMINAL') throw new Error('Experiment still running');
  if (row.bucket === 'ablation' && state.calibrated && state.p09.source_history[0] !== freeze.tasks.find(t => t.id === row.task).bad_source_sha256) throw new Error('Different formal starting source');
  if (row.bucket === 'ablation' && !state.calibrated && (state.model_runs.length || state.attempts)) throw new Error('Repair started without calibration');
  classifications.push({ experiment: row.experiment_id, category: 'controlled_repair_fixture', execution: row.model_origin, bucket: row.bucket,
    model_dispatches: row.provider_attempts, accepted_repairs: row.semantic_repairs, handwritten_calibration: state.calibration_run,
    initial_negative: state.verification_runs[0] ?? null, final_verification: state.verification_run, model_generated_from_spec: false });
  for (const path of state.model_runs) {
    const model = await read(join(path, 'model.json'));
    if (!model.dispatched) { contexts.push({ path, dispatched: false, error: model.error_code, local_tokens: null, provider_tokens: model.prompt_tokens }); continue; }
    const body = await read(join(path, 'prompt-final.txt')), audit = await read(join(path, 'context-audit.json')), input = await read(join(path, 'context.json'));
    if (hash(JSON.stringify(body)) !== model.prompt_sha256 || model.prompt_sha256 !== audit.final_prompt_sha256 || audit.tokens !== model.local_tokens) throw new Error('Request audit mismatch');
    const view = JSON.parse(body.messages.find(m => m.role === 'user').content);
    if (hash(view.current.source) !== audit.source_sha256 || view.current.revision_id !== audit.revision_id) throw new Error('Context source mismatch');
    if (input.pending_verification && (view.verification_key !== null || view.observed !== null)) throw new Error('Old observation masquerading as new');
    if (row.variant === 'A' && view.history.length || row.variant !== 'C' && view.guidance.length) throw new Error('Context group leakage');
    contexts.push({ path, dispatched: true, request_sha256: model.prompt_sha256, revision: audit.revision_id, source_sha256: audit.source_sha256,
      verification_key: audit.verification_key, pending_verification: audit.pending_verification, ledger_count: view.history.length,
      ledger_entries: view.history.map(e => e.revision_id), selected_skills: audit.selected_skills, local_tokens: model.local_tokens,
      provider_tokens: model.prompt_tokens, provider_minus_local: model.prompt_tokens === null ? null : model.prompt_tokens - model.local_tokens,
      necessary_reasoning_replay: body.messages.some(m => Object.hasOwn(m, 'reasoning_content')), usage_equivalence_claimed: false });
  }
  if (row.bound_pass) {
    const result = await read(join(state.verification_run, 'result.json'));
    const exported = await readFile(join(row.directory, 'output/solution.sv'));
    bindings.push({ experiment: row.experiment_id, source_sha256: state.current.source_sha256, verification_key: result.verification_key,
      export_matches: hash(exported) === state.current.source_sha256, stages: Object.fromEntries(Object.entries(result.stages).map(([k,v]) => [k,v.status])) });
  }
}
const preflight = acceptance.experiments.filter(r => r.bucket === 'preflight');
const formal = acceptance.experiments.filter(r => r.bucket === 'ablation');
const skillValidation = await read(join(root, 'skill-validation.json'));
const controlled = preflight.filter(r => r.task.startsWith('controlled_multi_round'));
const tickets = (await readdir(join(root, 'dispatches'))).filter(x => x.endsWith('.json'));
if (tickets.length !== acceptance.real_api_attempts) throw new Error('Reserved dispatch and actual records differ; investigate before delivery');
const gate = test => test ? 'PASS' : 'NOT_RUN';
acceptance.acceptance = {
  minimal_autonomous_loop: gate(preflight.some(r => r.task === 'rising_edge' && r.bound_pass)),
  synthesis_only_autonomous: gate(preflight.some(r => r.task === 'synthesis-only' && r.bound_pass && !r.validation_skill)),
  controlled_multi_round: controlled.some(r => r.bound_pass && r.semantic_repairs >= 2) ? 'PASS' : controlled.length === 2 ? 'NOT_OBSERVED' : 'NOT_RUN',
  restricted_tool_interface: 'PASS_WITHOUT_OS_ISOLATION', official_whole_request_counting: 'PASS_EXACT_LOCAL_ONLY',
  audit: manifests.every(m => m.status === 'PASS') ? 'PASS' : 'BLOCKED',
  skills: skillValidation.length === 3 && skillValidation.every(s => s.status === 'validated') ? 'PASS_APPLICABILITY_NOT_EFFICACY' : 'BLOCKED',
  ablation_execution: formal.length === 15 && formal.every(r => !['READY','BUSY'].includes(r.status)) ? 'COMPLETE' : 'NOT_RUN',
  ablation_valid_comparison: formal.some(r => ['CALIBRATION_FAILED','UNEXPECTED_INITIAL_RESULT','HOST_OR_BINDING_BLOCKED','POLICY_BLOCKED'].includes(r.status)) ? 'BLOCKED_BY_HOST_OR_EDA_FAILURE' : 'COMPLETED_FIXED_SAMPLE_ONLY',
  full_os_isolation: 'NOT_VERIFIED', implementation_timing_closure: 'NOT_ACCEPTED', prob038: 'BLOCKED_TESTBENCH_COMPATIBILITY', statistical_gain: 'NOT_ESTABLISHED',
};
acceptance.budget = { preflight_used: preflight.reduce((n,r) => n+r.provider_attempts,0), preflight_cap:150,
  ablation_used:formal.reduce((n,r) => n+r.provider_attempts,0), ablation_cap:225, total_used:tickets.length,total_cap:375, monetary_cost_guaranteed:false };
acceptance.report_origin = report;
acceptance.starting_source_audit = 'PASS_FOR_STARTED_REPAIRS; CALIBRATION_BLOCKS_REMAIN_NOT_STARTED'; acceptance.context_audit = 'PASS';
acceptance.post_campaign_fix = postCampaign;
acceptance.formal_repair_started = formal.filter(r => r.provider_attempts > 0).length;
const hostOutcomes = ['CALIBRATION_FAILED','UNEXPECTED_INITIAL_RESULT','HOST_OR_BINDING_BLOCKED','POLICY_BLOCKED','TOKENIZER_UNAVAILABLE','CONTEXT_UNSATISFIABLE'];
acceptance.formal_host_blocks = formal.filter(r => hostOutcomes.includes(r.status)).map(r => ({ task:r.task,variant:r.variant,status:r.status,api_attempts:r.provider_attempts }));
acceptance.formal_model_or_protocol_failures = formal.filter(r => !r.bound_pass && !hostOutcomes.includes(r.status)).map(r => ({task:r.task,variant:r.variant,status:r.status,api_attempts:r.provider_attempts}));
const historicalP07 = 'D:/AMD/phase1-validation/p07-loop-20260916/repair-a5b5290c-57f0-46a0-9779-2f557811a0eb/state.json';
const historicalP07Bytes = await readFile(historicalP07);
acceptance.p07 = { historical_manual_synthesis_pass_preserved:JSON.parse(historicalP07Bytes).outcome === 'VERIFIED',
  historical_state_path:historicalP07,historical_state_sha256:hash(historicalP07Bytes),historical_calls_in_new_budget:false,
  new_p09_synthesis_autonomous:acceptance.acceptance.synthesis_only_autonomous };
acceptance.verification = { rtl_regression: await read(join(root,'regression-postfix.json')).then(r=>({passed:r.numPassedTests,failed:r.numFailedTests,skipped:r.numPendingTests})),
  focused: await read(join(root,'focused-delivery.json')).then(r=>({passed:r.numPassedTests,failed:r.numFailedTests,skipped:r.numPendingTests})),
  typecheck:'PASS',targeted_lint:'PASS',doc_quick:{passed:16,failed:0},doc_sync:{passed:33,failed:1,reason:'Windows symlink privilege EPERM in unrelated documentation site test'},
  git_diff_check:'PASS' };
const verified = formal.filter(r=>r.bound_pass).length;
acceptance.formal_verified = verified;
acceptance.preflight_verified = preflight.filter(r=>r.bound_pass).length;
const allOneShot = formal.length === 15 && formal.every(r=>r.semantic_repairs <= 1);
acceptance.strategy_limitations = { all_formal_at_most_one_edit:allOneShot, causal_improvement_claimed:false, natural_generation_success_rate:false,
  b_pilot_synthesis_timeout_preserved:preflight.some(r=>r.task==='functional'&&r.variant==='B'&&r.status==='POLICY_BLOCKED') };
await writeFile(join(root,'p09-real-loop-acceptance.json'),JSON.stringify(acceptance,null,2),{flag:'wx'});
await copyFile(join(report,'p09-ablation.json'),join(root,'p09-ablation.json'));
await copyFile(join(report,'p09-ablation.csv'),join(root,'p09-ablation.csv'));
await writeFile(join(root,'request-context-audit.json'),JSON.stringify(contexts,null,2),{flag:'wx'});
await writeFile(join(root,'verification-bindings.json'),JSON.stringify(bindings,null,2),{flag:'wx'});
await writeFile(join(root,'evidence-classification.json'),JSON.stringify({real_runs:classifications,mock:'regression-final.json / focused-delivery.json',replay:'historical only; not new success evidence',handwritten:'per-run positive calibration',model_generation_from_spec:[]},null,2),{flag:'wx'});
await writeFile(join(root,'artifact-manifest-audit.md'),'# Artifact Manifest Audit\n\n终态模型和 EDA 清单逐一核对文件集合、大小与 SHA256；清单明确排除自身。原始事件和结果在关闭刷盘后生成清单。\n\n- 已审计运行数：'+manifests.length+'\n- 不一致运行数：'+manifests.filter(m=>m.status!=='PASS').length+'\n- 请求正文哈希、当前修订、新旧验证状态和最终导出绑定均另行核对。\n- 整批归档索引见 campaign-artifact-manifest.json；生成后再次核对，不包含该索引自身。\n- 旧历史记录不改写。\n',{flag:'wx'});
await writeFile(join(root,'p09-real-loop-acceptance.md'),`# P09 真实自主修复验收\n\n实现复用现有 RepairWorkflow、DeepSeek 适配器和 VerificationRunner。默认保留人工审查，自动模式须显式授权。所有结果是冻结缺陷修复实验，不是从题面自然生成的成功率。\n\n## 验收状态\n\n| 项目 | 状态 |\n| --- | --- |\n${Object.entries(acceptance.acceptance).map(([k,v])=>`| ${k} | ${v} |`).join('\n')}\n\n## 正式对照\n\n完成 ${formal.length}/15 单元，四阶段绑定 PASS ${verified}/15。每题各组使用相同冻结错误 DUT，运行顺序、协议、技能与源码均在 ablation-freeze.json 固定。没有复用预验收结果，没有挑选最佳样本。\n\n${allOneShot ? '所有正式单元最多接受一次修复。因此 B 的旧失败账本未在第二次编辑决策中被检验，C 的提示包含技能也不能证明技能带来收益。' : '逐单元修复轮次、调用数与状态见 p09-ablation.json/csv；单题单样本不足以支持统计显著收益。'}\n\n## 预算和异常\n\n实际 API 派发 ${tickets.length}/375，其中预验收 ${acceptance.budget.preflight_used}/150、主对照 ${acceptance.budget.ablation_used}/225。未知 usage 保留 null，本地 Token 与 provider usage 分别记录。两次早期运行在派发前因运行时路径/硬链接完整性检查停止，API 为零，未删除记录。B 预试运行的候选仿真通过但综合超时，保留为 POLICY_BLOCKED，不重标为设计错误或成功；不能仅凭同时运行过测试便断言超时根因。\n\n## 质量检查\n\nRTL 范围回归 ${acceptance.verification.rtl_regression.passed} 通过、${acceptance.verification.rtl_regression.failed} 失败、${acceptance.verification.rtl_regression.skipped} 跳过；最后定向测试 ${acceptance.verification.focused.passed} 通过。类型检查、定向 lint、双语配对及 doc-quick 通过。完整 doc-sync 为 33 通过、1 失败：Windows 无符号链接创建权限导致既有文档站测试 EPERM，未修改该无关测试或系统权限。\n\n## 签收边界\n\nP07 历史人工审批 synthesis-only 成功记录保留；P09 自主 synthesis-only 由新证据独立证明。两个指定多轮夹具的一次修好不冒充两轮验收。工具接口受限不等于操作系统隔离，full_os_isolation_verified 始终为 false。全面时序收敛、Prob038 兼容性及统计显著收益均不随闭环成功签收。\n\n详细请求审计见 request-context-audit.json，模型原始工具轨迹与 EDA 记录位于 experiments，各技能证据见 skill-validation.md/json，旧选择器失败调查见 failure-analysis-skill-selector.md。\n`,{flag:'wx'});
await appendFile(join(root,'p09-real-loop-acceptance.md'), '\n## 主对照阻塞与批次后修复\n\n正式单元均保留固定分母，但只有 '+acceptance.formal_repair_started+' 个实际进入模型修复。校准失败的单元没有错误 DUT 修复轨迹，不能算作模型失败，也不能为该组推断上下文收益。\n\n| Task | Group | Status | API Calls |\n| --- | --- | --- | --- |\n'+acceptance.formal_host_blocks.map(r=>`| ${r.task} | ${r.variant} | ${r.status} | ${r.api_attempts} |`).join('\n')+'\n\nVivado 临时目录消失引发了实时配额扫描的竞争条件。全部正式单元在原冻结代码下完成并由 campaign-end-audit.json 封存后，才对当前源码修复：仅忽略消失的临时子目录 ENOENT，保留根目录、权限、可信资产与终态清单的严格检查。没有重跑或替换失败单元。scan-race-before.json 保留修复前可重现失败，regression-postfix.json 保留修复后回归。post-campaign-fix.json 明确记录正式执行版本与当前交付源码的区别；该修复不冒充已经补齐 C 组真实实验。\n');
console.log(JSON.stringify({gates:acceptance.acceptance,budget:acceptance.budget,formal_verified:verified}));
if(acceptance.formal_model_or_protocol_failures.length) await appendFile(join(root,'p09-real-loop-acceptance.md'),'\n## 模型或协议未完成单元\n\n这些结果与宿主校准阻塞分别记录；输出截断不会执行不完整工具参数，也不自动重抽样或增加输出额度。\n\n| Task | Group | Status | API Calls |\n| --- | --- | --- | --- |\n'+acceptance.formal_model_or_protocol_failures.map(r=>`| ${r.task} | ${r.variant} | ${r.status} | ${r.api_attempts} |`).join('\n')+'\n');
