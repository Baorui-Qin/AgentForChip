// Keyless Host calibration, never a model application or campaign-scored entry point.
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { Context } from '../../../vendor/cordis/src/index.ts'
import LocalSubprocess from '../../../packages/subprocess/subprocess-local/src/index.ts'
import { readDoctorConfig } from '../../src/phase1/doctor.ts'
import { VerificationRunner } from '../../src/phase1/verification.ts'
import { checkNetlist } from '../../src/phase1/p10-netlist.ts'
import { buildNetlistProfile } from '../../src/phase1/p10-netlist-suite.ts'
import { applyPublicInterfaceErratum } from '../../src/phase1/p10-interface-errata.ts'
import { netlistProfiles } from '../../src/phase1/p10-netlist-profiles.ts'
import { sha256 } from '../../src/phase1/snapshots.ts'
import { assertAcceptance } from './acceptance-audit.mjs'

const { values } = parseArgs({ options: Object.fromEntries(['root', 'catalog', 'dataset', 'settings', 'tasks', 'reuse-campaign'].map(k => [k, { type: 'string' }])) })
for (const key of ['root', 'catalog', 'dataset', 'settings']) assert.ok(values[key], `Missing --${key}`)
const root = resolve(values.root), repo = resolve(fileURLToPath(new URL('../../..', import.meta.url)))
await mkdir(root)
const catalog = JSON.parse(await readFile(values.catalog, 'utf8')).map(applyPublicInterfaceErratum)
assert.equal(catalog.length, 156)
assert.equal(new Set(catalog.map(t => t.task_id)).size, 156)
const requested = values.tasks?.split(',')
if (requested) for (const id of requested) assert.ok(catalog.some(t => t.task_id === id), 'Unknown task: ' + id)
const tasks = catalog.filter(t => requested ? requested.includes(t.task_id) : !netlistProfiles[t.task_id])
const files = {}
const effectiveCatalog = join(root, 'effective-catalog.json')
await writeFile(effectiveCatalog, JSON.stringify(catalog, null, 2), { flag: 'wx' })
files[effectiveCatalog] = sha256(await readFile(effectiveCatalog))
for (const name of await readdir(join(repo, 'rtl-tools/src/phase1'))) if (name.endsWith('.ts')) {
  const path = join(repo, 'rtl-tools/src/phase1', name); files[path] = sha256(await readFile(path))
}
for (const path of [fileURLToPath(import.meta.url), values.catalog, values.settings, join(repo, 'rtl-tools/phase1/p10/acceptance-audit.mjs'), join(repo, 'rtl-tools/src/synthesis.ts'), join(repo, 'rtl-tools/src/process.ts')]) files[resolve(path)] = sha256(await readFile(path))
const { config } = await readDoctorConfig(values.settings)
config.outputRoot = join(root, 'eda'); await mkdir(config.outputRoot)
config.limits.threads = 4
const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 120000, totalMs: 900000, netlistMs: 240000,
  maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
await writeFile(join(root, 'freeze.json'), JSON.stringify({ model_calls: 0, workers: 1, tasks: tasks.map(t => t.task_id), limits, files }, null, 2), { flag: 'wx' })
const ctx = new Context(); await ctx.plugin(LocalSubprocess)
const runner = new VerificationRunner(ctx.subprocess, config, limits), controller = new AbortController(), signal = controller.signal
const stop = () => controller.abort()
process.once('SIGINT', stop); process.once('SIGTERM', stop)
const rows = []
let freezeVerified = false
try {
  for (const task of tasks) {
    if (signal.aborted) break
    const row = { task_id: task.task_id, status: 'BLOCKED' }; rows.push(row)
    try {
      const reference = await readFile(join(values.dataset, `dataset_spec-to-rtl/${task.task_id}_ref.sv`), 'utf8')
      const tb = await readFile(join(values.dataset, `dataset_spec-to-rtl/${task.task_id}_test.sv`), 'utf8')
      const { profile, positive, negative } = buildNetlistProfile(task, reference, tb)
      const taskRoot = join(root, task.task_id); await mkdir(taskRoot)
      const rtlTB = profile.testbench.replace(/if\(glbl\.GSR[^\n]*?\$fatal\(1,"GSR_STARTUP_INVALID"\);/, '')
        .replace('PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches', 'Mismatches: %0d in %0d samples",mismatches,checks')
      const assets = { 'rtl/solution.sv': positive, 'trusted/tb.sv': rtlTB, 'trusted/clock.xdc': task.clock?.kind === 'physical'
        ? `create_clock -period 10 [get_ports ${task.clock.port}]\n` : 'create_clock -name virtual_clk -period 10\n' }
      await writeFile(join(taskRoot, 'derived-tb.sv'), profile.testbench, { flag: 'wx' })
      async function runRTL(preflight, source = positive) {
        const id = await runner.registerDataset({ ...assets, 'rtl/solution.sv': source }, { top: 'TopModule', tbTop: 'netlist_tb', sources: ['rtl/solution.sv', 'trusted/tb.sv'],
          evaluatorId: profile.id + ':rtl-control', seed: 1, defaultTimescale: '1ps/1ps', datasetRevision: 'pinned-host-netlist-calibration' },
        { experiment_id: 'netlist-suite-calibration', task_id: task.task_id, sample_id: rows.length, mode: 'baseline' })
        const result = await (preflight ? runner.preflightDataset(id, signal, argv => argv) : runner.verify(id, signal, argv => argv))
        row.rtl_status = result.status; row.rtl_control_run = result.artifacts
        if (result.status !== (preflight ? 'EVALUATOR_READY' : 'PASS')) throw new Error('NETLIST_POSITIVE_RTL_OR_SYNTHESIS_FAILED')
        return result.artifacts
      }
      let archived = null
      if (values['reuse-campaign']) {
        const path = join(values['reuse-campaign'], `compare-${task.task_id}`, 'result.json')
        const bytes = await readFile(path).catch(error => { if (error.code === 'ENOENT') return null; throw error })
        if (bytes) {
          const prior = JSON.parse(bytes)
          if (prior.status === 'VERIFIED' && prior.task_id === task.task_id) {
            archived = prior.final_verification_run
            row.archive_selector = { path, sha256: sha256(bytes) }
          }
        }
      }
      const rtlRun = await runRTL(!!archived)
      const rtlRecord = JSON.parse(await readFile(join(rtlRun, 'result.json'), 'utf8'))
      profile.checks = rtlRecord.stages.simulation.evidence.checks_executed
      negative.checks = profile.checks
      assert.ok(Number.isSafeInteger(profile.checks) && profile.checks > 0)
      row.original_run = archived ?? rtlRun
      let record = JSON.parse(await readFile(join(row.original_run, 'result.json'), 'utf8'))
      const posRoot = join(taskRoot, 'positive'), negRoot = join(taskRoot, 'negative')
      async function checkPositive(output) {
        const pos = await checkNetlist(ctx.subprocess, config, limits, profile, row.original_run, record, output, signal)
        return { status: pos.status, checks: pos.checks, mismatches: pos.mismatches, path: join(output, 'acceptance.json'), sha256: sha256(await readFile(join(output, 'acceptance.json'))) }
      }
      row.positive = await checkPositive(posRoot)
      row.control = archived ? 'historical_netlist_replayed_read_only' : 'fresh_reference_synthesis'
      if (archived && row.positive.status !== 'PASS') {
        row.historical_probe = row.positive
        row.original_run = await runRTL(false)
        record = JSON.parse(await readFile(join(row.original_run, 'result.json'), 'utf8'))
        assert.equal(record.stages.simulation.evidence.checks_executed, profile.checks)
        row.positive = await checkPositive(join(taskRoot, 'positive-reference'))
        row.control = 'fresh_reference_synthesis_after_failed_historical_probe'
      }
      if (row.positive.status !== 'PASS') throw new Error('NETLIST_POSITIVE_FAILED')
      await assertAcceptance(row.positive, { task: task.task_id, source: record.final_source_sha256, run: row.original_run })
      const neg = await checkNetlist(ctx.subprocess, config, limits, negative, row.original_run, record, negRoot, signal)
      row.negative = { kind: profile.provenance.negative_control, status: neg.status, checks: neg.checks, mismatches: neg.mismatches,
        path: join(negRoot, 'acceptance.json'), sha256: sha256(await readFile(join(negRoot, 'acceptance.json'))) }
      if (neg.status !== 'NETLIST_MISMATCH' || neg.checks !== profile.checks || !(neg.mismatches > 0)) throw new Error('NETLIST_NEGATIVE_NOT_DETECTED')
      if (task.task_id === 'Prob053_m2014_q4d') {
        const alternate = positive.replace(/initial\s+out\s*=\s*0;/, 'initial out=1;')
        assert.notEqual(alternate, positive)
        const alternateRun = await runRTL(false, alternate), alternateRecord = JSON.parse(await readFile(join(alternateRun, 'result.json'), 'utf8'))
        const alternateRoot = join(taskRoot, 'positive-initial-one')
        const alt = await checkNetlist(ctx.subprocess, config, limits, profile, alternateRun, alternateRecord, alternateRoot, signal)
        row.alternate_initial_state = { status: alt.status, checks: alt.checks, mismatches: alt.mismatches, path: join(alternateRoot, 'acceptance.json'), sha256: sha256(await readFile(join(alternateRoot, 'acceptance.json'))), run: alternateRun }
        await assertAcceptance(row.alternate_initial_state, { task: task.task_id, source: alternateRecord.final_source_sha256, run: alternateRun })
      }
      row.status = 'CALIBRATED'; row.profile_sha256 = sha256(JSON.stringify(profile))
      await writeFile(join(taskRoot, 'profile.json'), JSON.stringify(profile, null, 2), { flag: 'wx' })
    } catch (error) { row.reason = error instanceof Error ? error.message : 'HOST_ERROR' }
    await writeFile(join(root, 'progress.json'), JSON.stringify(rows, null, 2))
    process.stdout.write(JSON.stringify(row) + '\n')
  }
  for (const [path, expected] of Object.entries(files)) assert.equal(sha256(await readFile(path)), expected, 'Calibration source changed: ' + path)
  freezeVerified = true
} finally {
  process.removeListener('SIGINT', stop); process.removeListener('SIGTERM', stop)
  await runner.close(); await ctx.fiber.dispose()
  await writeFile(join(root, 'results.json'), JSON.stringify({ model_calls: 0, freeze_verified: freezeVerified, interrupted: signal.aborted, rows }, null, 2), { flag: 'wx' })
}
