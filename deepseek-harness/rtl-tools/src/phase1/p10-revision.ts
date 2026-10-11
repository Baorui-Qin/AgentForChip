/** Evidence ordering for revisions evaluated against one frozen P10 test suite. @module rtl-tools/phase1/p10-revision */
import type { DiagnosticReceipt } from './repair-diagnostics.ts'
import { multipleDriverFailure } from './repair-policy.ts'

/** Lower ranks are stronger evidence; ratios are comparable only at the same stage and sample count. */
export interface RevisionScore { rank: number; checks: number | null; mismatches: number | null }
/** Score complete design observations, never infrastructure or missing evidence. @param receipt - bound verification receipt. @param verified - host final verdict. @returns comparable evidence or null. */
export function revisionScore(receipt: DiagnosticReceipt, verified: boolean): RevisionScore | null {
  const stages = ['compile', 'elaborate', 'simulation', 'synthesis']
  if (receipt.evidence_kind !== 'live_verification' || receipt.stages.map(s => s.stage).join(',') !== stages.join(',') ||
    receipt.stages.some(s => s.status === 'PASS' && (!s.complete || !s.process_clean || s.diagnostics.some(d => d.severity === 'ERROR')))) return null
  if (verified) return receipt.stages.every(s => s.status === 'PASS') ? { rank: 0, checks: null, mismatches: null } : null
  const failed = receipt.stages.find(s => s.status !== 'PASS')
  if (!failed || !failed.complete || !failed.process_normal || !['FAIL', 'INCONCLUSIVE'].includes(failed.status)) return null
  if (failed.stage === 'simulation') return failed.functional_failure && failed.verdict.completed
    ? { rank: 2, checks: failed.verdict.checks, mismatches: failed.verdict.mismatches } : null
  if (failed.diagnostics.some(d => d.severity === 'ERROR' && (d.kind === 'multiple_drivers' || d.message_id === 'VRFC 10-3818' || d.message_id === 'XSIM 43-3322'))) {
    return multipleDriverFailure(failed) ? { rank: 4, checks: null, mismatches: null } : null
  }
  if (!failed.diagnostics.some(d => d.severity === 'ERROR' && d.origin === 'dut' && d.repairable_by_model) ||
    failed.diagnostics.some(d => d.severity === 'ERROR' && d.kind !== 'consequential' && (d.origin !== 'dut' || !d.repairable_by_model))) return null
  const index = stages.indexOf(failed.stage)
  return index < 0 ? null : { rank: failed.stage === 'synthesis' ? 1 : 5 - index, checks: null, mismatches: null }
}
/** Compare only compatible evidence; ties resume from the best revision. @param best - incumbent score. @param next - candidate score. @returns deterministic search decision. */
export function compareRevision(best: RevisionScore | null, next: RevisionScore | null): 'IMPROVED' | 'REGRESSION' | 'NO_IMPROVEMENT' | 'INCOMPARABLE' {
  if (!next) return 'INCOMPARABLE'
  if (!best || next.rank < best.rank) return 'IMPROVED'
  if (next.rank > best.rank) return 'REGRESSION'
  if (next.rank === 2) {
    if (next.checks !== best.checks || next.checks === null || next.mismatches === null || best.mismatches === null) return 'INCOMPARABLE'
    if (next.mismatches < best.mismatches) return 'IMPROVED'
    if (next.mismatches > best.mismatches) return 'REGRESSION'
  }
  return 'NO_IMPROVEMENT'
}
