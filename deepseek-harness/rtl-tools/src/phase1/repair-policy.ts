/** Host proposal policy, deliberately independent of parsing and execution approval. @module rtl-tools/phase1/repair-policy */
import { isAbsolute, resolve } from 'node:path'
import type { DiagnosticReceipt, RepairStage } from './repair-diagnostics.ts'

function currentDutFile(file: string, binding: RepairStage['dut_source']): boolean {
  if (!binding || typeof binding.path !== 'string' || typeof binding.cwd !== 'string' ||
    !isAbsolute(binding.path) || !isAbsolute(binding.cwd)) return false
  const key = (path: string) => {
    const normalized = resolve(path).replace(/\\/g, '/')
    return process.platform === 'win32' ? normalized.toLowerCase() : normalized
  }
  return key(isAbsolute(file) ? file : resolve(binding.cwd, file)) === key(binding.path)
}

/** Recognize complete DUT conflicts and only their exact same-invocation unlocated XSim summaries. Raw flags and consequential labels do not grant eligibility. @param stage - current parsed execution facts. @returns whether this elaboration failure supports a Host repair proposal and revision comparison. */
export function multipleDriverFailure(stage: RepairStage): boolean {
  if (stage.stage !== 'elaborate' || !stage.complete || !stage.process_normal || !['FAIL', 'INCONCLUSIVE'].includes(stage.status)) return false
  const errors = stage.diagnostics.filter(d => d.severity === 'ERROR')
  const primary = errors.filter(d => d.kind === 'multiple_drivers' && d.message_id === 'VRFC 10-3818' &&
    d.origin === 'dut' && d.attribution === 'DUT_COMPILE_ERROR' && typeof d.file === 'string' && d.file.trim().length > 0 &&
    currentDutFile(d.file, stage.dut_source) &&
    typeof d.invocation === 'string' && d.invocation.trim().length > 0 &&
    /^variable '[A-Za-z_$][\w$]*' is driven by invalid combination of procedural drivers$/.test(d.message))
  return primary.length > 0 && errors.every(d => primary.includes(d) || (
    d.message_id === 'XSIM 43-3322' && d.message === 'Static elaboration of top level Verilog design unit(s) in library work failed.' &&
    d.origin === 'unknown' && d.attribution === 'UNKNOWN' && d.file === null && d.line === null && primary.some(p => p.invocation === d.invocation)))
}

/** Proposals carry evidence references but never an execution permission. */
export interface RepairDecision { action: 'propose_repair' | 'stop' | 'blocked'; rule: string; reason: string; stage: string | null }
/** Decide whether to ask for a DUT proposal. @param facts - normalized current execution. @param context - host calibration/binding/budget checks. @returns immutable decision facts. */
export function decideRepair(facts: DiagnosticReceipt, context: { calibrated: boolean; bound: boolean; attempts: number; top: string; maxAttempts?: number }): RepairDecision {
  const failed = facts.stages.find(s => s.status !== 'PASS')
  const decision = (action: RepairDecision['action'], rule: string, reason: string): RepairDecision => ({ action, rule, reason, stage: failed?.stage ?? null })
  if (facts.evidence_kind !== 'live_verification' || !context.calibrated || !context.bound) return decision('blocked', 'UNTRUSTED_EVIDENCE', 'Live bound evidence and calibrated assets are required.')
  if (facts.stages.map(s => s.stage).join(',') !== 'compile,elaborate,simulation,synthesis' || facts.stages.some(s => s.status === 'PASS' && (!s.complete || !s.process_clean || s.diagnostics.some(d => d.severity === 'ERROR')))) return decision('blocked', 'EXECUTION_OR_EVIDENCE', 'All four stage records and complete clean preceding stages are required.')
  if (!failed) return decision('stop', 'VERIFIED', 'All stages passed.')
  if (context.attempts >= (context.maxAttempts ?? 2)) return decision('stop', 'REPAIR_BUDGET', context.maxAttempts === undefined ? 'Two proposal attempts consumed.' : `${context.maxAttempts} semantic proposal rounds consumed.`)
  if (!failed.complete || !failed.process_normal || !['FAIL', 'INCONCLUSIVE'].includes(failed.status)) return decision('blocked', 'EXECUTION_OR_EVIDENCE', 'Incomplete evidence or independent execution failure.')
  if (failed.functional_failure) return decision('propose_repair', 'FUNCTIONAL_MISMATCH', 'Complete calibrated mismatch evidence; source location remains unknown.')
  const errors = failed.diagnostics.filter(d => d.severity === 'ERROR')
  if (errors.some(d => d.kind === 'multiple_drivers' || d.message_id === 'VRFC 10-3818' || d.message_id === 'XSIM 43-3322')) {
    return multipleDriverFailure(failed)
      ? decision('propose_repair', 'DUT_MULTIPLE_DRIVERS', 'Observed DUT procedural drivers with only recognized same-invocation elaboration summaries.')
      : decision('blocked', 'UNCLASSIFIED_FAILURE', 'Driver evidence requires exact DUT conflict facts and same-invocation unlocated summaries.')
  }
  const primaryCompile = errors.filter(d => d.origin === 'dut' && ['syntax', 'declaration_order', 'name_resolution', 'type_or_port', 'dependency'].includes(d.kind))
  if (['compile', 'elaborate'].includes(failed.stage) && primaryCompile.length && errors.every(d => primaryCompile.includes(d) || (
    d.origin === 'dut' && d.message_id === 'VRFC 10-8530' && d.message === `module '${context.top}' is ignored due to previous errors` &&
    primaryCompile.some(primary => primary.invocation === d.invocation && primary.file !== null && primary.file === d.file)))) return decision('propose_repair', 'DUT_COMPILE', 'Observed DUT compilation failure, with only recognized same-source consequential messages.')
  if (failed.stage === 'synthesis' && errors.some(d => d.origin === 'dut' && d.message_id === 'Synth 8-439' && /^module '.+' not found$/.test(d.message))) {
    const primary = errors.find(d => d.message_id === 'Synth 8-439')!
    const accepted = errors.every(d => d.invocation === primary.invocation && (
      (d.origin === 'dut' && d.message_id === 'Synth 8-439' && /^module '.+' not found$/.test(d.message)) ||
      (d.origin === 'dut' && d.message_id === 'Synth 8-6156' && d.message === `failed synthesizing module '${context.top}'`) ||
      (d.message_id === 'Common 17-69' && d.message === 'Command failed: Synthesis failed - please see the console or run log file for details')))
    if (accepted) return decision('propose_repair', 'DUT_MISSING_SYNTHESIS_MODULE', 'Missing DUT dependency with recognized same-invocation summaries.')
  }
  if (errors.length && errors.every(d => d.kind !== 'consequential' && d.origin === 'dut' && d.repairable_by_model && ['DUT_COMPILE_ERROR', 'DUT_SYNTHESIS_ERROR'].includes(d.attribution))) {
    return decision('propose_repair', 'DUT_UNKNOWN_BUT_OWNED', 'Complete normal execution with only DUT-owned errors; the message kind need not be pre-enumerated.')
  }
  return decision('blocked', 'UNCLASSIFIED_FAILURE', 'Evaluator, unknown, or unsupported failure requires host investigation.')
}
