/** Project already-parsed facts; no raw-log inference or invented cycle semantics. @module rtl-tools/knowledge/diagnostic-features */
import type { DiagnosticReceipt, RepairStage } from '../phase1/repair-diagnostics.ts'

/** Retains diagnostic correlations so a kind and message ID cannot match different errors. */
export interface DiagnosticFeatures {
  tool: string; toolVersion: string; stage: string | null; features: string[]
  diagnostics: { kind: string; messageId: string | null; severity: string; origin: string; file: string | null; line: number | null }[]
  mismatchCount: number | null; firstFailureTime: number | null; signals: string[]
}
/** Choose the first blocking non-skipped stage, preserving parser facts only. @param receipt - parser receipt or no observation. @param toolVersion - observed/pinned tool version. @returns stable query with no raw logs. */
export function diagnosticFeatures(receipt: DiagnosticReceipt | null, toolVersion: string): DiagnosticFeatures {
  return stageFeatures(receipt?.stages.find(s => s.status !== 'PASS' && s.status !== 'SKIPPED') ?? null, toolVersion)
}
/** Map one parser stage for tests, replay and runtime. @param stage - existing parsed stage. @param toolVersion - verified environment identity. @returns normalized facts. */
export function stageFeatures(stage: RepairStage | null, toolVersion: string): DiagnosticFeatures {
  const feedback = stage?.simulation_feedback
  const features = [stage?.complete && 'complete_evidence', stage?.diagnostics.some(d => d.origin === 'dut') && 'dut_attributed',
    stage?.functional_failure && 'functional_failure', feedback?.waveform.status === 'available' && 'waveform_available',
    feedback?.first_failure_time != null && 'first_failure_time', !!feedback?.outputs.length && 'mismatch_signal'].filter((f): f is string => typeof f === 'string').sort()
  const diagnostics = (stage?.diagnostics ?? []).map(d => ({
    kind: d.kind === 'multiple_drivers' && d.message_id === 'VRFC 10-3818' && d.origin === 'dut' ? 'multiple_procedural_driver' : d.kind,
    messageId: d.message_id, severity: d.severity, origin: d.origin, file: d.file, line: d.line,
  }))
  diagnostics.sort((a, b) => { const x = JSON.stringify(a), y = JSON.stringify(b); return x < y ? -1 : x > y ? 1 : 0 })
  return { tool: 'vivado', toolVersion, stage: stage?.stage ?? null, features, diagnostics,
    mismatchCount: stage?.verdict.mismatches ?? null, firstFailureTime: feedback?.first_failure_time ?? null, signals: [...new Set(feedback?.outputs.map(o => o.signal) ?? [])].sort() }
}
