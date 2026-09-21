/** Opt-in finite repair protocol. No retry or proposal grants execution authority. @module rtl-tools/phase1/repair-loop */
import type { ModelObservation } from './model.ts'
import type { ModelRecord } from './records.ts'
import type { DiagnosticReceipt } from './repair-diagnostics.ts'
import type { RepairDecision } from './repair-policy.ts'
import { sha256 } from './snapshots.ts'

/** Trusted deployment budgets, frozen per experiment. */
export interface RepairLoopSettings { maxSemanticRepairs: number; maxTransportRetries: number; transportBackoffMs: number[]; maxRepeatedDiagnostic: number }
/** One dispatched or preparation-failed attempt, never a semantic round by itself. */
export interface RepairTransportAttempt {
  transport_attempt: number; directory: string; prompt_sha256: string; request_sha256: string | null
  retry_eligible: boolean; backoff_ms: number; observation: ModelObservation | null
  error_category: string | null; error_layer: 'MODEL_TRANSPORT_ERROR' | 'MODEL_RESPONSE_ERROR' | null
}
/** One feedback-bound semantic proposal and all of its transport attempts. */
export interface RepairRound {
  semantic_repair_round: number; prompt_current_source_sha256: string; current_revision_id: string
  feedback_sha256: string; prompt_sha256: string; primary_signature: string
  new_revision_id: string | null; verification_run: string | null; outcome: string
  transport: RepairTransportAttempt[]
}
/** Successor-only state; legacy experiments retain their original fields and budgets. */
export interface RepairLoopState {
  purpose: 'state_machine_acceptance' | 'synthesis_repair_completion' | 'repair_regression'
  initial_generation: 0; initial_revision_id: string | null; source_history: string[]; diagnostic_history: string[]; rounds: RepairRound[]
}
/** Retry only before any text/reasoning is observed. A partial answer never becomes a hidden resample. @param record - terminal provider call. @param facts - safe transport observations. @returns conservative retry permission, not a dispatch. */
export function retryableTransport(record: ModelRecord, facts: ModelObservation | null): boolean {
  if (!record.dispatched || !facts || facts.phase !== 'stream' || facts.response_bytes !== 0 || record.content.length || record.truncated || !record.error) return false
  return ['connection', 'timeout'].includes(record.error.category) || record.error.category === 'service' && [502, 503, 504].includes(facts.http_status ?? 0)
}
/** Build bounded current feedback and choose the primary before consequential summaries. @param facts - newly verified evidence. @param decision - host policy result. @param maxDiagnostics - per-stage cap. @param maxLineChars - message cap. @returns feedback and a stable repeated-error signature. */
export function repairFeedback(facts: DiagnosticReceipt, decision: RepairDecision, maxDiagnostics: number, maxLineChars: number) {
  const stages = facts.stages.map(stage => ({ ...stage, diagnostics: stage.diagnostics.slice(0, maxDiagnostics).map(d => ({ ...d, file: d.origin === 'dut' ? 'rtl/solution.sv' : null, message: d.message.slice(0, maxLineChars) })) }))
  const failed = stages.find(stage => stage.status !== 'PASS')
  const errors = failed?.diagnostics.filter(d => d.severity === 'ERROR') ?? []
  const primary = errors.find(d => d.kind !== 'consequential') ?? errors[0] ?? null
  const feedback = { stage: failed?.stage ?? null, status: failed ? 'failed' : 'passed', failure_domain: decision.action === 'propose_repair' ? 'design' : null,
    primary_error: primary, decision, stages }
  return { feedback, signature: sha256(JSON.stringify({ stage: feedback.stage, primary })) }
}
