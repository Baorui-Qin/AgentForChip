import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = process.argv[2]
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const audit = await json(join(root, 'report/evidence-audit.json'))
const calls = (await readFile(join(root, 'analysis/calls.jsonl'), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse)
const toolEvents = (await readFile(join(root, 'analysis/tool-traces.jsonl'), 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse)
const exclusions = await json(join(root, 'calibration-exclusions.json'))
assert.equal(audit.summary.selected, 100)
function responseFailure(call) {
  if (call.transcript.provider_finish_kind === 'max-tokens') return call.output.length === 0 && !call.chunks.some(e => e.chunk.type === 'tool-call-delta') ? 'PROVIDER_TOKEN_LIMIT_REASONING_ONLY' : 'PROVIDER_TOKEN_LIMIT_PARTIAL_ANSWER'
  if (['OUTPUT_TRUNCATED', 'truncated'].includes(call.transcript.error)) return call.model.truncation_reason === 'response_bytes' || call.transport.response_bytes > (call.phase === 'generation' ? 65536 : 262144) ? 'LOCAL_RESPONSE_BYTE_LIMIT' : 'OTHER_OUTPUT_TRUNCATION'
  if (call.transport.http_status === 400) return 'HTTP_400_INVALID_REQUEST'
  if (call.transcript.error?.toUpperCase() === 'TIMEOUT') return 'REQUEST_TIMEOUT'
  return call.transcript.error ?? 'COMPLETE_RESPONSE'
}
const frequency = values => Object.fromEntries([...new Set(values)].sort().map(value => [value, values.filter(item => item === value).length]))
const generationFailures = audit.rows.filter(row => !['GENERATED_UNVERIFIED', 'EVALUATOR_BLOCKED', 'NOT_RUN'].includes(row.generation_status)).map(row => {
  const selected = calls.filter(call => call.task_id === row.task_id && call.phase === 'generation')
  return { task_id: row.task_id, status: row.generation_status, candidate_rejection: row.candidate_rejection,
    primary_category: row.candidate_rejection?.code ?? (selected.length ? responseFailure(selected.at(-1)) : row.generation_status),
    attempts: row.generation_attempts,
    calls: selected.map(call => ({ directory: call.directory, sequence: call.sequence, category: responseFailure(call),
      http_status: call.transport.http_status, finish: call.transcript.provider_finish_kind,
      reasoning_bytes: call.transcript.files['reasoning.txt'].bytes, output_bytes: call.transcript.files['output.txt'].bytes,
      completion_tokens: call.model.usage?.completion_tokens ?? call.model.completion_tokens ?? null,
      partial_tool_chunks: call.chunks.filter(event => event.chunk.type === 'tool-call-delta').length,
      request_wall_ms: call.model.timing?.request_wall_ms ?? call.model.request_wall_ms })) }
})
const repairCases = audit.rows.filter(row => row.baseline_status !== 'NOT_RUN' && row.baseline_status !== 'PASS' || row.baseline_status === 'PASS' && row.agent_status !== 'VERIFIED').map(row => ({
  task_id: row.task_id, baseline_status: row.baseline_status, agent_status: row.agent_status,
  repair_eligible: row.repair_eligible, repair_requested: row.repair_requested, edit_accepted: row.edit_accepted, reverified: row.reverified,
  recovered: row.recovered_by_agent, semantic_repairs: row.semantic_repairs,
  blocked_rules: row.policy_decisions.filter(decision => decision.action === 'blocked'),
  calls: calls.filter(call => call.task_id === row.task_id && call.phase === 'agent').map(call => ({
    directory: call.directory, sequence: call.sequence, mode: call.repair_mode, category: responseFailure(call),
    reasoning_bytes: call.transcript.files['reasoning.txt'].bytes, output_bytes: call.transcript.files['output.txt'].bytes,
    returned_tools: call.model.message?.content.filter(block => block.type === 'tool-call').map(block => block.name) ?? [],
    contains_waveform_feedback: call.simulation_feedback?.waveform.status === 'available' })),
  tools: toolEvents.filter(event => event.task_id === row.task_id && event.event === 'agent_tool'),
  verification_runs: row.verification_runs, revision_decisions: row.revision_decisions, best_score: row.best_score,
  final_verification_run: row.final_verification_run,
}))
const calibrationFailures = exclusions.map(row => ({ task_id: row.task_id, reason: row.reason, category: row.category,
  positive_status: row.positive?.status ?? null, negative_status: row.negative?.status ?? null,
  positive_run: row.positive?.run ?? null, negative_run: row.negative?.run ?? null,
  positive_stages: row.positive?.stages.map(stage => ({ stage: stage.stage, status: stage.status, errors: stage.errors, evidence: stage.evidence })) ?? [],
  negative_stages: row.negative?.stages.map(stage => ({ stage: stage.stage, status: stage.status, errors: stage.errors, evidence: stage.evidence })) ?? [],
}))
const s = audit.summary
const discordant = s.paired_gain + s.paired_loss
let probability = 1
if (discordant) {
  let term = 2 ** -discordant, tail = term
  for (let k = 1; k <= Math.min(s.paired_gain, s.paired_loss); k++) { term *= (discordant - k + 1) / k; tail += term }
  probability = Math.min(1, 2 * tail)
}
const analysis = { generated_at: new Date().toISOString(), paired: { retained_pass: s.retained_pass, gain: s.paired_gain, loss: s.paired_loss,
  net_percentage_points_on_100: s.paired_gain - s.paired_loss, discordant_pairs: discordant, exact_mcnemar_two_sided_p: probability,
  caution: 'Descriptive paired comparison on a calibration-filtered, partly retained development set; not a random population sample or a cross-campaign causal estimate.' },
  funnel: { selected: 100, candidates: s.candidates, baseline_failed: s.baseline_failed, repair_eligible: s.natural_repair_opportunities,
    repair_requested: s.repair_requested_tasks, accepted_edit: s.accepted_edit_tasks, reverified: s.reverified_tasks, recovered: s.repaired },
  generation_failure_counts: frequency(generationFailures.map(row => row.primary_category)),
  incomplete_response_counts: frequency(calls.filter(call => !call.transcript.response_complete).map(responseFailure)),
  rejected_tool_counts: frequency(toolEvents.filter(event => event.event === 'agent_tool' && !event.host_accepted).map(event => event.rejection_reason)),
  generation_failures: generationFailures, repair_cases: repairCases, calibration_exclusions: calibrationFailures }
await writeFile(join(root, 'report/failure-analysis.json'), JSON.stringify(analysis, null, 2))
console.log(JSON.stringify({ paired: analysis.paired, funnel: analysis.funnel, generation_failure_counts: analysis.generation_failure_counts,
  incomplete_response_counts: analysis.incomplete_response_counts, rejected_tool_counts: analysis.rejected_tool_counts,
  generation_failed_tasks: generationFailures.map(row => row.task_id), repair_cases: repairCases.map(row => ({ task_id: row.task_id, final: row.agent_status, repairs: row.semantic_repairs, calls: row.calls.length })) }, null, 2))
