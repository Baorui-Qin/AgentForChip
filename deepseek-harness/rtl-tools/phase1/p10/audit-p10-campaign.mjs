import { createHash } from 'node:crypto'
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const EXPECTED_MANIFEST = '02872f104347a256b0d8564a1b2194621daf98144c5ba89f33ee73fa1c476742'
const EXPECTED_SUITE = '880f2dabca449f800238edf3458739ca8e37e811bfc5750d8474298af2b80353'
const EXPECTED_TASKS = ['Prob005_notgate', 'Prob035_count1to10', 'Prob045_edgedetect2', 'Prob074_ece241_2014_q4', 'Prob015_vector1',
  'Prob033_ece241_2014_q1c', 'Prob004_vector2', 'Prob020_mt2015_eq2', 'Prob018_mux256to1', 'Prob061_2014_q4a']
const CATEGORIES = ['OUTPUT_TRUNCATED', 'TIMEOUT', 'TRANSPORT', 'TOOL_ERROR', 'POLICY_BLOCKED']

const root = process.argv[2]
if (!root) throw new Error('Usage: node audit-p10-campaign.mjs <campaign-root>')
const reportRoot = join(root, 'report')
const auditorPath = fileURLToPath(import.meta.url)
const sealedAuditorPath = join(root, 'audit-p10-campaign.sealed.mjs')
const hash = value => createHash('sha256').update(value).digest('hex')
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const exists = async path => access(path).then(() => true, () => false)
const percentage = (value, denominator) => denominator ? Math.round(value * 10000 / denominator) / 100 : null
const csv = value => `"${String(value ?? '').replaceAll('"', '""')}"`

function category(value) {
  const status = String(value ?? '').toUpperCase()
  if (status === 'VERIFIED' || status === 'PASS') return 'PASS'
  if (status === 'OUTPUT_TRUNCATED') return 'OUTPUT_TRUNCATED'
  if (status === 'TIMEOUT' || status === 'ACTIVE_TIMEOUT') return 'TIMEOUT'
  if (['TRANSPORT', 'CONNECTION', 'CONNECT', 'SERVER'].includes(status)) return 'TRANSPORT'
  if (['TOOL_ERROR', 'EXECUTION_OR_EVIDENCE', 'EDA_INFRASTRUCTURE'].includes(status)) return 'TOOL_ERROR'
  if (status === 'POLICY_BLOCKED') return 'POLICY_BLOCKED'
  return status || 'MISSING'
}

async function verifyAttempt(task, result, attempt) {
  const missing = []
  if (!attempt.baseline_failed || result.initial_status === 'PASS') missing.push('baseline_failed')
  if (attempt.feedback?.evidence_kind !== 'live_verification' || attempt.feedback?.source_sha256 !== attempt.edit?.previous_source_sha256) missing.push('bound_feedback')
  const contextPath = attempt.feedback?.model_run ? join(attempt.feedback.model_run, 'context.json') : null
  if (!contextPath || !await exists(contextPath)) missing.push('bound_feedback_context')
  else {
    const context = await json(contextPath)
    if (context.binding?.revision_id !== attempt.feedback.revision_id || context.binding?.source_sha256 !== attempt.feedback.source_sha256 ||
      context.binding?.verification_key !== attempt.feedback.verification_key || context.feedback?.evidence_kind !== 'live_verification') missing.push('bound_feedback_context')
  }
  if (!attempt.edit?.accepted) missing.push('edit_dut_accepted')
  if (!attempt.edit?.source_sha_changed || attempt.edit?.source_sha256 === attempt.edit?.previous_source_sha256) missing.push('source_sha_changed')
  const revision = (result.revisions ?? []).find(value => value.revision === attempt.edit?.revision_id)
  const revisionPath = revision?.directory ? join(revision.directory, 'solution.sv') : null
  if (!revisionPath || !await exists(revisionPath) || hash(await readFile(revisionPath)) !== attempt.edit?.source_sha256) missing.push('revision_source_persisted')
  const editAction = (result.actions ?? []).find(value => value.tool === 'edit_dut' && value.accepted && value.revision === attempt.edit?.revision_id)
  if (!editAction) missing.push('edit_action_record')
  if (!attempt.verification?.accepted || attempt.verification?.revision_id !== attempt.edit?.revision_id) missing.push('verify_new_revision')
  const verifyAction = (result.actions ?? []).find(value => value.tool === 'verify_rtl' && value.accepted && value.revision === attempt.edit?.revision_id)
  if (!verifyAction) missing.push('verify_action_record')
  const resultPath = attempt.verification?.verification_run ? join(attempt.verification.verification_run, 'result.json') : null
  if (!resultPath || !await exists(resultPath)) missing.push('persisted_vivado_result')
  else {
    const bytes = await readFile(resultPath)
    const record = JSON.parse(bytes)
    if (hash(bytes) !== attempt.verification.result_sha256 || record.final_source_sha256 !== attempt.edit.source_sha256) missing.push('persisted_vivado_result_binding')
  }
  return { task_id: task, semantic_round: attempt.semantic_round, valid: missing.length === 0, missing_steps: [...new Set(missing)], evidence: {
    feedback_model_run: attempt.feedback?.model_run ?? null, context: contextPath, revision: revisionPath,
    verification_run: attempt.verification?.verification_run ?? null, vivado_result: resultPath } }
}

async function modelEvents(modelRuns, task, route, events, evidenceModels, skillHashes) {
  const selected = []
  for (const directory of modelRuns ?? []) {
    const modelPath = join(directory, 'model.json')
    const dispatchPath = join(directory, 'dispatch.json')
    const auditPath = join(directory, 'context-audit.json')
    const promptJson = join(directory, 'prompt-final.json')
    const promptText = join(directory, 'prompt-final.txt')
    const model = await json(modelPath)
    const audit = await exists(auditPath) ? await json(auditPath) : null
    const promptPath = await exists(promptJson) ? promptJson : promptText
    const error = model.error_code ?? model.error?.category ?? null
    const eventCategory = category(error)
    if (CATEGORIES.includes(eventCategory)) events.push({ task_id: task, route, category: eventCategory, directory })
    for (const id of audit?.selected_skills ?? []) selected.push({ id, content_hash: skillHashes.get(id) ?? null, model_run: directory })
    evidenceModels.push({ task_id: task, route, directory, dispatched: model.dispatched === true, error, request_sha256: await exists(dispatchPath) ? (await json(dispatchPath)).request_sha256 : null,
      prompt_sha256: await exists(promptPath) ? hash(await readFile(promptPath)) : null, selected_skills: selected.filter(value => value.model_run === directory) })
  }
  return selected
}

const manifestPath = join(root, 'p10-manifest-10.json')
const suitePath = join(root, 'derived', 'verilogeval-vivado2025.2-compat-v1-manifest.json')
const freezePath = join(root, 'campaign-freeze.json')
const issues = []
if (hash(await readFile(manifestPath)) !== EXPECTED_MANIFEST) issues.push('FIXED_MANIFEST_SHA_MISMATCH')
if (hash(await readFile(suitePath)) !== EXPECTED_SUITE) issues.push('COMPATIBILITY_MANIFEST_SHA_MISMATCH')
const manifest = await json(manifestPath)
const order = manifest.task_ids ?? manifest.tasks?.map(value => value.task_id) ?? await json(join(root, 'selection-order.json'))
if (JSON.stringify(order) !== JSON.stringify(EXPECTED_TASKS)) issues.push('FIXED_TASK_ORDER_MISMATCH')
const freeze = await json(freezePath)
let postrunAuditorRevision = null
for (const [path, expected] of Object.entries(freeze.files ?? {})) {
  const actual = await exists(path) ? hash(await readFile(path)) : null
  if (actual === expected) continue
  if (path.toLowerCase() === auditorPath.toLowerCase() && await exists(sealedAuditorPath) && hash(await readFile(sealedAuditorPath)) === expected) {
    postrunAuditorRevision = { reason: 'REPORT_ONLY_REFERENCE_ERROR_AFTER_MODEL_RUN', frozen_sha256: expected, revised_sha256: actual,
      sealed_copy: sealedAuditorPath, scored_artifacts_changed: false }
  } else issues.push(`CAMPAIGN_SOURCE_CHANGED:${path}`)
}
const preflight = await json(join(root, 'compat-positive-negative-results.json'))
const p09 = await json(join(root, 'p09.json'))
const skills = await json(p09.skillsFile)
const skillHashes = new Map(skills.map(value => [value.id, value.content_hash]))
const rows = [], attempts = [], events = [], evidenceModels = [], evidenceRuns = []

for (const task of EXPECTED_TASKS) {
  const calibration = preflight.find(value => value.task_id === task)
  if (!calibration?.evaluable) {
    rows.push({ task_id: task, evaluator_status: calibration?.compat_status ?? 'MISSING', baseline_status: 'NOT_RUN', agent_status: 'NOT_RUN', terminal_reason: 'EVALUATOR_BLOCKED', terminal_category: 'EVALUATOR_BLOCKED' })
    continue
  }
  const generationDirectory = join(root, `generate-${task}`)
  const generationPath = join(generationDirectory, 'result.json')
  if (!await exists(generationPath)) {
    issues.push(`RESULT_MISSING:${generationPath}`)
    rows.push({ task_id: task, evaluator_status: 'EVALUATOR_READY', baseline_status: 'NOT_RUN', agent_status: 'NOT_RUN', terminal_reason: 'RESULT_MISSING', terminal_category: 'RESULT_MISSING' })
    continue
  }
  const generation = await json(generationPath)
  const selectedSkills = await modelEvents(generation.model_runs, task, 'initial', events, evidenceModels, skillHashes)
  if (generation.status !== 'GENERATED_UNVERIFIED') {
    rows.push({ task_id: task, evaluator_status: 'EVALUATOR_READY', generation_status: generation.status, baseline_status: 'NOT_RUN', agent_status: 'NOT_RUN',
      terminal_reason: generation.terminal_reason ?? generation.status, terminal_category: category(generation.status), logical_initial_requests: generation.logical_initial_requests ?? 1,
      initial_provider_dispatches: generation.initial_provider_dispatches ?? generation.physical_dispatches ?? 0, transport_retries: generation.transport_retries ?? 0,
      output_recovery_attempts: generation.output_recovery_attempts ?? 0, selected_skills: selectedSkills, evidence: { generation: generationPath, comparison: null } })
    continue
  }
  const comparisonDirectory = join(root, `compare-${task}`)
  const comparisonPath = join(comparisonDirectory, 'result.json')
  if (!await exists(comparisonPath)) {
    issues.push(`RESULT_MISSING:${comparisonPath}`)
    rows.push({ task_id: task, evaluator_status: 'EVALUATOR_READY', generation_status: generation.status, baseline_status: 'NOT_RUN', agent_status: 'NOT_RUN', terminal_reason: 'RESULT_MISSING', terminal_category: 'RESULT_MISSING' })
    continue
  }
  const comparison = await json(comparisonPath)
  selectedSkills.push(...await modelEvents(comparison.model_runs, task, 'repair', events, evidenceModels, skillHashes))
  if (generation.source_sha256 !== comparison.shared_initial_sha256) issues.push(`SHARED_INITIAL_SHA_MISMATCH:${task}`)
  for (const run of comparison.verification_runs ?? []) {
    const path = join(run, 'result.json')
    if (!await exists(path)) { issues.push(`VIVADO_RESULT_MISSING:${path}`); continue }
    const record = await json(path)
    const manifestName = (record.artifact_manifest ?? []).find(value => /^snapshot-[^/]+\/manifest\.json$/.test(value))
    const snapshotManifest = manifestName && await exists(join(run, manifestName)) ? await json(join(run, manifestName)) : null
    const compatibility = snapshotManifest?.evaluation?.compatibility ?? null
    if (!compatibility || compatibility.manifest_sha256 !== EXPECTED_SUITE || compatibility.vivado_version !== '2025.2') issues.push(`EVALUATOR_IDENTITY_MISMATCH:${run}`)
    evidenceRuns.push({ task_id: task, directory: run, result_sha256: hash(await readFile(path)), source_sha256: record.final_source_sha256,
      status: record.final_status, verified: record.final_verified, compatibility })
  }
  const taskAttempts = []
  for (const attempt of comparison.repair_attempts ?? []) {
    const audited = await verifyAttempt(task, comparison, attempt)
    taskAttempts.push(audited); attempts.push(audited)
    if (attempt.valid !== audited.valid || audited.missing_steps.length) issues.push(`INVALID_REPAIR_ATTEMPT:${task}:${attempt.semantic_round}:${audited.missing_steps.join('+')}`)
  }
  const baselineFailed = comparison.initial_status !== 'PASS'
  const agentPass = comparison.status === 'VERIFIED'
  if (agentPass) {
    const finalPath = join(comparisonDirectory, 'final.sv')
    if (!await exists(finalPath)) issues.push(`EXPORT_BINDING_INVALID:${task}:missing`)
    else {
      const finalHash = hash(await readFile(finalPath))
      if (finalHash !== comparison.final_exported_sha256 || finalHash !== comparison.verified_source_sha256 || finalHash !== comparison.current_source_sha256) issues.push(`EXPORT_BINDING_INVALID:${task}:sha`)
    }
  }
  const baselineRun = comparison.baseline_run ? join(comparison.baseline_run, 'result.json') : null
  let baselineToolError = comparison.initial_status === 'TOOL_ERROR'
  if (baselineRun && await exists(baselineRun)) {
    const record = await json(baselineRun)
    baselineToolError ||= record.final_status === 'TOOL_ERROR'
    if (baselineToolError) events.push({ task_id: task, route: 'baseline_verification', category: 'TOOL_ERROR', directory: comparison.baseline_run })
  }
  rows.push({ task_id: task, evaluator_status: 'EVALUATOR_READY', generation_status: generation.status, baseline_status: comparison.initial_status,
    agent_status: comparison.status, terminal_reason: comparison.terminal_reason ?? comparison.status, terminal_category: category(comparison.status),
    baseline_failed: baselineFailed, baseline_dut_failed: baselineFailed && comparison.repair_eligible === true,
    baseline_infrastructure_failed: baselineFailed && baselineToolError, repair_eligible: comparison.repair_eligible === true,
    repair_requested: comparison.repair_requested === true, bound_feedback_dispatches: comparison.bound_feedback_dispatches ?? 0,
    edit_accepted: comparison.edit_accepted === true, reverified: comparison.reverified === true,
    valid_repair_attempts: taskAttempts.filter(value => value.valid).length, recovered: baselineFailed && agentPass,
    semantic_repairs: comparison.semantic_repairs ?? 0, logical_initial_requests: generation.logical_initial_requests ?? 1,
    initial_provider_dispatches: generation.initial_provider_dispatches ?? generation.physical_dispatches ?? 0,
    logical_agent_requests: comparison.logical_agent_requests ?? null, agent_provider_dispatches: comparison.agent_incremental_model_requests ?? comparison.physical_dispatches ?? 0,
    transport_retries: (generation.transport_retries ?? 0) + (comparison.transport_retries ?? 0),
    output_recovery_attempts: (generation.output_recovery_attempts ?? 0) + (comparison.output_recovery_attempts ?? 0),
    initial_sha256: generation.source_sha256, final_sha256: comparison.final_exported_sha256 ?? comparison.current_source_sha256 ?? null,
    selected_skills: selectedSkills, evidence: { generation: generationPath, comparison: comparisonPath, baseline_run: baselineRun, final_run: comparison.final_verification_run ? join(comparison.final_verification_run, 'result.json') : null } })
}

const evaluable = rows.filter(value => value.evaluator_status === 'EVALUATOR_READY').length
const baselinePass = rows.filter(value => value.baseline_status === 'PASS').length
const agentPass = rows.filter(value => value.agent_status === 'VERIFIED').length
const funnel = { baseline_failed: rows.filter(value => value.baseline_failed).length, baseline_dut_failed: rows.filter(value => value.baseline_dut_failed).length,
  baseline_infrastructure_failed: rows.filter(value => value.baseline_infrastructure_failed).length,
  repair_eligible: rows.filter(value => value.repair_eligible).length, repair_requested: rows.filter(value => value.repair_requested).length,
  edit_accepted: rows.filter(value => value.edit_accepted).length, reverified: rows.filter(value => value.reverified).length,
  valid_repair_attempt_tasks: rows.filter(value => value.valid_repair_attempts > 0).length, valid_repair_attempts: attempts.filter(value => value.valid).length,
  invalid_repair_attempts: attempts.filter(value => !value.valid).length, recovered: rows.filter(value => value.recovered).length }
const classifications = Object.fromEntries(CATEGORIES.map(name => [name, { events: events.filter(value => value.category === name).length,
  affected_tasks: new Set(events.filter(value => value.category === name).map(value => value.task_id)).size,
  mutually_exclusive_terminal_tasks: rows.filter(value => value.terminal_category === name).length }]))
const totals = { selected: EXPECTED_TASKS.length, evaluable, evaluator_blocked: EXPECTED_TASKS.length - evaluable,
  baseline_verified: baselinePass, agent_final_verified: agentPass, recovered: funnel.recovered,
  repair_gain_absolute: agentPass - baselinePass, repair_gain_percentage_points: percentage(agentPass - baselinePass, evaluable),
  semantic_repairs: rows.reduce((sum, value) => sum + (value.semantic_repairs ?? 0), 0),
  transport_retries: rows.reduce((sum, value) => sum + (value.transport_retries ?? 0), 0),
  output_recovery_attempts: rows.reduce((sum, value) => sum + (value.output_recovery_attempts ?? 0), 0) }
const hardIssues = issues.filter(value => /^(FIXED_|COMPATIBILITY_|CAMPAIGN_SOURCE_CHANGED|RESULT_MISSING|VIVADO_RESULT_MISSING|EVALUATOR_IDENTITY_MISMATCH|SHARED_INITIAL_SHA_MISMATCH|EXPORT_BINDING_INVALID|INVALID_REPAIR_ATTEMPT)/.test(value))
const comparisonStatus = hardIssues.length ? 'P10_COMPARISON_INVALID' : 'P10_COMPARISON_VALID'
await mkdir(reportRoot, { recursive: true })
await writeFile(join(reportRoot, 'agent-opportunity-funnel.json'), JSON.stringify({ schema_version: 'p10-opportunity-funnel-1', task_funnel: funnel, classifications, attempts, rows: rows.map(value => ({ task_id: value.task_id, baseline_status: value.baseline_status, terminal_reason: value.terminal_reason, evidence: value.evidence })) }, null, 2) + '\n')
await writeFile(join(reportRoot, 'p10-results-10.json'), JSON.stringify({ schema_version: 'p10-results-10-2', comparison_status: comparisonStatus,
  p10_agent_implementation: 'p10-model.ts', legacy_comparison_route: 'NOT_USED_FOR_SCORE', counterexample_feedback: 'NOT_IMPLEMENTED', full_os_isolation_verified: false,
  postrun_auditor_revision: postrunAuditorRevision,
  manifest_sha256: EXPECTED_MANIFEST, compatibility_manifest_sha256: EXPECTED_SUITE, dataset_revision: 'c498220d0a52248f8e3fdffe279075215bde2da6', totals, funnel, classifications, rows, issues }, null, 2) + '\n')
const columns = ['task_id', 'evaluator_status', 'generation_status', 'baseline_status', 'agent_status', 'terminal_reason', 'repair_eligible', 'repair_requested', 'edit_accepted', 'reverified', 'valid_repair_attempts', 'recovered', 'semantic_repairs', 'transport_retries', 'output_recovery_attempts', 'initial_sha256', 'final_sha256']
await writeFile(join(reportRoot, 'p10-results-10.csv'), [columns.join(','), ...rows.map(row => columns.map(key => csv(row[key])).join(','))].join('\n') + '\n')
const failedLines = rows.filter(value => value.baseline_failed).map(value => `| ${value.task_id} | ${value.baseline_status} | ${value.terminal_reason} | ${value.repair_eligible} | ${value.edit_accepted} | ${value.reverified} | ${value.recovered} | ${value.evidence?.comparison ?? '-'} |`).join('\n') || '| - | - | - | - | - | - | - | - |'
const notRunLines = rows.filter(value => value.baseline_status === 'NOT_RUN').map(value => `| ${value.task_id} | ${value.generation_status} | ${value.terminal_reason} | ${value.initial_provider_dispatches ?? 0} | ${value.transport_retries ?? 0} | ${value.evidence?.generation ?? '-'} |`).join('\n') || '| - | - | - | - | - | - |'
await writeFile(join(reportRoot, 'p10-results-10.md'), `# P10 修复可达性 10 题重跑\n\n状态：**${comparisonStatus}**。实现为 \`p10-model.ts\`，legacy comparison 未参与计分。\n\n- Baseline verified：${baselinePass}/${evaluable}\n- Agent final verified：${agentPass}/${evaluable}\n- Recovered：${funnel.recovered}\n- Repair gain：${totals.repair_gain_absolute >= 0 ? '+' : ''}${totals.repair_gain_absolute} 题，${totals.repair_gain_percentage_points === null ? 'N/A' : `${totals.repair_gain_percentage_points >= 0 ? '+' : ''}${totals.repair_gain_percentage_points} 个百分点`}\n- 漏斗：baseline_failed=${funnel.baseline_failed} → repair_eligible=${funnel.repair_eligible} → repair_requested=${funnel.repair_requested} → edit_accepted=${funnel.edit_accepted} → reverified=${funnel.reverified} → recovered=${funnel.recovered}\n- 有效 repair attempt：${funnel.valid_repair_attempts}；无效 attempt：${funnel.invalid_repair_attempts}\n- OUTPUT_TRUNCATED=${classifications.OUTPUT_TRUNCATED.mutually_exclusive_terminal_tasks}，TIMEOUT=${classifications.TIMEOUT.mutually_exclusive_terminal_tasks}，TRANSPORT=${classifications.TRANSPORT.mutually_exclusive_terminal_tasks}，TOOL_ERROR=${classifications.TOOL_ERROR.mutually_exclusive_terminal_tasks}，POLICY_BLOCKED=${classifications.POLICY_BLOCKED.mutually_exclusive_terminal_tasks}\n- transport retry=${totals.transport_retries}；output recovery=${totals.output_recovery_attempts}；二者均不计 semantic repair。\n- \`full_os_isolation_verified=false\`；\`counterexample_feedback=NOT_IMPLEMENTED\`。\n\n## Baseline FAIL 终态与证据\n\n| 任务 | Baseline | 最终原因 | Eligible | Edit | Reverify | Recovered | 对照记录 |\n|---|---|---|---:|---:|---:|---:|---|\n${failedLines}\n\n## 未形成 Baseline\n\n| 任务 | 生成终态 | 最终原因 | Provider dispatch | Transport retry | 生成记录 |\n|---|---|---|---:|---:|---|\n${notRunLines}\n\n## 审计问题\n\n${issues.length ? issues.map(value => `- ${value}`).join('\n') : '- 无。'}\n`)
const perTask = []
for (const row of rows) {
  const generation = row.evidence?.generation && await exists(row.evidence.generation) ? await json(row.evidence.generation) : null
  const comparison = row.evidence?.comparison && await exists(row.evidence.comparison) ? await json(row.evidence.comparison) : null
  perTask.push({ task_id: row.task_id, terminal_reason: row.terminal_reason,
    trajectory: [row.evidence?.generation, row.evidence?.comparison].filter(Boolean),
    actions: (comparison?.actions ?? []).map((value, index) => ({ ...value, record: join(dirname(row.evidence.comparison), `action-${index + 1}.json`) })),
    revisions: comparison?.revisions ?? [], model_runs: [...(generation?.model_runs ?? []), ...(comparison?.model_runs ?? [])],
    vivado_results: (comparison?.verification_runs ?? []).map(value => join(value, 'result.json')), selected_skills: row.selected_skills ?? [] })
}
await writeFile(join(reportRoot, 'trajectory-evidence-index.json'), JSON.stringify({ per_task: perTask, models: evidenceModels, vivado_runs: evidenceRuns, repair_attempts: attempts, classifications: events }, null, 2) + '\n')
process.stdout.write(JSON.stringify({ comparison_status: comparisonStatus, totals, funnel, classifications, report: reportRoot }, null, 2) + '\n')
if (hardIssues.length) process.exitCode = 1
