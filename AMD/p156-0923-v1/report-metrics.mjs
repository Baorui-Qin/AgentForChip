import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const root = process.argv[2];
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const audit = await json(join(root, 'report', 'evidence-audit.json'));
const calls = await json(join(root, 'report', 'call-index.json'));
const countBy = (rows, key) => rows.reduce((out, row) => { const k = key(row); out[k] = (out[k] ?? 0) + 1; return out; }, {});
const invocations = [], actions = [], cases = [], timeouts = [];
for (const row of audit.rows.filter(row => row.baseline_status !== 'NOT_RUN')) {
  const directory = join(root, `compare-${row.task_id}`), result = await json(join(directory, 'result.json'));
  const trace = (await readFile(join(directory, 'tool-trace.jsonl'), 'utf8')).trim().split(/\r?\n/).map(JSON.parse);
  for (const event of trace.filter(event => event.event === 'verification')) {
    for (const stage of Object.values(event.stages)) for (const invocation of stage.invocations) invocations.push({ task: row.task_id, ...invocation });
  }
  actions.push(...result.actions);
  if (result.initial_status !== 'PASS') cases.push({ task: row.task_id, status: result.status,
    modifications: result.semantic_repairs, physical_calls: result.physical_dispatches, logical_requests: result.logical_agent_requests,
    transport_retries: result.transport_retries, forced_recoveries: result.output_recovery_attempts,
    prompt_tokens: result.prompt_tokens, completion_tokens: result.completion_tokens, model_wall_ms: result.model_wall_ms,
    tool_actions: result.actions.length, rejections: countBy(result.actions.filter(action => !action.accepted), action => action.observation.error),
    verification: row.verification_details.map(detail => ({ status: detail.status, checks: detail.checks, mismatches: detail.mismatches })) });
}
for (const call of calls.filter(call => call.model_status === 'TIMEOUT')) {
  const model = await json(join(call.directory, 'model.json'));
  timeouts.push({ task: call.task_id, directory: call.directory, model_status: call.model_status, phase: call.phase,
    transport: call.transport, retryable: model.retryable, request_wall_ms: model.request_wall_ms,
    reasoning_bytes: call.transcript.files['reasoning.txt'].bytes, output_bytes: call.transcript.files['output.txt'].bytes });
}
const labels = [...new Set(invocations.map(i => i.label))];
const stage_timings = Object.fromEntries(labels.map(label => {
  const rows = invocations.filter(i => i.label === label), ms = rows.map(i => i.process.duration_ms).sort((a, b) => a - b);
  return [label, { count: rows.length, median_ms: ms[Math.floor(ms.length / 2)], p95_ms: ms[Math.ceil(ms.length * .95) - 1], max_ms: ms.at(-1),
    timed_out: rows.filter(i => i.process.timed_out).length, cancelled: rows.filter(i => i.process.cancelled).length,
    truncated: rows.filter(i => i.process.log_truncated).length }];
}));
const rows = audit.rows.filter(row => row.baseline_status !== 'NOT_RUN');
const strict = rows.filter(row => row.generation_attempts[0]?.candidate_valid);
const screened = rows.filter(row => !['Prob078_dualedge', 'Prob093_ece241_2014_q3', 'Prob149_ece241_2013_q4'].includes(row.task_id));
const data = { frozen_results: audit.summary, stage_timings, cases, model_timeouts: timeouts,
  action_counts: countBy(actions, action => action.tool), rejection_counts: countBy(actions.filter(a => !a.accepted), a => a.observation.error),
  first_call_generation_legal_calibrated: strict.length, first_call_baseline_pass: strict.filter(r => r.baseline_status === 'PASS').length,
  posthoc_screened: { label: 'Sensitivity analysis only; not a new preregistered benchmark or proof that all other tasks are sound.',
    excluded: ['Prob078_dualedge', 'Prob093_ece241_2014_q3', 'Prob149_ece241_2013_q4'], denominator: screened.length,
    baseline_pass: screened.filter(r => r.baseline_status === 'PASS').length, agent_pass: screened.filter(r => r.agent_status === 'VERIFIED').length } };
await writeFile(join(root, 'report', 'metrics.json'), JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify(data, null, 2));
