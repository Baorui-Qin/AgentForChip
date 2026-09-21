import assert from 'node:assert/strict'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { evidenceHash } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-trace.ts'

const root = process.argv[2]
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const freeze = await json(join(root, 'campaign-freeze.json'))
for (const [path, digest] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), digest, `freeze:${path}`)
const tasks = (await json(join(root, 'p10-manifest-10.json'))).task_ids
const acquisition = []
for (const task of tasks) {
  const directory = join(root, `generate-${task}`), generation = await json(join(directory, 'result.json'))
  assert.equal(generation.status, 'GENERATED_UNVERIFIED')
  assert.equal(hash(await readFile(join(directory, 'initial.sv'))), generation.source_sha256)
  assert.equal(generation.logical_initial_requests, 1)
  const successful = generation.generation_attempts.filter(item => item.candidate_valid)
  assert.equal(successful.length, 1)
  const model = await json(join(successful[0].model_run, 'model.json'))
  assert.equal(model.error, null); assert.equal(model.finish_reason, 'stop'); assert.equal(model.truncated, false)
  const transport = await json(join(successful[0].model_run, 'transport.json'))
  assert.equal(transport.model_response_complete, true); assert.equal(transport.http_status, 200)
  assert.equal(transport.model_output_observed, true); assert.equal(transport.usage_received, true)
  acquisition.push({ task, physical_attempts: generation.physical_dispatches, retries: generation.transport_retries, source_sha256: generation.source_sha256, transport })
}
const trajectories = []
for (const directory of (await readdir(root)).filter(name => name.startsWith('compare-') || name.startsWith('repair-control-'))) {
  const target = join(root, directory), result = await json(join(target, 'result.json'))
  const trace = (await readFile(join(target, 'tool-trace.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse)
  const receipts = new Map()
  const verifications = trace.filter(event => event.event === 'verification')
  if (directory.startsWith('compare-')) {
    const initial = acquisition.find(item => item.task === result.task_id)
    assert.ok(initial); assert.equal(result.shared_initial, true)
    assert.equal(result.shared_initial_sha256, initial.source_sha256)
    assert.equal(verifications[0].source_sha256, initial.source_sha256)
    assert.equal(result.initial_generation_charged_again, false)
  }
  for (const [index, event] of verifications.entries()) {
    const bytes = await readFile(join(event.verification_run_id, 'result.json'))
    assert.equal(hash(bytes), event.result_sha256)
    const record = JSON.parse(bytes), receipt = await json(join(target, `feedback-${index + 1}.json`))
    assert.equal(evidenceHash(receipt), event.feedback_sha256)
    assert.equal(record.final_source_sha256, event.source_sha256)
    assert.equal(event.checks, record.stages.simulation?.evidence.checks_executed ?? null)
    assert.equal(event.mismatches, record.stages.simulation?.evidence.mismatch_count ?? null)
    assert.equal(event.final_status, record.final_status)
    assert.equal(receipt.result_sha256, event.result_sha256)
    for (const log of event.simulation_logs) assert.equal(hash(await readFile(join(event.verification_run_id, log.path))), log.sha256)
    const invocations = record.stages.simulation?.invocations?.filter(item => item.version_matches === null) ?? []
    assert.equal(event.xsim_executed, invocations.length > 0)
    if (event.xsim_executed) assert.ok(invocations.some(item => /xsim\.(?:bat|exe)$/i.test(item.executable)), 'real XSim executable')
    receipts.set(event.feedback_sha256, receipt)
  }
  for (const event of trace.filter(event => event.event === 'model_request')) {
    const model = await json(join(event.model_run_id, 'model.json'))
    const wire = await json(join(event.model_run_id, 'prompt-final.txt'))
    assert.equal(hash(JSON.stringify(wire)), event.request_sha256)
    assert.deepEqual(wire.tools.map(tool => tool.function.name), event.available_tools)
    if (!event.consumed_feedback_sha256) continue
    const context = await json(join(event.model_run_id, 'context.json'))
    assert.equal(evidenceHash(context.feedback), event.consumed_feedback_sha256)
    assert.ok(receipts.has(event.consumed_feedback_sha256), 'feedback produced by this trajectory')
    assert.equal(model.observation.model_output_observed, true)
    const rendered = JSON.parse(wire.messages.find(message => message.role === 'user').content)
    assert.equal(evidenceHash({ observed: rendered.observed, additional_diagnostics: rendered.additional_diagnostics }), event.feedback_projection_sha256)
  }
  for (const event of trace.filter(event => event.event === 'agent_tool')) {
    const model = await json(join(event.model_run_id, 'model.json'))
    const call = model.message.content.find(item => item.type === 'tool-call')
    assert.equal(call.name, event.selected_tool); assert.equal(call.id, event.tool_call_id)
    assert.equal(hash(call.arguments), event.arguments_sha256)
    if (event.host_accepted) assert.ok(event.available_tools.includes(event.selected_tool))
  }
  if (result.status === 'VERIFIED') {
    assert.equal(hash(await readFile(join(target, 'final.sv'))), result.verified_source_sha256)
    assert.equal((await json(join(result.final_verification_run, 'result.json'))).final_verified, true)
  }
  trajectories.push({ directory, status: result.status, initial_status: result.initial_status,
    decisions: trace.filter(event => event.event === 'agent_tool').map(event => ({ selected_tool: event.selected_tool, host_accepted: event.host_accepted })),
    verification: verifications.map(event => ({ trigger: event.verification_trigger, xsim_executed: event.xsim_executed, checks: event.checks, mismatches: event.mismatches, status: event.final_status })),
    consumed_feedback_count: trace.filter(event => event.event === 'model_request' && event.consumed_feedback_sha256).length })
}
const report = { audit: 'PASS', frozen_files_checked: Object.keys(freeze.files).length, acquisition, trajectories }
await writeFile(join(root, 'report', 'evidence-audit.json'), JSON.stringify(report, null, 2))
console.log(JSON.stringify({ audit: report.audit, frozen_files_checked: report.frozen_files_checked, candidates: acquisition.length, trajectories }, null, 2))
