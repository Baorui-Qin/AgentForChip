$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$repo = 'D:\deepseek-harness'
function ReadJson([string]$path) { Get-Content -Raw -LiteralPath $path | ConvertFrom-Json }
function Hash([string]$path) { (Get-FileHash -Algorithm SHA256 -LiteralPath $path).Hash.ToLowerInvariant() }
function Json([string]$name, $value) { $value | ConvertTo-Json -Depth 45 | Set-Content -LiteralPath (Join-Path $root $name) -Encoding utf8 }
$tests = ReadJson (Join-Path $root 'rtl-regression-final.json')
$rows = @()
foreach ($folder in @('p09', 'p09-v2')) {
  foreach ($directory in Get-ChildItem -Directory -LiteralPath (Join-Path $root $folder) -Filter 'repair-*') {
    $state = ReadJson (Join-Path $directory.FullName 'state.json')
    foreach ($kind in @('positive', 'negative')) {
      $run = if ($kind -eq 'positive') { $state.calibration_run } else { $state.p09.negative_calibration_run }
      if (-not $run) { continue }
      $result = ReadJson (Join-Path $run 'result.json')
      $receipt = ReadJson (Join-Path $run 'diagnostics-1.4.json')
      $snapshot = @($result.artifact_manifest | Where-Object { $_ -match '^snapshot-[^/]+/manifest.json$' })[0]
      $manifest = ReadJson (Join-Path $run $snapshot)
      $rows += [ordered]@{
        catalog = $folder; task = $state.fixture; experiment = $state.experiment_id; kind = $kind
        experiment_outcome = $state.outcome; run = $run; final_status = $result.final_status
        stages = @($receipt.stages | Select-Object stage,status,complete,process_clean,verdict)
        source_sha256 = $result.final_source_sha256; assets = $manifest.files
        verification_key = $result.verification_key; result_sha256 = Hash (Join-Path $run 'result.json')
        parser_sha256 = $receipt.parser_sha256
        synthesis = $result.stages.synthesis.synthesis
        simulation = $result.stages.simulation.evidence
        duration_ms = ($result.stages.PSObject.Properties.Value | Measure-Object duration_ms -Sum).Sum
        model_requests = $state.model_runs.Count
        files = $result.artifact_manifest
      }
    }
  }
}
Json 'real-calibration-index.json' $rows
$sourceNames = @('p09-context.ts','p09-proposal.ts','p09-tokenizer.ts','p09-tasks.ts','p09-report.ts','repair-workflow.ts','repair-diagnostics.ts','repair-policy.ts','model.ts','recorder.ts','candidates.ts','repair.ts','repair-report.ts')
$sourceFiles = @($sourceNames | ForEach-Object { 'rtl-tools/src/phase1/' + $_ }) + @('rtl-tools/src/vivado-parser.ts','rtl-tools/src/synthesis.ts','rtl-tools/src/synthesis-output.ts','rtl-tools/phase1/p09/count_tokens.py','rtl-tools/phase1/p09/config.example.json','rtl-tools/phase1/p09/skills.draft.json','tsconfig.base.json')
$sourceHashes = @($sourceFiles | ForEach-Object { @{ path = $_; sha256 = Hash (Join-Path $repo $_) } })
Json 'source-freeze.json' @{ schema_version='1.0'; captured_at=(Get-Date).ToUniversalTime().ToString('o'); files=$sourceHashes; plan_sha256=Hash 'D:\AMD\doc\P09_EXECUTION_PLAN.md'; references_zip_sha256=Hash 'D:\AMD\doc\p09_references_and_plan.zip' }
$recipe = 'D:\AMD\p09-runtime\deepseek-recipe'
$recipeFiles = @('LICENSE','Cargo.lock','rust-toolchain.toml','deepseek-recipe-python/pyproject.toml','docs/tokenizer.md','static/tokenizers/v41/tokenizer.json','deepseek-recipe-encoding/src/v4/dsv41.rs')
Json 'tokenizer-provenance.json' @{
  schema_version='1.0'; repository='https://github.com/deepseek-ai/deepseek-recipe'; revision='8cadfede7063c896b944e7bae05daa3549ae97ea'; license='MIT'; python_binding_version='0.1.1'
  installed_official_runtime=$false; real_exact_count_verified=$false; provider_equivalence_verified=$false
  status='BLOCKED'; reason='Current Python 3.12 pip index queries found no installable deepseek-recipe distribution. Source build dependencies (Rust, libclang/OpenCV development environment) are not provisioned. Source checkout is not an installed tokenizer.'
  source_files=@($recipeFiles | ForEach-Object { @{ path=$_; sha256=Hash (Join-Path $recipe $_) } })
  mock_counter_quality='estimated'; silent_fallback=$false; local_model_deployment=$false
}
$mapping = @(
  @('T01','deterministic|repeat','COMPONENT'), @('T02','two real Mock verification rounds','COMPONENT'), @('T03','binding|foreign|replay','COMPONENT'), @('T04','immutable|core|preserv','COMPONENT'),
  @('T05','official tokenizer','BLOCKED'), @('T06','official tokenizer','BLOCKED'), @('T07','Loader records the audited','COMPONENT'), @('T08','exact|boundary|budget','COMPONENT'),
  @('T09','core|budget','COMPONENT'), @('T10','source|budget','COMPONENT'), @('T11','replays actual captured','COMPONENT'), @('T12','two real Mock verification rounds','COMPONENT'),
  @('T13','diagnostic|consequential','COMPONENT'), @('T14','mismatch counts but blocks|independent','COMPONENT'), @('T15','core|optional','COMPONENT'), @('T16','T16: diagnostic instructions','COMPONENT'),
  @('T17','literal|placeholder|deterministic','COMPONENT'), @('T18','ledger|facts','COMPONENT'), @('T19','foreign|binding','COMPONENT'), @('T20','draft|skill','COMPONENT'),
  @('T21','skill','COMPONENT'), @('T22','skill','COMPONENT'), @('T23','initial|skill','COMPONENT'), @('T24','three isolated routes','COMPONENT'),
  @('T25','P09 context recovery','COMPONENT'), @('T26','P09.*transport|P09 does not recover','COMPONENT'), @('T27','P09.*format','COMPONENT'), @('T28','P09 total-attempt','COMPONENT'),
  @('T29','P09 never stops|repeats any earlier','COMPONENT'), @('T30','','NOT_APPLICABLE'), @('T31','P09 Loader records','MOCK_ONLY'), @('T32','P09 binds two|negative calibration tampering','COMPONENT')
)
$coverage = @($mapping | ForEach-Object {
  $item=$_; $matched=@($tests.testResults.assertionResults | Where-Object { $item[1] -and $_.fullName -match $item[1] } | Select-Object fullName,status)
  @{ id=$item[0]; status=$(if ($item[2] -in @('BLOCKED','NOT_APPLICABLE','MOCK_ONLY')) { $item[2] } elseif ($matched.Count -and @($matched | Where-Object status -ne 'passed').Count -eq 0) { 'COMPONENT_EVIDENCE' } else { 'REVIEW_REQUIRED' }); test_cases=$matched }
})
Json 'test-coverage-map.json' @{ schema_version='1.0'; note='Mappings identify supporting component tests, not proof of every subcondition or official/runtime acceptance. T05/T06 blocked on official runtime; T30 tools=[] is not applicable; T31 actual network parity remains unverified.'; cases=$coverage }
$blockers = @(
  @{ id='P09-001'; stage='Q1/Q5/Q6/Q7'; status='OPEN'; issue='Official tokenizer runtime unavailable; exact-local and provider-usage comparison not accepted.' },
  @{ id='P09-002'; stage='P07 prerequisite'; status='OPEN'; issue='Supplemental full-access/API execution was not authorized by the execution review. No EDA/API action from that attempt ran; explicit scoped confirmation remains required.' },
  @{ id='P09-003'; stage='Q4'; status='OPEN'; issue='Three skill entries remain draft; no real evidence-backed validated skill bundle has been frozen. C must not be presented as a completed skill-effect experiment.' },
  @{ id='P09-004'; stage='Q6/Q7'; status='NOT_RUN'; issue='No P09 real model proposal, review or candidate validation; 15 cells remain NOT_RUN. Natural multi-round behavior has not been observed.' },
  @{ id='P09-005'; stage='Q7 orchestration'; status='OPEN'; issue='CLI exposes individual runs and an immutable rotated schedule. Cross-process cohort scheduling and duplicate-attempt prevention are not enforced by a cohort lock; reporter rejects duplicates. A host operator must not start the same cell twice.' },
  @{ id='P09-006'; stage='report compatibility'; status='RESOLVED_WITH_NEW_RUN'; issue='Observed Vivado inf/0.000 timing row is now null non_finite_wns with warning. Failed calibration retained; same assets recalibrated in new run 66a58a91-658b-428f-8901-6855c6b9e4d0.' }
)
Json 'open-issues.json' $blockers
$calibrated = @($rows | Where-Object { $_.catalog -eq 'p09-v2' -and $_.kind -eq 'positive' -and $_.experiment_outcome -eq 'CALIBRATED' })
$acceptance = [ordered]@{
  schema_version='1.0'; generated_at=(Get-Date).ToUniversalTime().ToString('o'); workflow_schema='1.6'; status='PARTIAL_IMPLEMENTATION_AND_ACCEPTANCE'
  component_tests=@{ passed=$tests.numPassedTests; failed=$tests.numFailedTests; skipped=$tests.numPendingTests; test_files=$tests.testResults.Count; report='rtl-regression-final.json' }
  documentation=ReadJson (Join-Path $root 'documentation-checks.json')
  quality=ReadJson (Join-Path $root 'quality-checks.json')
  real_calibrated_tasks=$calibrated.Count; real_api_attempts=0; real_model_repairs_verified=0; real_multi_round_observed=$false
  p09_real_ablation=@{ planned=15; started=0; verified=0; status='NOT_RUN'; maximum_provider_attempts=225 }
  validated_skill_count=0; official_tokenizer_verified=$false; full_os_isolation_verified=$false; prob038='SEPARATE_BLOCKED'; blockers=$blockers
  references=@{ observation_masking='https://arxiv.org/abs/2508.21433v3'; tokenizer='https://github.com/deepseek-ai/deepseek-recipe/blob/8cadfede7063c896b944e7bae05daa3549ae97ea/docs/tokenizer.md' }
  logs='real-calibration-index.json'; source_freeze='source-freeze.json'; coverage='test-coverage-map.json'
}
Json 'p09-acceptance.json' $acceptance
$table = '| Task | Positive stages | Checks / mismatches | Negative mismatches / checks | WNS ns |' + "`n| --- | --- | --- | --- | --- |`n"
foreach ($row in $calibrated | Sort-Object task) {
  $negative = @($rows | Where-Object { $_.experiment -eq $row.experiment -and $_.kind -eq 'negative' })[0]
  $wns = if ($null -eq $row.synthesis.timing.wns) { 'null (' + $row.synthesis.timing.reason + ')' } else { [string]$row.synthesis.timing.wns }
  $table += '| ' + $row.task + ' | ' + (($row.stages.status) -join '/') + ' | ' + $row.simulation.checks_executed + ' / ' + $row.simulation.mismatch_count + ' | ' + $negative.simulation.mismatch_count + ' / ' + $negative.simulation.checks_executed + ' | ' + $wns + " |`n"
}
$zh = @"
# P09 实现与验收报告

## 结论

核心上下文与受控恢复代码已接入原有 P07/P08 工作流，组件与真实手写评分器校准有证据。P09 整体验收尚未通过：官方 Tokenizer 未安装成功、技能仍为 draft、P07 补充实验待执行授权、真实单夹具和五题 A/B/C 尚未运行。本轮真实 API 调用为 0，不能声称模型修好了五题或证明了多轮收益。

## 已实现

- 在 callText 配置解析后、流派发前构建并审计完整请求；没有新增 HTTP 客户端或修改核心 agent-loop。
- TaskSpec 固定五题公开接口及独立评分资产，支持符号属性；单文件单 DUT，沿用审批、快照和导出。
- 必需题面、当前 RTL 和独立错误不裁剪；可选技能、账本和附加诊断确定性裁剪，重复计量完整请求。
- A/B/C 独立上下文；最多两条事实账本、两条离线规则；关闭技能不读技能文件。三条技能目前未达 validated。
- 每实验最多 15 个预算占用、最多三轮语义修复；上下文/格式各恢复一次，共享传输重试额度。保留实际派发与仅占用预算的区别。
- 新 schema 1.6 工作流、上下文侧写、恢复记录及全 15 单元汇总；每份模型候选仍需逐份人工审查。

## 测试与真实校准

最终回归：$($tests.numPassedTests) 通过、$($tests.numFailedTests) 失败、$($tests.numPendingTests) 跳过。跳过的是 3 个 opt-in Vivado 工具测试和 1 个 Icarus 安装测试，不作为本轮验收通过。另通过真实 dsh/Vivado 校准以下五题，模型调用均为 0。

$table

负例均在仿真阶段确认失配，综合 SKIPPED，这是评分器命中错误，不是负例设计通过。真实日志、网表、原始报告、源文件及资产哈希见 [real-calibration-index.json](real-calibration-index.json)，每个 run 下保留 result.json、events.jsonl、snapshot-*/manifest.json 与 build/。

## 保留的失败与修正

1. 初版 enable_counter 因 XSIM 43-4099 的 timescale 编译单元配置失败。新内部任务 v2 保持一次 xvlog -sv，调整可信 TB 在 DUT 前；未修改 VerilogEval 资产。初版记录保留在 p09/。
2. signed_saturating_add 首次仿真 65536 次零失配，实际综合成功，但 WNS=inf 被当作报告解析错误，四阶段未通过。窄修正将实测 inf/0.000 报告值记录为 null/non_finite_wns，并保留警告；不增加 I/O 约束、不修改设计。补充运行 66a58a91-658b-428f-8901-6855c6b9e4d0 用相同资产通过校准，历史 CALIBRATION_FAILED 不改写。
3. VRFC 10-8549 的实测关键词错误已增加窄分类与策略测试，真实历史日志重解析保存在 p09-v2/replay-68b7e806-8c28-43ef-997c-05c82dacc82b/diagnostic-replay.json。eda_rerun=false，model_repair_executed=false，不冒充补充修复实验。

## 尚未完成

官方源码已固定提交与许可证，但当前 Python 环境未找到可安装发行包，源码构建依赖未就绪。未部署本地模型，也未用字符估计冒充准确 Token。详见 [tokenizer-provenance.json](tokenizer-provenance.json)。仅模板封装存在不等于 T05/T06 通过。

P07 完整访问补充命令被执行审查拒绝，未绕过；需要明确限定授权再启动。P09 单夹具与五题真实调用均未开始，所有 15 个单元在 [A/B/C 报告](p09-v2/report-cad0629d-3a41-4040-b213-aa46f011c780/p09-ablation.json) 中保留 NOT_RUN。来源技能必须先校准并冻结，不能把 draft 当已验证技能。跨进程总协调锁和提前拒绝重复单元尚未实现，当前汇总器拒绝重复结果，而不是自动挑选有利样本。

## 路径与验收边界

机器结果：[p09-acceptance.json](p09-acceptance.json)。测试映射：[test-coverage-map.json](test-coverage-map.json)。开放问题：[open-issues.json](open-issues.json)。实现身份：[source-freeze.json](source-freeze.json)。完整日志索引：[real-calibration-index.json](real-calibration-index.json)。原始测试结果：[rtl-regression-final.json](rtl-regression-final.json)。

本报告分别回答：P09 参与控制在 Mock 中已验证；真实模型修复未测；真实多轮未观察；A/B/C 效果不可比较。五题手写校准不代表自然生成任务通过。完整 OS 隔离、无人审批修复、比赛环境及 Prob038 兼容性不签收。
"@
$zh | Set-Content -LiteralPath (Join-Path $root 'p09-acceptance.zh.md') -Encoding utf8
$en = @"
# P09 Implementation and Partial Acceptance

## Result

The existing reviewed P07/P08 workflow now supports deterministic bounded context, request audits, two-entry factual history, frozen offline skill selection, bounded recoveries, and five independent task contracts. No new agent loop or HTTP client was added. Every model candidate still requires individual human review.

Final regression: $($tests.numPassedTests) passed, $($tests.numFailedTests) failed, $($tests.numPendingTests) opt-in environment tests skipped. Official tokenizer acceptance is blocked. The source checkout is pinned but not an installed Python runtime. Mock counters are explicitly estimated. Three skills remain draft, and no evidence-backed skill bundle is accepted.

## Real Handwritten Calibration

$table

All negative cases fail simulation and skip synthesis as intended. These are evaluator checks, not generated-design or model-repair results. The initial timescale failure and the first saturating-adder report failure remain preserved. The latter produced an actual netlist and zero mismatches, but the parser rejected WNS=inf. A narrow parser change retains null/non_finite_wns with a warning. A fresh supplemental run used unchanged DUT/TB/XDC bytes; it does not rewrite the historical failure or claim timing closure.

## Unfinished Acceptance

Real API attempts: 0. The P07 supplemental execution awaits scoped authorization after execution-review rejection. P09 single-fixture and 15-cell A/B/C runs are NOT_RUN. Real multi-round behavior has not been observed. No accuracy or statistical improvement is claimed. The CLI publishes a rotated schedule but does not implement a cross-process cohort lock; duplicate aggregate cells are rejected rather than selected.

[Machine-readable acceptance](p09-acceptance.json), [real run/log/hash index](real-calibration-index.json), [test mappings](test-coverage-map.json), [open issues](open-issues.json), [tokenizer provenance](tokenizer-provenance.json), and [full test results](rtl-regression-final.json) retain separate component, replay, handwritten EDA and unstarted-model evidence. Full OS isolation, unattended execution, competition replication and Prob038 compatibility are not accepted.
"@
$en | Set-Content -LiteralPath (Join-Path $root 'p09-acceptance.md') -Encoding utf8
Write-Output (Join-Path $root 'p09-acceptance.zh.md')
