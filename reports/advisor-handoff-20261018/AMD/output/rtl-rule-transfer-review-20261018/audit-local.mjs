import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const history = 'D:/AMD/output/rtl-rule-transfer-probes-20261018'
const source = 'D:/AMD/workspaces/rtl-rule-transfer-probes-20261018'
const sha = value => createHash('sha256').update(value).digest('hex')
const text = path => readFile(path, 'utf8')
const json = async path => JSON.parse((await text(path)).replace(/^\uFEFF/, ''))
const load = name => json(join(history, name))
const save = (name, value) => writeFile(join(here, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })

async function snapshot(root) {
  const files = {}
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = join(path, entry.name)
      if (entry.isDirectory()) await walk(file)
      else if (entry.isFile()) {
        const data = await readFile(file)
        files[file] = { bytes: data.length, sha256: sha(data) }
      }
    }
  }
  await walk(root)
  return files
}

if (process.argv[2] === 'verify') {
  const before = await json(join(here, 'history-manifest.json'))
  const after = await snapshot(history)
  assert.deepEqual(after, before.files, 'Historical results changed')
  let links = 0
  const report = await text(join(here, 'REPORT.zh.md'))
  for (const match of report.matchAll(/\]\((D:\/[^)]+)\)/g)) {
    if (resolve(match[1]) !== resolve(join(here, 'verification.json'))) await readFile(match[1])
    links++
  }
  const evidence = await json(join(here, 'EVIDENCE_REVIEW.json'))
  for (const [path, expected] of Object.entries(evidence.source_hashes)) {
    assert.equal(sha(await readFile(path)), expected, 'Reviewed source changed')
  }
  assert.equal(evidence.totals.on_pass, 4)
  assert.equal(evidence.totals.off_pass, 6)
  assert.equal(evidence.calls.length, 42)
  assert.equal(evidence.plans.length, 20)
  assert.equal(evidence.edits.length, 10)
  await save('verification.json', {
    status: 'PASS', utc: new Date().toISOString(), history_files_unchanged: Object.keys(after).length,
    report_local_links_checked: links, source_files_checked: Object.keys(evidence.source_hashes).length,
    no_model_or_network_calls: true, handoff_updated: false,
    note: 'This verifies a local log review, not a new model experiment or a live cloud status check.'
  })
  assert.equal((await json(join(here, 'verification.json'))).status, 'PASS')
  console.log(JSON.stringify({ status: 'PASS', history_files_unchanged: Object.keys(after).length, report_links: links }))
  process.exit(0)
}

assert.equal(process.argv[2], 'collect', 'Use collect once, then verify once; outputs are never overwritten')
const priorManifest = await json(join(here, 'history-manifest.json')).catch(error => {
  if (error.code !== 'ENOENT') throw error
  return null
})
const currentFiles = await snapshot(history)
if (priorManifest) assert.deepEqual(currentFiles, priorManifest.files, 'Historical results changed since collection began')
else await save('history-manifest.json', { root: history, utc: new Date().toISOString(), files: currentFiles })
const calls = []
const outputIndex = await load('model-output-index.json')
for (const entry of await load('call-index.json')) {
  const request = await json(entry.request_file)
  const transport = await json(entry.transport_file)
  assert.equal(sha(JSON.stringify(request)), entry.request_sha256)
  assert.equal(transport.request_sha256, entry.request_sha256)
  assert.equal(transport.http_status, 200)
  assert.equal(transport.stream_complete, true)
  const events = (await text(entry.sse_file)).trim().split(/\r?\n/).map(line => JSON.parse(line))
  assert(events.some(event => event.data === '[DONE]'))
  const model = outputIndex.find(item => resolve(item.directory) === resolve(entry.associated_model_runs))
  assert(model, 'Missing associated model output')
  assert.equal(model.request_sha256, entry.request_sha256)
  await readFile(model.output_files['output.txt'])
  const payload = JSON.parse(request.messages.find(item => item.role === 'user').content)
  const skills = payload.guidance ?? []
  if (entry.arm === 'off') assert.equal(skills.length, 0)
  const result = { ...entry, skill_ids: skills.map(item => item.id), new_skill_present: skills.some(item => item.id === 'rtl.00_diagnostic_reasoning'), output: model.output_files['output.txt'] }
  calls.push(result)
}

const plans = []
for (const entry of await load('planner-validation-index.json')) {
  const directory = dirname(entry.validation_file)
  const raw = await text(join(directory, 'output.txt'))
  assert.equal(sha(raw), entry.raw_output_sha256)
  const value = JSON.parse(raw)
  const validation = await json(entry.validation_file)
  const grounding = await json(join(directory, 'grounding-validation.json'))
  const request = await json(join(directory, 'prompt-final.json'))
  const payload = JSON.parse(request.messages.find(item => item.role === 'user').content)
  const formatIssues = []
  for (const [field, content, limit] of [
    ['cause', value.cause, 160],
    ...value.checks.map((v, i) => [`checks[${i}]`, v, 160]),
    ...value.changes.flatMap((v, i) => ['before', 'after'].map(key => [`changes[${i}].${key}`, v[key], 200]))
  ]) {
    if (content.length > limit) formatIssues.push({ field, actual: content.length, limit })
    if (/[\r\n`]/.test(content)) formatIssues.push({ field, issue: 'CR_LF_or_backtick' })
  }
  if (raw.length > 1200) formatIssues.push({ field: 'total', actual: raw.length, limit: 1200 })
  plans.push({ task: entry.task, arm: entry.arm, recovery: entry.recovery, valid: validation.valid,
    output: join(directory, 'output.txt'), request: join(directory, 'prompt-final.json'),
    validation: entry.validation_file, cause: value.cause, cause_chars: value.cause.length,
    changes: value.changes, checks: value.checks, format_issues: formatIssues,
    noop_entries: value.changes.filter(change => change.before === change.after).length,
    grounding: grounding.location, source: payload.current.source,
    recovery_details_empty: entry.recovery && request.messages[0].content.includes('Host rejection details: []') })
}

const edits = []
const pairs = []
const coderRows = (await load('planner-coder-evidence.json')).rows
for (const pair of await load('comparison.json')) {
  const item = { task: pair.task }
  for (const arm of ['on', 'off']) {
    const resultFile = pair.arms[arm].result
    const result = await json(resultFile)
    const final = await json(join(result.final_verification_run, 'result.json'))
    assert.equal(result.shared_initial_sha256, pair.comparison.same_initial_sha256)
    if (result.verified_source_sha256) assert.equal(final.final_source_sha256, result.verified_source_sha256)
    const finalRevision = result.revisions.find(revision => revision.sha256 === final.final_source_sha256)
    assert(finalRevision, 'Final EDA is not bound to a saved task revision')
    assert.equal(sha(await readFile(join(finalRevision.directory, 'solution.sv'))), final.final_source_sha256)
    const rtlPass = ['compile', 'elaborate', 'simulation', 'synthesis'].every(stage => final.stages[stage].status === 'PASS')
    assert.equal(rtlPass, pair.comparison[`${arm}_rtl_pass`])
    const subset = calls.filter(call => call.arm === arm && call.task === pair.task)
    assert.equal(subset.filter(call => call.phase !== 'plan').length, result.model_runs.length)
    item[arm] = { terminal: result.status, rtl_pass: rtlPass, model_calls: subset.length,
      planner_calls: subset.filter(call => call.phase === 'plan').length,
      coder_calls: subset.filter(call => call.phase !== 'plan').length,
      result: resultFile, final_eda: join(result.final_verification_run, 'result.json'),
      simulation: final.stages.simulation.evidence,
      initial_sha256: result.shared_initial_sha256 }
    for (const action of result.actions.filter(action => action.tool === 'edit_dut' && action.accepted)) {
      const model = await json(join(action.model_run, 'model.json'))
      const call = model.message.content.find(block => block.type === 'tool-call' && block.name === 'edit_dut')
      const args = typeof call.arguments === 'string' ? JSON.parse(call.arguments) : call.arguments
      const context = await json(join(action.model_run, 'context.json'))
      const bound = coderRows.find(row => resolve(row.model_run) === resolve(action.model_run))
      const proposal = JSON.parse(bound.context_plan.text)
      const spans = args.replacements.map(change => {
        const start = context.current.source.indexOf(change.before)
        assert(start >= 0)
        assert.equal(context.current.source.indexOf(change.before, start + 1), -1)
        return { ...change, start, end: start + change.before.length }
      }).sort((a, b) => b.start - a.start)
      let candidate = context.current.source
      for (const span of spans) candidate = candidate.slice(0, span.start) + span.after + candidate.slice(span.end)
      const revision = result.revisions.find(item => item.revision === action.observation.revision_id)
      const saved = await text(join(revision.directory, 'solution.sv'))
      assert.equal(candidate, saved)
      assert.equal(sha(candidate), action.observation.source_sha256)
      assert.equal(spans.every(span => span.before !== span.after), true)
      let planned = context.current.source
      for (const change of proposal.changes) planned = planned.replace(change.before, change.after)
      assert.equal(planned, saved)
      edits.push({ task: pair.task, arm, model_output: join(action.model_run, 'model.json'),
        candidate: join(revision.directory, 'solution.sv'), replacements: args.replacements,
        candidate_sha256: sha(saved), same_candidate_as_plan: true,
        plan_contains_noop: proposal.changes.some(change => change.before === change.after), rtl_pass: rtlPass })
    }
  }
  pairs.push(item)
}

const totals = { tasks: pairs.length, arm_runs: pairs.length * 2, on_pass: pairs.filter(p => p.on.rtl_pass).length,
  off_pass: pairs.filter(p => p.off.rtl_pass).length, calls: calls.length, plans: plans.length,
  valid_plans: plans.filter(p => p.valid).length, invalid_format_plans: plans.filter(p => p.format_issues.length).length,
  invalid_grounding_only: plans.filter(p => !p.valid && !p.format_issues.length).length,
  accepted_edits: edits.length, on_new_skill_calls: calls.filter(c => c.arm === 'on' && c.new_skill_present).length,
  off_guidance_calls: calls.filter(c => c.arm === 'off' && c.skill_ids.length).length,
  usage: { prompt_tokens: calls.reduce((n, c) => n + c.prompt_tokens, 0), completion_tokens: calls.reduce((n, c) => n + c.completion_tokens, 0) } }
assert.equal(totals.tasks, 8)
assert.equal(totals.calls, 42)
assert.equal(totals.on_new_skill_calls, 16)
assert.equal(totals.accepted_edits, 10)
const sourceHashes = {}
for (const name of ['p10-plan-format.ts', 'p10-planner.ts', 'p10-repair-guards.ts', 'repair-policy.ts']) {
  const path = join(source, 'rtl-tools/src/phase1', name)
  sourceHashes[path] = sha(await readFile(path))
}
const evidence = { utc: new Date().toISOString(), scope: 'Offline reanalysis of frozen existing logs; no inference, answer edits or reruns',
  history, source, totals, pairs, plans, edits, calls, source_hashes: sourceHashes,
  corrections_to_historical_prose: [
    { task: 'Probe205_packet_parity', arm: 'on', observed_cause_chars: plans.filter(p => p.task === 'Probe205_packet_parity' && p.arm === 'on').sort((a, b) => Number(a.recovery) - Number(b.recovery)).map(p => p.cause_chars), conclusion: 'Recovery shortened cause from 297 to 223, but still exceeded 160. Historical prose reversed the sequence.' },
    { task: 'Probe206_owned_pulse', arm: 'off', observed_cause_chars: plans.filter(p => p.task === 'Probe206_owned_pulse' && p.arm === 'off').sort((a, b) => Number(a.recovery) - Number(b.recovery)).map(p => p.cause_chars), conclusion: 'Recovery shortened cause from 201 to 98; the remaining newline violations blocked execution. Historical prose reversed the sequence.' },
    { task: 'Probe208_valid_capacity', arm: 'on', conclusion: 'The accepted plan falsely calls a two-bit enum one-bit and includes an A-to-A entry. The coder omits the no-op and fixes marker; final candidate matches the net effect of the plan, not all requested replacements or diagnosis.' }
  ] }
await save('EVIDENCE_REVIEW.json', evidence)
console.log(JSON.stringify({ status: 'COLLECTED', ...totals }, null, 2))
