/** Host-only evidence summaries without changes to model-visible feedback. @module rtl-tools/phase1/p10-trace */
import { appendFile } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from './snapshots.ts'
import type { DiagnosticReceipt } from './repair-diagnostics.ts'
import type { RunRecord } from './records.ts'

/** Hash JSON with recursively sorted object keys; array ordering remains significant. @param value - JSON data. @returns canonical SHA-256. */
export function evidenceHash(value: unknown): string {
  const canonical = (data: unknown): unknown => Array.isArray(data) ? data.map(canonical)
    : data && typeof data === 'object' ? Object.fromEntries(Object.entries(data).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, item]) => [key, canonical(item)])) : data
  return sha256(JSON.stringify(canonical(value)))
}

/** Append one completed Host observation in execution order. @param root - task directory. @param value - bounded event facts. */
export async function appendToolTrace(root: string, value: Record<string, unknown>): Promise<void> {
  await appendFile(join(root, 'tool-trace.jsonl'), JSON.stringify({ schema_version: 'p10-tool-trace-1', ...value }) + '\n', { mode: 0o600 })
}

/** Derive execution from non-version process invocations, never from a tool name alone. @param facts - newly read verification evidence. @returns stage and log bindings. */
export function verificationEvidence(facts: { record: RunRecord; receipt: DiagnosticReceipt }) {
  const stages = Object.fromEntries(['compile', 'elaborate', 'simulation', 'synthesis'].map(name => {
    const stage = facts.record.stages[name as keyof RunRecord['stages']]
    const invocations = stage?.invocations?.filter(item => item.version_matches === null) ?? []
    return [name, { status: stage?.status ?? 'NOT_RUN', executed: invocations.length > 0,
      invocations: invocations.map(item => ({ label: item.label, argv: item.argv, process: item.process, stdout_log: item.stdout_log, stderr_log: item.stderr_log })) }]
  }))
  const simulation = facts.receipt.stages.find(stage => stage.stage === 'simulation')
  const simulationLogs = facts.record.stages.simulation?.invocations?.filter(item => item.version_matches === null).flatMap(item => [item.stdout_log, item.stderr_log]) ?? []
  return { verification_run_id: facts.receipt.original_run, result_sha256: facts.receipt.result_sha256,
    feedback_sha256: evidenceHash(facts.receipt), final_status: facts.record.final_status,
    xvlog_executed: stages.compile!.executed, xelab_executed: stages.elaborate!.executed,
    xsim_executed: stages.simulation!.executed, synthesis_executed: stages.synthesis!.executed, stages,
    checks: simulation?.verdict.checks ?? null, mismatches: simulation?.verdict.mismatches ?? null,
    simulation_completed: simulation?.verdict.completed ?? false,
    simulation_logs: facts.receipt.inputs.filter(item => simulationLogs.includes(item.path)) }
}
