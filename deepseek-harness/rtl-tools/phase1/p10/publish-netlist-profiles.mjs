// Publish only independently audited Host calibration controls; no model calls.
import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { parseArgs } from 'node:util'
import { assertAcceptance } from './acceptance-audit.mjs'

const { positionals: [output, ...roots], values } = parseArgs({ allowPositionals: true, options: { replace: { type: 'string' } } })
assert.ok(output && roots.length, 'Usage: publish-netlist-profiles.mjs <new-output.ts> <calibration-root> ... [--replace task-id,...]')
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const profiles = {}, evidence = {}
const replacements = new Set(values.replace?.split(',') ?? []), selected = new Map(), superseded = []
for (const root of roots) {
  const result = await json(join(root, 'results.json'))
  assert.equal(result.model_calls, 0)
  assert.equal(result.freeze_verified, true)
  for (const row of result.rows.filter(r => r.status === 'CALIBRATED')) {
    const previous = selected.get(row.task_id)
    if (previous) {
      assert.ok(replacements.has(row.task_id), 'Duplicate task calibration: ' + row.task_id)
      superseded.push({ task_id: row.task_id, root: resolve(previous.root), profile_sha256: previous.row.profile_sha256 })
    }
    selected.set(row.task_id, { root, row })
  }
}
for (const { root, row } of selected.values()) {
    const profile = await json(join(root, row.task_id, 'profile.json'))
    assert.equal(hash(JSON.stringify(profile)), row.profile_sha256)
    const original = await json(join(row.original_run, 'result.json'))
    const receipt = await assertAcceptance(row.positive, { task: row.task_id, source: original.final_source_sha256, run: row.original_run })
    assert.deepEqual(receipt.profile, profile)
    const negBytes = await readFile(row.negative.path), neg = JSON.parse(negBytes)
    assert.equal(hash(negBytes), row.negative.sha256)
    assert.equal(neg.status, 'NETLIST_MISMATCH')
    assert.equal(neg.task_id, row.task_id)
    assert.equal(neg.netlist_sha256, receipt.netlist_sha256)
    assert.equal(neg.checks, profile.checks)
    assert.ok(neg.mismatches > 0)
    assert.equal(hash(JSON.stringify(neg.profile)), neg.profile_sha256)
    assert.equal(row.negative.kind, profile.provenance.negative_control)
    assert.ok(['stuck_zero', 'inversion'].includes(row.negative.kind))
    assert.equal(neg.profile.testbench, profile.testbench.replace(/assign (dut_\w+)=(raw_dut_\w+);/g, row.negative.kind === 'stuck_zero' ? "assign $1=1'b0;" : 'assign $1=~$2;'))
    if (profile.provenance.kind === 'public_spec_xor_feedback_transition') {
      assert.equal(row.task_id, 'Prob053_m2014_q4d')
      const alt = row.alternate_initial_state, altRecord = await json(join(alt.run, 'result.json'))
      const altReceipt = await assertAcceptance(alt, { task: row.task_id, source: altRecord.final_source_sha256, run: alt.run })
      assert.deepEqual(altReceipt.profile, profile)
    }
    assert.deepEqual(neg.commands.map(c => c.label), ['compile', 'elaborate', 'simulation'])
    for (const command of neg.commands) assert.ok(command.outcome.exitCode === 0 && !command.outcome.signal && !command.outcome.timedOut && !command.outcome.aborted && !command.outcome.logTruncated)
    for (const [file, sha] of Object.entries(neg.files)) assert.equal(hash(await readFile(join(root, row.task_id, 'negative', file))), sha)
    const log = await readFile(join(root, row.task_id, 'negative', 'simulation.stdout.log'), 'utf8')
    assert.ok(!/(?:Fatal:|FATAL:|TIMEOUT|NETLIST_OUTPUT_UNOBSERVED:)/.test(log))
    const markers = [...log.matchAll(/PHASE1_COMPLETE checks=(\d+) mismatches=(\d+)/g)]
    assert.equal(markers.length, 1); assert.equal(Number(markers[0][1]), neg.checks); assert.equal(Number(markers[0][2]), neg.mismatches)
    profiles[row.task_id] = profile
    evidence[row.task_id] = { root: resolve(root), profile_sha256: row.profile_sha256, positive: row.positive, negative: row.negative, alternate_initial_state: row.alternate_initial_state,
      superseded: superseded.filter(previous => previous.task_id === row.task_id),
      control_source_sha256: receipt.candidate_sha256, netlist_sha256: receipt.netlist_sha256 }
}
const sorted = value => Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)))
assert.ok(Object.keys(profiles).length, 'No calibrated profiles to publish')
const body = `/** Generated calibrated VerilogEval oracles. NVIDIA MIT notice: ../../phase1/p10/VERILOGEVAL-LICENSE. @module rtl-tools/phase1/p10-netlist-calibrated */\nimport type { NetlistProfile } from './p10-netlist-profiles.ts'\n\n/** Only positive and negative real-tool controls can publish an enabled oracle. */\nexport const calibratedNetlistProfiles: Record<string, NetlistProfile> = ${JSON.stringify(sorted(profiles), null, 2)}\n\n/** External read-only calibration evidence; not model scores. */\nexport const netlistCalibrationEvidence = ${JSON.stringify(sorted(evidence), null, 2)}\n`
await writeFile(output, body, { flag: 'wx' })
process.stdout.write(JSON.stringify({ output: resolve(output), calibrated: Object.keys(profiles).length, superseded, sha256: hash(body) }) + '\n')
