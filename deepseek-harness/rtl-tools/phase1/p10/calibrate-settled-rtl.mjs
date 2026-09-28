// Keyless Host calibration for the stable-sampling RTL protocol.
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { Context } from '../../../vendor/cordis/src/index.ts'
import LocalSubprocess from '../../../packages/subprocess/subprocess-local/src/index.ts'
import { loadP10Dataset } from '../../src/phase1/p10-dataset.ts'
import { settledRTLTestbench, loadSettledRTLAssets, settledRTLProtocol, settledRTLManifest } from '../../src/phase1/p10-settled-rtl.ts'
import { readDoctorConfig } from '../../src/phase1/doctor.ts'
import { VerificationRunner } from '../../src/phase1/verification.ts'
import { sha256 } from '../../src/phase1/snapshots.ts'

const { values } = parseArgs({ options: Object.fromEntries(['root', 'dataset', 'settings', 'tasks', 'historical'].map(k => [k, { type: 'string' }])) })
for (const key of ['root', 'dataset', 'settings']) assert.ok(values[key], `Missing --${key}`)
const root = resolve(values.root), repo = resolve(fileURLToPath(new URL('../../..', import.meta.url)))
await mkdir(root)
const put = (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const git = (...args) => execFileSync('git', ['-C', values.dataset, ...args], { encoding: 'utf8', windowsHide: true })
assert.equal(git('status', '--porcelain').trim(), '')
const catalog = await loadP10Dataset(values.dataset, git('rev-parse', 'HEAD'), git('ls-tree', '-r', 'HEAD', '--', 'dataset_spec-to-rtl'), git('ls-files', '--eol', '--', 'dataset_spec-to-rtl'))
const requested = values.tasks?.split(',')
if (requested) for (const id of requested) assert.ok(catalog.some(t => t.task_id === id), 'Unknown task: ' + id)
const tasks = catalog.filter(t => !requested || requested.includes(t.task_id))
await mkdir(join(root, 'derived')); await mkdir(join(root, 'eda'))
const manifest = { protocol: settledRTLProtocol, tasks: {} }
for (const task of tasks) {
  const derived = settledRTLTestbench(task)
  manifest.tasks[task.task_id] = { tb_sha256: sha256(derived.testbench), profile_sha256: derived.profile_sha256, checks: derived.checks }
  await mkdir(join(root, 'derived', task.task_id))
  await writeFile(join(root, 'derived', task.task_id, 'tb.sv'), derived.testbench, { flag: 'wx' })
}
await put('derived/' + settledRTLManifest, manifest)
await put('catalog.json', catalog); await put('selection-order.json', tasks.map(t => t.task_id))
await put('manifest-156.json', { protocol: settledRTLProtocol, task_ids: tasks.map(t => t.task_id), model_calls: 0 })
await put('evaluator-policy.json', { rtl_evaluator: settledRTLProtocol, defaultTimescale: '1ps/1ps', original_dataset_unchanged: true })
const files = {}
for (const name of await readdir(join(repo, 'rtl-tools/src/phase1'))) if (name.endsWith('.ts')) {
  const path = join(repo, 'rtl-tools/src/phase1', name); files[path] = sha256(await readFile(path))
}
for (const path of [fileURLToPath(import.meta.url), values.settings, join(root, 'derived', settledRTLManifest)]) files[resolve(path)] = sha256(await readFile(path))
const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 120000, totalMs: 900000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
await put('freeze.json', { protocol: settledRTLProtocol, files, limits, workers: 1, model_calls: 0 })
const { config } = await readDoctorConfig(values.settings)
config.outputRoot = join(root, 'eda'); config.limits.threads = 4
const ctx = new Context(); await ctx.plugin(LocalSubprocess)
const runner = new VerificationRunner(ctx.subprocess, config, limits), controller = new AbortController()
const stop = () => controller.abort()
process.once('SIGINT', stop); process.once('SIGTERM', stop)
const rows = [], attacks = []
let freezeVerified = false, sample = 0
async function verify(task, label, assets, evaluation) {
  const id = await runner.registerDataset(assets, evaluation, { experiment_id: 'settled-rtl-calibration', task_id: task.task_id, sample_id: sample++, mode: 'baseline' })
  const result = await runner.preflightDataset(id, controller.signal, argv => argv)
  const record = JSON.parse(await readFile(join(result.artifacts, 'result.json'), 'utf8'))
  return { label, status: result.status, run: result.artifacts, result_sha256: sha256(await readFile(join(result.artifacts, 'result.json'))),
    checks: record.stages.simulation.evidence.checks_executed, mismatches: record.stages.simulation.evidence.mismatch_count, complete: record.stages.simulation.evidence.test_completed }
}
function wrongDUT(task, positive) {
  const ports = task.interface.ports, outputs = ports.filter(p => p.direction === 'output')
  const width = p => p.width === 1 ? '' : `[${p.width - 1}:0] `
  const header = `module TopModule(${ports.map(p => `${p.direction} wire ${width(p)}${p.name}`).join(',')});\n`
  if (task.task_id === 'Prob053_m2014_q4d') return header + "assign out=1'b0; endmodule\n"
  return positive.replace(/\bTopModule\b/g, 'CalibrationReference') + '\n' + header + outputs.map(p => `wire ${width(p)}cal_${p.name};`).join('\n') +
    '\nCalibrationReference control(' + ports.map(p => `.${p.name}(${p.direction === 'output' ? 'cal_' : ''}${p.name})`).join(',') + ');\n' +
    outputs.map(p => `assign ${p.name}=~cal_${p.name};`).join('\n') + '\nendmodule\n'
}
try {
  for (const task of tasks) {
    controller.signal.throwIfAborted()
    const row = { task_id: task.task_id, evaluable: false }; rows.push(row)
    try {
      const { assets, evaluation } = await loadSettledRTLAssets(values.dataset, task, join(root, 'derived'))
      row.positive = await verify(task, 'positive', assets, evaluation)
      row.negative = await verify(task, 'wrong_dut', { ...assets, 'rtl/solution.sv': wrongDUT(task, assets['rtl/solution.sv']) }, evaluation)
      const expected = manifest.tasks[task.task_id].checks
      assert.equal(row.positive.status, 'EVALUATOR_READY'); assert.equal(row.positive.checks, expected); assert.equal(row.positive.mismatches, 0)
      assert.equal(row.negative.status, 'FAIL'); assert.equal(row.negative.checks, expected); assert.ok(row.negative.mismatches > 0 && row.negative.complete)
      if (task.task_id === 'Prob078_dualedge' && values.historical) {
        for (const [label, path, expectedStatus] of [
          ['rt02_correct_baseline', join(values.historical, `generate-${task.task_id}`, 'initial.sv'), 'EVALUATOR_READY'],
          ['rt02_wrong_historical_pass', join(values.historical, `compare-${task.task_id}`, 'final.sv'), 'FAIL'],
        ]) {
          const source = await readFile(path, 'utf8'), attack = await verify(task, label, { ...assets, 'rtl/solution.sv': source }, evaluation)
          attacks.push({ ...attack, source_path: path, source_sha256: sha256(source) }); assert.equal(attack.status, expectedStatus)
        }
      }
      if (task.task_id === 'Prob031_dff') {
        const tb = assets['trusted/tb.sv'].replace("seen_q=1'b1;", "seen_q=1'b0;")
        assert.notEqual(tb, assets['trusted/tb.sv'])
        const attack = await verify(task, 'unobserved_output', { ...assets, 'trusted/tb.sv': tb }, evaluation)
        attacks.push(attack); assert.notEqual(attack.status, 'EVALUATOR_READY'); assert.equal(attack.complete, false)
      }
      row.evaluable = true
    } catch (error) { row.reason = error instanceof Error ? error.message : String(error) }
    await writeFile(join(root, 'progress.json'), JSON.stringify(rows, null, 2))
    process.stdout.write(JSON.stringify(row) + '\n')
  }
  for (const [path, hash] of Object.entries(files)) assert.equal(sha256(await readFile(path)), hash, path)
  assert.equal(git('status', '--porcelain').trim(), '')
  freezeVerified = true
} finally {
  process.removeListener('SIGINT', stop); process.removeListener('SIGTERM', stop)
  await runner.close(); await ctx.fiber.dispose()
  await put('compat-positive-negative-results.json', rows)
  await put('results.json', { protocol: settledRTLProtocol, model_calls: 0, freeze_verified: freezeVerified, interrupted: controller.signal.aborted, rows, attacks })
}
if (!freezeVerified || rows.some(row => !row.evaluable)) process.exitCode = 1
