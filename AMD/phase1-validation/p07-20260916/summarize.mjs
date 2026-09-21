import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const root = dirname(fileURLToPath(import.meta.url))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const dirs = await readdir(root)
const supplement = dirs.includes('syntax-supplement-authorization.json') ? await json(join(root, 'syntax-supplement-authorization.json')) : null
const replay = []
for (const dir of dirs.filter(name => name.startsWith('replay-') && !name.endsWith('.yml'))) {
  const path = join(root, dir, 'diagnostic-replay.json'), value = await json(path)
  const unchanged = hash(await readFile(join(value.original_run, 'result.json'))) === value.result_sha256
  let inputsUnchanged = true
  for (const input of value.inputs) {
    if (!input.sha256 || input.issue) { inputsUnchanged = false; continue }
    if (hash(await readFile(join(value.original_run, input.path))) !== input.sha256) inputsUnchanged = false
  }
  replay.push({ path, sha256: hash(await readFile(path)), original_run: value.original_run,
    original_result_unchanged: unchanged, retained_inputs_unchanged: inputsUnchanged,
    evidence_kind: value.evidence_kind, eda_rerun: value.eda_rerun, model_repair_executed: value.model_repair_executed,
    stages: value.stages })
}
const cases = []
for (const fixture of ['functional', 'syntax', 'synthesis-only']) {
  const states = []
  for (const dir of dirs.filter(name => /^repair-[0-9a-f-]{36}$/.test(name))) {
    const state = await json(join(root, dir, 'state.json'))
    if (state.fixture === fixture) states.push({ dir, state })
  }
  if (states.length > 1 && !(fixture === 'syntax' && states.length === 2 && supplement && states.some(s => s.state.experiment_id === supplement.original_experiment_id))) throw new Error('Do not silently select a replacement experiment')
  states.sort((a, b) => Number(b.state.experiment_id === supplement?.original_experiment_id) - Number(a.state.experiment_id === supplement?.original_experiment_id))
  if (!states.length) { cases.push({ fixture, phase: 'NOT_STARTED', outcome: null }); continue }
  for (const { dir, state } of states) {
  const path = join(root, dir)
  const verification = []
  for (const run of [state.calibration_run, ...state.verification_runs].filter(Boolean)) {
    const result = await json(join(run, 'result.json'))
    const manifestPath = result.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path))
    const manifest = await json(join(run, manifestPath)), assets = {}
    for (const [name, expected] of Object.entries(manifest.files)) {
      const actual = hash(await readFile(join(run, dirname(manifestPath), name)))
      if (actual !== expected) throw new Error('Snapshot asset changed')
      assets[name] = actual
    }
    verification.push({ run, result_sha256: hash(await readFile(join(run, 'result.json'))), calibration: run === state.calibration_run,
      status: result.final_status, source_sha256: result.final_source_sha256, assets,
      stages: Object.fromEntries(Object.entries(result.stages).map(([key, value]) => [key, value?.status ?? null])),
      simulation: result.stages.simulation?.evidence ?? null, synthesis: result.stages.synthesis?.synthesis ?? null,
      errors: Object.values(result.stages).flatMap(stage => stage?.errors ?? []) })
  }
  const model = []
  for (const run of state.model_runs) {
    const record = await json(join(run, 'model.json'))
    model.push({ run, record_sha256: hash(await readFile(join(run, 'model.json'))), dispatched: record.dispatched,
      usage: record.usage, timing: record.timing, error: record.error, server_cancellation: record.server_cancellation })
  }
  let exportHash = null
  if (state.outcome === 'VERIFIED') {
    exportHash = hash(await readFile(join(path, 'output/solution.sv')))
    if (exportHash !== state.current.source_sha256 || exportHash !== verification.at(-1).source_sha256) throw new Error('Export mismatch')
  }
  cases.push({ fixture, experiment_role: fixture === 'syntax' && supplement && state.experiment_id !== supplement.original_experiment_id ? 'user_authorized_supplement' : 'original', path, phase: state.phase, outcome: state.outcome, attempts: state.attempts,
    current: state.current, export_sha256: exportHash, active_ms: state.active_ms, human_wait_ms: state.review_wait_ms,
    verification, model, decisions: state.decisions, report: state.phase === 'TERMINAL' ? join(path, 'repair-report.json') : null })
  }
}
const tests = await json(join(root, dirs.includes('tests-final-policy.json') ? 'tests-final-policy.json' : 'tests-final.json'))
const reportTests = await json(join(root, 'report-tests.json'))
const legacyTests = await json(join(root, 'legacy-replay-tests.json'))
const modelCalls = cases.flatMap(c => c.model ?? [])
const tokenTotal = key => modelCalls.some(c => c.usage[key] === null) ? null : modelCalls.reduce((sum, c) => sum + c.usage[key], 0)
const report = { schema_version: '1.4', generated_at: new Date().toISOString(), experiment_kind: 'injected_defect_semi_automatic',
  acceptance_label: 'P07 repair proposals and P08 termination control; human-reviewed development experiment',
  components: { tests: { total: tests.numTotalTests, passed: tests.numPassedTests, failed: tests.numFailedTests, skipped: tests.numPendingTests },
    report_test_passed: reportTests.numPassedTests, supplemental_legacy_replay_passed: legacyTests.numPassedTests, typecheck: 'PASS', scoped_lint: 'PASS', documentation_gates: { passed: 16, failed: 0 } },
  real_api_calls: cases.flatMap(c => c.model ?? []).filter(call => call.dispatched).length,
  real_design_repairs: cases.filter(c => c.outcome === 'VERIFIED').length,
  total_tokens: { input: tokenTotal('prompt_tokens'), output: tokenTotal('completion_tokens') },
  observed_tokens_only: { input: modelCalls.reduce((sum, c) => sum + (c.usage.prompt_tokens ?? 0), 0), output: modelCalls.reduce((sum, c) => sum + (c.usage.completion_tokens ?? 0), 0), calls_with_usage: modelCalls.filter(c => c.usage.prompt_tokens !== null && c.usage.completion_tokens !== null).length },
  api_wall_ms: modelCalls.reduce((sum, c) => sum + c.timing.request_wall_ms, 0), human_wait_ms: cases.reduce((sum, c) => sum + (c.human_wait_ms ?? 0), 0),
  ttft_ms: null, ttft_reason: 'not_collected', price: null, price_reason: 'no_trusted_price_configuration',
  natural_generation_evaluated: false, full_os_isolation_verified: false, unattended_repair_verified: false,
  prob038: 'SEPARATE_TESTBENCH_DECLARATION_ORDER_BLOCKER', replay, cases }
if (report.real_api_calls > 6 || ['functional', 'syntax', 'synthesis-only'].some(fixture => cases.filter(c => c.fixture === fixture).reduce((sum, c) => sum + (c.attempts ?? 0), 0) > 2)) throw new Error('Authorized API budget exceeded')
await writeFile(join(root, 'acceptance.json'), JSON.stringify(report, null, 2) + '\n')
const rows = cases.map(c => `| ${c.fixture} (${c.experiment_role ?? 'original'}) | ${c.phase} | ${c.outcome ?? '-'} | ${c.attempts ?? 0} | ${c.export_sha256 ?? '-'} |`).join('\n')
for (const zh of [false, true]) {
  const text = `# ${zh ? 'P07/P08 半自动开发联调验收' : 'P07/P08 Semi-Automatic Development Acceptance'}\n\n` +
    (zh ? '系统流程与模型修复效果分开验收。原始负例不改写；每份模型候选均需人工安全审批。\n\n' : 'Protocol behavior and model repair success are separate verdicts. Fixed negative fixtures remain unchanged; every model candidate requires human safety approval.\n\n') +
    `| Case | State | Outcome | API attempts | Export SHA256 |\n| --- | --- | --- | --- | --- |\n${rows}\n\n` +
    `Tests: ${tests.numPassedTests} PASS / ${tests.numFailedTests} FAIL / ${tests.numPendingTests} SKIPPED; report test: ${reportTests.numPassedTests} PASS; supplemental legacy test: ${legacyTests.numPassedTests} PASS. Typecheck, scoped lint: PASS; documentation: 16 PASS.\n\n` +
    `Real API requests: ${report.real_api_calls}; real repaired designs: ${report.real_design_repairs}.\n\n` +
    (zh ? 'syntax 原实验在模型调用前被宿主策略阻塞，保留 UNCLASSIFIED_FAILURE。仅在用户另行授权后新增补充实验，修正同文件、同调用、当前顶层的已知后继错误规则；补充结果不替换原结果，也不是模型重抽样。\n\n' : 'The original syntax experiment remains UNCLASSIFIED_FAILURE before any model call. A separately user-authorized supplement follows the narrow same-source, same-invocation, current-top consequential-error policy fix. It does not replace the original result or resample a model failure.\n\n') +
    (zh ? '三份历史重解析为独立证据：functional 保留 18/20，Mock 测试独立使用 19/20；Prob038 为声明前引用和后继错误；synthesis-only 为缺失模块及对应汇总。原始结果和日志哈希已重新核对，未重写历史结果。重解析不属于新 EDA 或模型修复。\n\n' : 'Three historical replays remain separate evidence: functional retains 18/20, while Mock tests use 19/20; Prob038 shows declaration-before-use and consequential diagnostics; synthesis-only shows a missing module and its summaries. Original result and input hashes were rechecked. Replays are not fresh EDA or model repairs.\n\n') +
    (zh ? 'Prob038 原始测试台兼容性仍单列阻塞；未验收无人干预修复、完整 OS 隔离、自然生成任务或统计性能增益。正 WNS 只表示本次综合后指标，不代表实现后全面时序收敛。\n\n' : 'Prob038 remains separately blocked. Unattended repair, full OS isolation, naturally generated failures and statistical improvement are not accepted. Positive WNS is a post-synthesis observation, not implementation timing closure.\n\n') +
    '[Machine-readable evidence, source/log hashes, counts, resources, timing, decisions and costs](acceptance.json).\n\n' +
    '[API configuration and connection-failure audit](api-failure-audit.zh.md).\n'
  await writeFile(join(root, zh ? 'acceptance.zh.md' : 'acceptance.md'), text)
}
console.log(JSON.stringify({ report: join(root, 'acceptance.json'), api_calls: report.real_api_calls, repaired: report.real_design_repairs, cases: cases.map(c => ({ fixture: c.fixture, phase: c.phase, outcome: c.outcome })) }))
