import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { afterAll, beforeAll, expect, it } from 'vitest'
import { readDoctorConfig, runDoctor } from '../src/phase1/doctor.ts'
import { VerificationRunner } from '../src/phase1/verification.ts'
import { fixtureIds, expectedStage } from '../src/phase1/fixtures.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'
import { execFileSync } from 'node:child_process'
import { loadP10Dataset, p10PreflightAssets, selectP10 } from '../src/phase1/p10-dataset.ts'
import { buildSuite, loadSuiteAssets, suiteManifestName, assertSharedEvaluator } from '../src/phase1/p10-compat-suite.ts'
import { negativeControl } from '../src/phase1/p10-compat.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { classifyPreflight } from '../src/phase1/p10-report.ts'
import { readDiagnostics } from '../src/phase1/repair-diagnostics.ts'
import { fixtureFiles } from '../src/phase1/fixtures.ts'

// Opt-in integration evidence is retained outside the immutable Phase 1 runs.
const live = process.env.VIVADO_LIVE === '1'
let ctx: Context, runner: VerificationRunner, output: string
let settings: Awaited<ReturnType<typeof readDoctorConfig>>
beforeAll(async () => {
  if (!live) return
  settings = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  await mkdir(settings.config.outputRoot, { recursive: true })
  output = await mkdtemp(join(settings.config.outputRoot, 'regression-'))
  settings.config.outputRoot = output
  ctx = new Context(); await ctx.plugin(LocalSubprocess)
  runner = new VerificationRunner(ctx.subprocess, settings.config, { compileMs: 120000, elaborateMs: 120000, simulationMs: 60000,
    totalMs: 600000, maxArtifactBytes: 536870912, artifactPollMs: 500, maxEventBytes: 4194304 })
  console.log('Vivado live evidence: ' + output)
})
afterAll(async () => { await runner?.close(); await ctx?.fiber.dispose() })

it.skipIf(!live)('detects the configured tools and synthesizes the doctor counter', async () => {
  const result = await runDoctor(ctx.subprocess, settings.config, settings.sha256, new AbortController().signal, argv => argv)
  await writeFile(join(output, 'doctor-result.json'), JSON.stringify(result, null, 2))
  expect(Object.values(result.versions).every(x => x.matches), JSON.stringify(result.versions)).toBe(true)
  expect(result.eda_ready, JSON.stringify(result)).toBe(true)
}, 900000)

it.skipIf(!live).each(fixtureIds)('verifies real EDA fixture %s through the existing Harness runner', async fixture => {
  const id = await runner.registerFixture(fixture, { experiment_id: 'vivado-live' as PhaseId, task_id: fixture as PhaseId, sample_id: 0, mode: 'baseline' })
  const result = await runner.verify(id, new AbortController().signal, argv => argv)
  await writeFile(join(output, fixture + '.json'), JSON.stringify(result, null, 2))
  const failed = result.stages.find(s => s.status !== 'PASS')
  expect(failed?.stage ?? null, JSON.stringify(result)).toBe(expectedStage[fixture])
  if (failed) {
    expect(failed.status).toBe('FAIL')
    if (fixture === 'synthesis-only') {
      expect(failed.synthesis?.synthesizable).toBe(false)
      expect(failed.errors.some(error => error.message_id === 'Synth 8-439')).toBe(true)
    }
  }
  else {
    expect(result.stages[3]!.synthesis?.resources.ff).toBe(4)
    expect(result.stages[3]!.synthesis?.timing.reason).toBeNull()
    expect(Number.isFinite(result.stages[3]!.synthesis?.timing.wns)).toBe(true)
  }
  const files = JSON.parse(await readFile(join(result.artifacts, 'result.json'), 'utf8'))
  expect(files).toBeTruthy()
}, 600000)

it.skipIf(!live).each([
  ['name-resolution', 'elaborate', 'module counter(input clk, input rst, output [3:0] count); assign count = missing_function(rst); endmodule\n'],
  ['undeclared-signal', 'compile', 'module counter(input clk, input rst, output reg [3:0] count); always @* count = absent_signal; endmodule\n'],
  ['named-port', 'elaborate', 'module counter(input clk, input rst, output [3:0] count); child u(.absent(count)); endmodule\nmodule child(output [3:0] q); assign q=0; endmodule\n'],
  ['port-count', 'elaborate', 'module counter(input clk, input rst, output [3:0] count); child u(count, rst); endmodule\nmodule child(output [3:0] q); assign q=0; endmodule\n'],
] as const)('parses real %s errors at the vendor-reported stage', async (name, stage, source) => {
  const assets = { ...fixtureFiles('counter'), 'rtl/solution.sv': source }
  const evaluation = { top: 'counter', tbTop: 'phase1_tb', sources: ['rtl/solution.sv', 'trusted/tb.sv'], evaluatorId: 'handwritten-diagnostic-' + name, seed: 1, datasetRevision: 'handwritten', defaultTimescale: '1ps/1ps' as const }
  const id = await runner.registerDataset(assets, evaluation, { experiment_id: 'vivado-live' as PhaseId, task_id: name as PhaseId, sample_id: 0, mode: 'baseline' })
  const result = await runner.preflightDataset(id, new AbortController().signal, argv => argv)
  await writeFile(join(output, name + '.json'), JSON.stringify(result, null, 2))
  const failed = result.stages.find(s => s.status !== 'PASS')!
  expect(failed.stage, JSON.stringify(result)).toBe(stage)
  expect(failed.errors.some(e => e.message_id?.startsWith('VRFC'))).toBe(true)
}, 180000)

it.skipIf(!live)('revalidates original VerilogEval inputs, freezes a reproducible suite and checks positive/negative waveform evidence', async () => {
  const dataset = fileURLToPath(new URL('../../../AMD/phase2-vivado2026.1/verilog-eval', import.meta.url))
  const git = (...args: string[]) => execFileSync('git', ['-C', dataset, ...args], { encoding: 'utf8', windowsHide: true })
  expect(git('status', '--porcelain')).toBe('')
  const revision = git('rev-parse', 'HEAD').trim()
  const catalog = await loadP10Dataset(dataset, revision, git('ls-tree', '-r', '--full-tree', revision, 'dataset_spec-to-rtl'), git('ls-files', '--eol', '--', 'dataset_spec-to-rtl'))
  const tasks = selectP10(catalog).slice(0, 10).map(x => x.task)
  tasks.push(catalog.find(t => t.task_id === 'Prob038_count15')!)
  const results: Record<string, unknown>[] = []
  const verify = async (task: typeof tasks[number], kind: string, inputs: Awaited<ReturnType<typeof p10PreflightAssets>>) => {
    const id = await runner.registerDataset(inputs.assets, inputs.evaluation, { experiment_id: 'vivado-live' as PhaseId, task_id: task.task_id as PhaseId, sample_id: results.length, mode: 'baseline' })
    const result = await runner.preflightDataset(id, new AbortController().signal, argv => argv)
    results.push({ task: task.task_id, kind, result })
    await writeFile(join(output, 'compat-runs.json'), JSON.stringify(results, null, 2))
    return result
  }
  let declarationRule = false
  for (const task of [tasks[0]!, tasks.at(-1)!]) {
    const original = await verify(task, 'original', await p10PreflightAssets(dataset, task))
    const compile = original.stages[0]!
    if (classifyPreflight(original).status === 'TESTBENCH_COMPATIBILITY_BLOCKED') {
      expect(compile.errors.some(e => e.message_id === 'VRFC 10-3380'), JSON.stringify(compile)).toBe(true)
      declarationRule = true
    } else expect(compile.status).toBe('PASS')
  }
  const policy = { vivadoVersion: settings.config.expectedVivadoVersion, applyDeclarationOrderRule: declarationRule }
  const derived = join(output, 'derived'), repeat = join(output, 'repeat')
  await mkdir(derived); await mkdir(repeat)
  const epoch = new Date().toISOString()
  const manifest = await buildSuite(dataset, catalog, derived, epoch, policy)
  await buildSuite(dataset, catalog, repeat, epoch, policy)
  const name = suiteManifestName(policy.vivadoVersion), bytes = await readFile(join(derived, name))
  expect(await readFile(join(repeat, name))).toEqual(bytes)
  expect(manifest.task_count).toBe(156)
  let defaultTimescale: '1ps/1ps' | undefined
  for (const task of [tasks[0]!, tasks.at(-1)!]) {
    const result = await verify(task, 'declaration-only', await loadSuiteAssets(dataset, task, derived, undefined, true))
    expect(result.stages[0]!.status, JSON.stringify(result)).toBe('PASS')
    if (result.stages[1]!.status !== 'PASS') {
      expect(result.stages[1]!.errors.some(e => /43-4099|timescale|time unit/i.test(JSON.stringify(e)))).toBe(true)
      defaultTimescale = '1ps/1ps'
    }
  }
  for (const task of tasks) {
    const inputs = await loadSuiteAssets(dataset, task, derived, defaultTimescale, true)
    const positive = await verify(task, 'positive', inputs)
    expect(positive.status, JSON.stringify(positive)).toBe('EVALUATOR_READY')
    inputs.assets['rtl/solution.sv'] = negativeControl(task)
    const negative = await verify(task, 'negative', inputs)
    expect(negative.stages[2]!.status, JSON.stringify(negative)).toBe('FAIL')
    expect(negative.stages[2]!.evidence.mismatch_count).toBeGreaterThan(0)
    const { receipt } = await readDiagnostics(negative.artifacts, 'live_verification')
    const feedback = receipt.stages.find(s => s.stage === 'simulation')!.simulation_feedback!
    expect(feedback.outputs.length).toBeGreaterThan(0)
    expect(feedback.first_failure_time).not.toBeNull()
    expect(feedback.waveform.status, JSON.stringify(feedback)).toBe('available')
    expect(feedback.waveform.samples.length).toBeGreaterThan(0)
    await writeFile(join(output, task.task_id + '-feedback.json'), JSON.stringify(receipt, null, 2))
  }
  const seal = { manifest_sha256: sha256(bytes), defaultTimescale, representative_calibration_passed: true }
  await writeFile(join(derived, 'suite-freeze.json'), JSON.stringify(seal, null, 2))
  const baseline = await loadSuiteAssets(dataset, tasks[0]!, derived, defaultTimescale)
  assertSharedEvaluator(baseline, await loadSuiteAssets(dataset, tasks[0]!, derived, defaultTimescale))
  expect(baseline.evaluation.evaluatorId).toContain(`vivado${policy.vivadoVersion}-compat-v1`)
  expect(git('status', '--porcelain')).toBe('')
  await writeFile(join(output, 'compatibility-result.json'), JSON.stringify({ ...seal, policy, manifest: join(derived, name), task_count: 156,
    calibrated_tasks: tasks.map(t => t.task_id), evaluator_identity: baseline.evaluation.evaluatorId, dataset_revision: revision, dataset_unchanged: true }, null, 2))
}, 1800000)
