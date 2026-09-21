import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = 'D:/AMD/phase1-validation/p07-loop-20260916'
const old = 'D:/AMD/phase1-validation/p07-20260916'
const sha = value => createHash('sha256').update(value).digest('hex')
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const optional = async path => { try { return await json(path) } catch (e) { if (e.code === 'ENOENT') return null; throw e } }
const frozen = await json(join(root, 'frozen-inputs.json'))
const changed = []
for (const [group, values] of Object.entries({ historical: frozen.historical, code: frozen.code, configuration: frozen.configuration })) {
  for (const [path, hash] of Object.entries(values)) {
    try { if (sha(await readFile(path)) !== hash) changed.push({ group, path }) }
    catch { changed.push({ group, path, missing: true }) }
  }
}
async function eda(path) {
  if (!path) return null
  const result = await optional(join(path, 'result.json'))
  if (!result) return { path, incomplete: true }
  const stages = Object.fromEntries(Object.entries(result.stages).map(([name, stage]) => [name, stage && {
    status: stage.status, errors: stage.errors, warnings: stage.warnings, evidence: stage.evidence, duration_ms: stage.duration_ms,
    failure_domain: stage.failure_domain, synthesis: stage.synthesis ?? null, report_path: stage.report_path ?? null,
    invocations: stage.invocations, processes: stage.processes
  }]))
  const manifestPath = result.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path))
  const manifest = manifestPath ? await json(join(path, manifestPath)) : null
  let timingReport = null
  if (result.stages.synthesis?.status === 'PASS' && result.stages.synthesis.report_path) {
    const timingPath = join(path, dirname(result.stages.synthesis.report_path), 'timing.rpt')
    const raw = await readFile(timingPath, 'utf8'), lines = raw.split(/\r?\n/)
    const header = lines.findIndex(line => /^\s*WNS\(ns\).*WHS\(ns\)/.test(line))
    timingReport = { path: timingPath, sha256: sha(raw), summary_verbatim: header < 0 ? null : lines.slice(header, header + 6).join('\n') }
  }
  if (manifest) {
    for (const asset of ['trusted/tb.sv', 'trusted/clock.xdc']) {
      const expected = frozen.fixtures.counter[asset].sha256
      const actual = sha(await readFile(join(path, dirname(manifestPath), asset)))
      if (manifest.files[asset] !== expected || actual !== expected) changed.push({ group: 'evaluator', path: join(path, dirname(manifestPath), asset) })
    }
    const actualSource = sha(await readFile(join(path, dirname(manifestPath), 'rtl/solution.sv')))
    if (actualSource !== result.final_source_sha256) changed.push({ group: 'candidate', path })
  }
  return { path, result_path: join(path, 'result.json'), source_sha256: result.final_source_sha256, verification_key: result.verification_key,
    status: result.final_status, stages, snapshot: manifestPath, manifest, stop_reason: result.stop_reason, timing_report: timingReport }
}
const experiments = []
for (const name of (await readdir(root)).filter(name => name.startsWith('repair-')).sort()) {
  const dir = join(root, name), state = await json(join(dir, 'state.json'))
  const models = []
  for (const round of state.loop?.rounds ?? []) {
    for (const attempt of round.transport) {
      const model = await optional(join(attempt.directory, 'model.json'))
      const eventsPath = join(attempt.directory, 'events.jsonl')
      const events = (await readFile(eventsPath, 'utf8')).trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
      const requests = events.filter(e => e.type === 'model_request')
      const prompt = requests[0]?.value.prompt
      const currentSource = prompt?.split('Current candidate:\n')[1]?.split('\nObserved feedback:\n')[0]
      models.push({ semantic_repair_round: round.semantic_repair_round, transport_attempt: attempt.transport_attempt,
        path: attempt.directory, model, transport: attempt, actual_request_events: requests, events_path: eventsPath,
        actual_prompt_source_sha256: currentSource === undefined ? null : sha(currentSource),
        prompt_binding_verified: currentSource !== undefined && sha(currentSource) === round.prompt_current_source_sha256 && sha(prompt) === round.prompt_sha256 })
    }
  }
  const revisions = []
  const ids = [state.loop?.initial_revision_id, ...(state.loop?.rounds ?? []).map(round => round.new_revision_id)].filter(Boolean)
  for (const [index, id] of ids.entries()) {
    const path = join(dir, 'revisions', id, 'rtl', 'solution.sv'), source = await readFile(path, 'utf8')
    const revision = { index, id, path, sha256: sha(source), source, diff: null }
    if (index) {
      const diff = spawnSync('git', ['--no-pager', 'diff', '--no-index', '--no-ext-diff', '--text', '--', revisions[index - 1].path, path], { encoding: 'utf8', windowsHide: true })
      if (![0, 1].includes(diff.status)) throw new Error('Diff failed: ' + diff.stderr)
      revision.diff = join(dir, `revision_${index - 1}-to-${index}.diff`)
      try { await writeFile(revision.diff, diff.stdout, { flag: 'wx' }) } catch (e) { if (e.code !== 'EEXIST' || await readFile(revision.diff, 'utf8') !== diff.stdout) throw e }
    }
    revisions.push(revision)
  }
  const verification = []
  for (const run of state.verification_runs) verification.push(await eda(run))
  const feedback = []
  for (const round of state.loop?.rounds ?? []) feedback.push({ round: round.semantic_repair_round, path: join(dir, `feedback-${round.semantic_repair_round}.json`), value: await json(join(dir, `feedback-${round.semantic_repair_round}.json`)) })
  const exported = await optional(join(dir, 'export.json'))
  const exportedHash = exported ? sha(await readFile(join(dir, 'output', 'solution.sv'))) : null
  experiments.push({ path: dir, state, calibration: await eda(state.calibration_run), verification, models, feedback, revisions, exported,
    export_sha256: exportedHash, export_binding_verified: !!exported && state.outcome === 'VERIFIED' && exportedHash === state.current.source_sha256 && exportedHash === verification.at(-1)?.source_sha256,
    multi_round_binding_verified: (state.loop?.rounds.length ?? 0) > 1 && models.every(model => model.prompt_binding_verified) && state.loop.rounds.slice(1).every((round, index) => round.prompt_current_source_sha256 === revisions[index + 1]?.sha256 && round.feedback_sha256 !== state.loop.rounds[index].feedback_sha256) })
}
const prior = []
for (const id of ['976c8961-8e44-4ba7-97f2-54fb3c542683', 'ba415c6f-29b5-4dc1-8bcc-a66bec7d2dd8', 'adbf4093-ae00-40b2-b883-3154293b6b2a']) {
  const path = join(old, 'repair-' + id), state = await json(join(path, 'state.json'))
  prior.push({ fixture: state.fixture, experiment_id: id, outcome: state.outcome, path, historical_not_rerun: true })
}
const tests = await json(join(root, 'component-tests.json'))
const suitePassed = tests.numFailedTests === 0
const synthesis = experiments.find(e => e.state.fixture === 'synthesis-only')
const multi = experiments.find(e => e.state.fixture.startsWith('controlled_') && e.state.outcome === 'VERIFIED' && e.multi_round_binding_verified && e.state.loop.rounds[0]?.outcome === 'MODEL_SEMANTIC_REPAIR_FAILURE' && e.state.loop.rounds[1]?.outcome === 'VERIFIED')
const allRuns = experiments.flatMap(e => e.verification)
const changedGroups = group => changed.filter(entry => entry.group === group)
const ac = [
  ['AC-P07-1', synthesis?.state.outcome === 'VERIFIED', 'Historical real functional/syntax plus this independent synthesis repair.'],
  ['AC-P07-2', synthesis?.state.outcome === 'VERIFIED' && !changedGroups('historical').length, 'Historical connection failure preserved; new independent synthesis experiment.'],
  ['AC-P07-3', !!multi, 'Real first repair fails; second uses new current-source feedback and passes.'],
  ['AC-P07-4', experiments.some(e => e.verification.length > 1) && allRuns.every(r => r.stages?.compile?.status === 'PASS' || r.stages?.compile?.status === 'FAIL') && new Set(allRuns.map(run => run.snapshot)).size === allRuns.length, 'Reviewed candidate verifications start at compilation with distinct snapshots; Mock also covers multiple rounds.'],
  ['AC-P07-5', changed.length === 0, 'Frozen evaluator/config/code and historical artifact hashes remain unchanged.'],
  ['AC-P07-6', suitePassed, 'Mock Loader and workflow distinguish transport attempts from semantic rounds.'],
  ['AC-P07-7', suitePassed, 'Mock transport exhaustion stops with transport, not semantic, failure.'],
  ['AC-P07-8', suitePassed, 'Mock repair-budget branch; not a forced real cloud failure.'],
  ['AC-P07-9', suitePassed, 'Mock repeated candidate cycle stops before revalidation.'],
  ['AC-P07-10', !!synthesis?.export_binding_verified && !!multi?.export_binding_verified, 'Current verified/exported source hashes match, without stale PASS.']
].map(([id, pass, evidence]) => ({ id, status: pass ? 'PASS' : 'NOT YET VERIFIED', evidence }))
const calls = experiments.flatMap(e => e.models), retries = calls.filter(call => call.transport_attempt > 1 && call.model?.dispatched).length
const blocker = await optional(join(root, 'controlled-blocker.json'))
const edaDuration = run => run?.stages ? Object.values(run.stages).reduce((sum, stage) => sum + (stage?.duration_ms ?? 0), 0) : null
const time = {
  model_ms: calls.reduce((sum, call) => sum + (call.model?.timing.request_wall_ms ?? 0), 0),
  candidate_eda_ms: allRuns.reduce((sum, run) => sum + (edaDuration(run) ?? 0), 0),
  calibration_eda_ms: experiments.reduce((sum, experiment) => sum + (edaDuration(experiment.calibration) ?? 0), 0),
  completed_active_ms: experiments.reduce((sum, experiment) => sum + experiment.state.active_ms, 0),
  completed_review_wait_ms: experiments.reduce((sum, experiment) => sum + experiment.state.review_wait_ms, 0),
  pending_review_wait_ms: experiments.reduce((sum, experiment) => sum + (experiment.state.waiting_since ? Date.now() - experiment.state.waiting_since : 0), 0)
}
const report = { schema_version: '1.5', generated_at: new Date().toISOString(), p07: ac.every(item => item.status === 'PASS') ? 'PASS' : 'NOT YET VERIFIED',
  scope: 'controlled_semi_automatic_injected_defect_repair', unattended_verified: false, full_os_isolation_verified: false,
  prob038_original_evaluator: 'BLOCKED', prior, experiments, acceptance: ac, host_investigation: blocker,
  integrity: { changed, historical_files_checked: Object.keys(frozen.historical).length, code_files_checked: Object.keys(frozen.code).length },
  component_tests: { total: tests.numTotalTests, passed: tests.numPassedTests, skipped: tests.numPendingTests, failed: tests.numFailedTests, source: join(root, 'component-tests.json') },
  actual_requests: calls.filter(call => call.model?.dispatched).length, transport_retries: retries,
  semantic_rounds: experiments.reduce((sum, e) => sum + e.state.attempts, 0), initial_generation: 0,
  tokens: { prompt: calls.some(c => c.model?.usage.prompt_tokens == null) ? null : calls.reduce((n, c) => n + c.model.usage.prompt_tokens, 0),
    completion: calls.some(c => c.model?.usage.completion_tokens == null) ? null : calls.reduce((n, c) => n + c.model.usage.completion_tokens, 0) }, time, ttft_ms: null, price: null }
const lines = ['# P07 有限修复循环验收', '', `当前结论：**${report.p07}**。范围仅为人工逐候选审批的半自动联调。`, '',
  '## 执行范围', '', '新实验不替换历史 functional、syntax 或 synthesis-only 记录；固定负例、TB、XDC 和评分判据不改动。仅固定手写夹具可直接执行，模型候选必须逐份人工安全审查。首次生成调用为 0。', '',
  `本轮实际 API 请求 ${report.actual_requests} 次，semantic repair ${report.semantic_rounds} 轮，transport retry ${retries} 次。`,
  `模型耗时 ${time.model_ms} ms；候选 EDA ${time.candidate_eda_ms} ms；校准 EDA ${time.calibration_eda_ms} ms；已完成审批等待 ${time.completed_review_wait_ms} ms，当前仍在等待 ${time.pending_review_wait_ms} ms。人工等待不计入活动预算。`,
  `组件测试：${tests.numPassedTests} 通过，${tests.numPendingTests} 可选跳过，${tests.numFailedTests} 失败。它们不是实际模型修复成功的替代证据。`, '',
  '## 历史证据', '', ...prior.map(p => `- ${p.fixture}: ${p.outcome}，目录：${p.path}。本轮未重跑或覆盖。`), '', '## 本轮时间线', '']
for (const experiment of experiments) {
  lines.push(`### ${experiment.state.fixture}`, '', `实验：${experiment.state.experiment_id}；当前状态：${experiment.state.phase} / ${experiment.state.outcome ?? '等待后续操作'}。`, '',
    `目录：${experiment.path}`, '', '| 验证轮 | 源码 SHA256 | Compile | Elaborate | Simulation | Synthesis |', '| --- | --- | --- | --- | --- | --- |')
  experiment.verification.forEach((run, index) => lines.push(`| ${index} | ${run.source_sha256} | ${['compile','elaborate','simulation','synthesis'].map(stage => run.stages?.[stage]?.status ?? '未完成').join(' | ')} |`))
  lines.push('')
  lines.push(`宿主决策：${JSON.stringify(experiment.state.decisions)}。`, '')
  if (blocker?.experiment_id === experiment.state.experiment_id) lines.push('首次编译已按 SystemVerilog 模式执行。`VRFC 10-4982` 是 DUT 第 5 行语法错误；同位置的 `VRFC 10-8549` 关键字上下文错误未被当前归一化逻辑识别，仍为 `unknown`。宿主因此返回 `UNCLASSIFIED_FAILURE`，模型调用为 0，后续三个阶段均为 SKIPPED。这是宿主识别覆盖缺口，不是 API 错误、遗漏 -sv 或模型修复失败。原夹具、冻结策略和失败记录均保留，未通过重跑或修改评分器绕过。', '', `独立调查记录：${join(root, 'controlled-blocker.json')}`, '')
  for (const item of experiment.feedback) lines.push(`反馈 ${item.round}：${item.value.stage}；primary=${JSON.stringify(item.value.primary_error)}；${item.path}`, '')
  for (const revision of experiment.revisions) lines.push(`版本 ${revision.index}：${revision.id}，SHA256=${revision.sha256}。${revision.diff ? ' Diff：' + revision.diff : ''}`, '', '```verilog', revision.source.trimEnd(), '```', '')
  for (const call of experiment.models) lines.push(`模型：semantic round ${call.semantic_repair_round} / transport attempt ${call.transport_attempt}；${call.model?.provider}/${call.model?.model_id}；tokens=${call.model?.usage.prompt_tokens}/${call.model?.usage.completion_tokens}；wall=${call.model?.timing.request_wall_ms} ms；error=${call.model?.error?.category ?? 'none'}。`, '', `原始请求与响应事件：${call.events_path}；完整响应：${call.path}/response.txt。`, '')
  for (const run of experiment.verification) {
    lines.push(`EDA 结果与逐工具 invocation/log 索引：${run.result_path}。`, '')
    if (run.stages?.simulation?.evidence) lines.push(`仿真判据：${JSON.stringify(run.stages.simulation.evidence)}。`, '')
    if (run.stages?.synthesis?.synthesis) lines.push(`综合指标：${JSON.stringify(run.stages.synthesis.synthesis)}。警告：${JSON.stringify(run.stages.synthesis.warnings)}。`, '')
    if (run.timing_report?.summary_verbatim) lines.push(`原始时序表（保留 WNS、WHS 等独立检查，不将正 WNS 当作全面收敛）：${run.timing_report.path}`, '', '```text', run.timing_report.summary_verbatim, '```', '')
  }
  lines.push(`最终导出绑定已确认：${experiment.export_binding_verified}。多轮当前源码/新反馈绑定已确认：${experiment.multi_round_binding_verified}。`, '')
}
lines.push('## AC-P07-1 至 AC-P07-10', '', '| 验收项 | 状态 | 证据边界 |', '| --- | --- | --- |', ...ac.map(item => `| ${item.id} | ${item.status} | ${item.evidence} |`), '',
  '## 逐项回答', '',
  `1. synthesis-only 是否补跑成功：${synthesis?.state.outcome === 'VERIFIED' ? '是，本次真实四阶段通过。' : '尚未确认；见上述当前状态，不能把候选已返回当作修复成功。'}`,
  `2. 本轮实际 transport retry：${retries} 次；Mock 故障注入单独统计。`,
  '3. synthesis-only 实际修改：以上版本源码和自动生成的 diff 是权威记录，不由宿主代写补丁。',
  `4. synthesis-only 四阶段全 PASS：${synthesis?.state.outcome === 'VERIFIED' ? '是。' : '尚未确认。'}`,
  `5. 实际第二轮 semantic repair：${multi?.state.experiment_id ?? '尚无满足两轮 FAIL→PASS 的真实实验。'}`,
  '6. Round 1 未通过原因：见实际四阶段结果及新反馈；未执行时不推断。',
  '7. Round 2 新反馈：见 feedback-2.json；未产生时不存在。',
  '8. Round 2 修改：见 revision_1-to-2.diff；不人工修改模型答案。',
  '9. 每份新候选必须从 compile 开始；当前实测见时间线，组件测试覆盖两轮重启。',
  `10. 冻结资产或实现变化：${changed.length ? JSON.stringify(changed) : '未发现；历史文件和冻结实现/配置已重新核对。'}`,
  '11. repeated candidate：组件测试验证跨轮哈希重复会停止；不将 Mock 结果称作真实模型行为。',
  '12. repair budget exhausted：组件测试验证最多三轮后停止；不额外调用 API 强行耗尽预算。',
  '13. 当前仍需逐轮人工批准。',
  '14. 即使全部 AC 通过，也只能签收受控/半自动闭环，不签收无人干预 Agent。',
  '15. Prob038 original evaluator compatibility: BLOCKED。',
  `16. 当前可签收范围：${report.p07 === 'PASS' ? '本次受控半自动真实修复循环。' : '组件实现及已取得的单步证据；真实多轮闭环尚不能签收。'}`, '',
  '## 日志位置与限制', '', '每个实验的 event-*.json 是追加状态事件；models/run-*/events.jsonl 保存实际请求、响应与 usage，transport.json 记录有限重试。eda/run-*/result.json 索引每次 xvlog/xelab/xsim/Vivado 的参数、stdout/stderr 和退出事实。完整日志不回灌模型。', '',
  'TTFT 未采集，价格未知，不推算费用；正 WNS 不是实现后全面时序收敛。自然缺陷、完整 OS 隔离、无人干预执行和 Prob038 原评分资产兼容性未通过本实验验收。', '')
await writeFile(join(root, 'p07-acceptance.json'), JSON.stringify(report, null, 2))
await writeFile(join(root, 'p07-acceptance.md'), lines.join('\n'))
console.log(JSON.stringify({ p07: report.p07, changed: changed.length, experiments: experiments.length, actual_requests: report.actual_requests, retries }))
