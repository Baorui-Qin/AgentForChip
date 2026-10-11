/** Evaluator-only P10 reporting, without synthetic model scores. @module rtl-tools/phase1/p10-report */
import { publish } from './candidates.ts'
import type { VerificationResult } from './verification.ts'
import type { AttributedDiagnostic } from './attribution.ts'

/** Compatibility observations are not DUT model failures. */
export type PreflightStatus = 'EVALUATOR_READY' | 'TESTBENCH_COMPATIBILITY_BLOCKED' | 'REFERENCE_COMPATIBILITY_BLOCKED' | 'TOOL_ENVIRONMENT_BLOCKED' | 'INCONCLUSIVE'
/** One current-campaign preflight, including explicit absence of generation. */
export interface P10Preflight {
  campaign_id: string; task_id: string; manifest_index: number | null; status: PreflightStatus; reason: string
  verification_run: string | null; verification_key: string | null; wrapper_sha256: string | null
  stages: Record<string, string>; blocked_stage: string | null; diagnostics: AttributedDiagnostic[]
  eda_wall_ms: number; processes_joined: boolean; model_requests: 0
}

/** Classify observed origins without treating every EDA failure as benchmark incompatibility. @param result - host preflight evidence. @returns status and blocked stage. */
export function classifyPreflight(result: VerificationResult): { status: PreflightStatus; blocked_stage: string | null } {
  const stages = result.stages.slice(0, 3), failure = stages.find(s => s.status !== 'PASS')
  const sim = stages[2]
  if (!failure && result.status === 'EVALUATOR_READY' && sim?.evidence.test_completed && (sim.evidence.checks_executed ?? 0) > 0 && sim.evidence.mismatch_count === 0 && result.stages[3]?.status === 'SKIPPED') return { status: 'EVALUATOR_READY', blocked_stage: null }
  if (!failure) return { status: 'INCONCLUSIVE', blocked_stage: 'simulation' }
  const base = { blocked_stage: failure.stage }
  if (failure.diagnostic_excerpt_truncated || failure.diagnostics_omitted > 0) return { ...base, status: 'INCONCLUSIVE' }
  if (failure.status === 'TIMEOUT' || failure.processes.some(p => p.timed_out || p.cancelled || p.signal || p.log_truncated)) return { ...base, status: 'TOOL_ENVIRONMENT_BLOCKED' }
  const errors = failure.errors as AttributedDiagnostic[]
  if (errors.some(e => e.origin === 'tool' || e.origin === 'harness')) return { ...base, status: 'TOOL_ENVIRONMENT_BLOCKED' }
  if (errors.some(e => e.origin === 'testbench') && !errors.some(e => e.origin === 'reference' || e.origin === 'dut')) return { ...base, status: 'TESTBENCH_COMPATIBILITY_BLOCKED' }
  if (errors.some(e => e.origin === 'reference') && !errors.some(e => e.origin === 'testbench' || e.origin === 'dut')) return { ...base, status: 'REFERENCE_COMPATIBILITY_BLOCKED' }
  return { ...base, status: 'INCONCLUSIVE' }
}

function csv(rows: Record<string, unknown>[], columns: string[]): string {
  const field = (value: unknown) => value === null || value === undefined ? '' : '"' + String(value).replace(/"/g, '""') + '"'
  return columns.join(',') + '\n' + rows.map(row => columns.map(c => field(row[c])).join(',')).join('\n') + (rows.length ? '\n' : '')
}
/** Build only preflight metrics; absent model experiments have null rates even when evaluators are ready. @param rows - selected tasks, excluding the sentinel. @returns explicit zero dispatches and unavailable model comparisons. */
export function preflightMetrics(rows: P10Preflight[]) {
  return { selected_task_count: rows.length, evaluator_ready_count: rows.filter(r => r.status === 'EVALUATOR_READY').length,
    evaluator_blocked_count: rows.filter(r => r.status.endsWith('_BLOCKED')).length, evaluator_inconclusive_count: rows.filter(r => r.status === 'INCONCLUSIVE').length,
    model_evaluation_status: 'NOT_RUN', baseline_verified_count: 0, baseline_pass_rate_on_evaluable: null,
    agent_initial_verified_count: 0, agent_initial_pass_rate: null, agent_final_verified_count: 0, agent_final_pass_rate: null,
    recovered_task_count: 0, generation_recovery_success_count: 0, repair_gain_absolute: null, repair_gain_percentage_points: null, repair_success_rate: null,
    average_semantic_repairs: null, median_semantic_repairs: null, average_model_requests: null,
    model_requests_total: 0, provider_dispatches: 0, transport_retries: 0, output_recovery_attempts: 0, semantic_repairs: 0,
    total_prompt_tokens: 0, total_completion_tokens: 0, unknown_usage_requests: 0, baseline_model_tokens: 0, agent_extra_model_tokens: 0,
    baseline_wall_ms: null, agent_wall_ms: null, model_wall_ms: 0, candidate_eda_wall_ms: 0, preflight_eda_wall_ms: rows.reduce((n, r) => n + r.eda_wall_ms, 0) }
}

/** Publish complete blocked-run deliverables without inventing Baseline/Agent trajectories. @param directory - pilot output. @param revision - frozen dataset. @param rows - exactly the selected tasks. @param sentinel - separately identified compatibility probe. @param wallMs - campaign observation time. @returns NO-GO or explicit need for model-phase implementation. */
export async function reportP10Preflight(directory: string, revision: string, rows: P10Preflight[], sentinel: P10Preflight, wallMs: number, vivadoVersion: string) {
  if (rows.length !== 10 || new Set(rows.map(r => r.task_id)).size !== 10 || rows.some((r, i) => r.manifest_index !== i + 1 || r.model_requests !== 0)) throw new Error('P10_TASK_ACCOUNTING_INVALID')
  const metrics = preflightMetrics(rows)
  const write = (name: string, value: unknown) => publish(directory, name, JSON.stringify(value, null, 2) + '\n')
  const resultRows = rows.map(row => ({ task_id: row.task_id, manifest_index: row.manifest_index, dataset_revision: revision,
    preflight_status: row.status, preflight_failure_category: row.status === 'EVALUATOR_READY' ? null : row.status,
    baseline_status: 'NOT_RUN', baseline_compile: 'NOT_RUN', baseline_elaborate: 'NOT_RUN', baseline_simulation: 'NOT_RUN', baseline_synthesis: 'NOT_RUN',
    baseline_source_sha256: null, baseline_model_requests: 0, baseline_prompt_tokens: null, baseline_completion_tokens: null, baseline_wall_ms: null,
    agent_initial_status: 'NOT_RUN', agent_initial_source_sha256: null, agent_final_status: 'NOT_RUN', agent_compile: 'NOT_RUN', agent_elaborate: 'NOT_RUN', agent_simulation: 'NOT_RUN', agent_synthesis: 'NOT_RUN',
    agent_final_source_sha256: null, semantic_repairs: 0, transport_retries: 0, output_recoveries: 0, agent_model_requests: 0,
    agent_prompt_tokens: null, agent_completion_tokens: null, agent_model_wall_ms: null, agent_eda_wall_ms: null, agent_total_wall_ms: null,
    terminal_reason: row.status === 'EVALUATOR_READY' ? 'MODEL_PHASE_NOT_RUN' : row.status === 'INCONCLUSIVE' ? 'INCONCLUSIVE' : 'EVALUATOR_BLOCKED',
    recovered_by_agent: false, final_verified: false, shared_initial_candidate: null, preflight_eda_wall_ms: row.eda_wall_ms, preflight_artifacts: row.verification_run }))
  const decision = { schema_version: 'p10-preflight-1', recommendation: 'NO_GO', status: 'P10_10_NEEDS_FIX',
    reason: metrics.evaluator_ready_count === 0 ? 'NO_EVALUABLE_TASKS' : 'MODEL_PHASE_NOT_RUN',
    ready_to_implement_model_phase: metrics.evaluator_ready_count > 0, model_comparison_audit: 'NOT_RUN',
    selected: 10, ready: metrics.evaluator_ready_count, blocked: metrics.evaluator_blocked_count, inconclusive: metrics.evaluator_inconclusive_count,
    model_requests: 0, main_40: 'NOT_RUN', automatic_40_allowed: false }
  await write('p10-results-10.json', { schema_version: 'p10-preflight-1', metrics, wall_ms: wallMs, rows: resultRows })
  await publish(directory, 'p10-results-10.csv', csv(resultRows, Object.keys(resultRows[0]!)))
  const compatibility = [...rows, sentinel].flatMap(row => row.diagnostics.map(d => ({ task_id: row.task_id, selected: row.manifest_index !== null,
    blocked_stage: row.blocked_stage, origin: d.origin, message_id: d.message_id, message: d.message, asset: d.file,
    vivado_version: vivadoVersion, status: row.status, artifacts: row.verification_run })))
  await publish(directory, 'p10-benchmark-compatibility-10.csv', csv(compatibility, ['task_id', 'selected', 'blocked_stage', 'origin', 'message_id', 'message', 'asset', 'vivado_version', 'status', 'artifacts']))
  const distribution = [...new Set(rows.map(r => r.status))].map(category => ({ category, count: rows.filter(r => r.status === category).length, origin: 'evaluator_preflight', model_failure: false }))
  await publish(directory, 'p10-failure-distribution-10.csv', csv(distribution, ['category', 'count', 'origin', 'model_failure']))
  await write('trajectory-index.json', { tasks: rows.map(r => ({ task_id: r.task_id, preflight: r.verification_run, initial_generation: null, baseline_result: null,
    agent_revisions: [], model_requests: [], structured_feedback: [], vivado_logs: r.verification_run, final_result: `tasks/${r.task_id}/preflight.json` })), sentinel })
  await write('p10-go-no-go.json', decision)
  await publish(directory, 'p10-baseline-vs-agent-10.md', `# P10 10-task evaluator preflight\n\nSelected: 10. Ready: ${metrics.evaluator_ready_count}. Blocked: ${metrics.evaluator_blocked_count}. Inconclusive: ${metrics.evaluator_inconclusive_count}.\n\nBaseline and Agent were NOT_RUN. Model pass rates, repair gains and model-route times are unavailable, not zero-percent accuracy. Provider dispatches: 0. Preflight time: ${metrics.preflight_eda_wall_ms} ms. Campaign observation: ${wallMs} ms.\n\n| Task | Preflight | Baseline | Agent Initial | Agent Final | Repairs |\n| --- | --- | --- | --- | --- | --- |\n${rows.map(r => `| ${r.task_id} | ${r.status} | NOT_RUN | NOT_RUN | NOT_RUN | 0 |`).join('\n')}\n\nDecision: NO_GO (${decision.reason}). The independent 40-task campaign is NOT_RUN. Prob038 is a separate sentinel, excluded from scores: ${sentinel.status}. No evaluator assets or candidate answers were changed.\n`)
  return decision
}
