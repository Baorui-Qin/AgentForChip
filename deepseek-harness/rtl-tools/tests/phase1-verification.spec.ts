const snapshotEnvironment = { expectedVivadoVersion: '2026.1', part: 'xczu3eg-sbva484-1-e' as const, clockPeriodNs: 5 as const }
import { mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { afterEach, expect, it, vi } from 'vitest'
import { installTestOperationScope } from './test-operation-scope.ts'
import { DeterministicEdaOutput } from './helpers/deterministic-eda-output.ts'
import { ManagedVersionProbeFixture } from './helpers/managed-version-probe-fixture.ts'
import { TargetWitness } from './helpers/g1-target-witness.ts'
import { waitForBoundTarget } from './helpers/bound-target-wait.ts'
import { waitForChildReadiness } from './helpers/child-readiness-wait.ts'
import type { SubprocessHandle, SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'
import { VerificationRunner, SimulationEvidence, type VerificationResult } from '../src/phase1/verification.ts'
import { checkedFile, checkSnapshot, createSnapshot, createDatasetSnapshot } from '../src/phase1/snapshots.ts'
import { parseRecord } from '../src/phase1/records.ts'
import { fixtureIds, expectedStage, type FixtureId } from '../src/phase1/fixtures.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'
import { inspectRun } from '../src/phase1/recorder.ts'
import { renderVerification } from '../src/phase1/development.ts'
import { classifyPreflight } from '../src/phase1/p10-report.ts'

const roots: string[] = [], contexts: Context[] = [], runners: VerificationRunner[] = []
const fixtures: DeterministicEdaOutput[] = []
const versionFixtures: ManagedVersionProbeFixture[] = []
let witness: TargetWitness | undefined
const operationScope = installTestOperationScope()
afterEach(async () => {
  const scope = operationScope()
  try {
    await scope.cleanup(async () => {
      for (const owner of runners) await owner.close()
      for (const fixture of fixtures) await fixture.close()
      for (const fixture of versionFixtures) await fixture.close()
      for (const ctx of contexts) await ctx.fiber.dispose()
    }, async () => {
      if (await witness?.capture(scope, roots)) return
      if (scope.bodyErrors().length) {
        console.error('Retained failed test roots', JSON.stringify({ roots, bodyErrors: scope.bodyErrors() }))
        return
      }
      for (const root of roots) await rm(root, { recursive: true, force: true })
    })
    runners.length = 0; contexts.length = 0; roots.length = 0; fixtures.length = 0; versionFixtures.length = 0; witness = undefined
  } catch (error) {
    console.error('Test cleanup failed; roots retained', JSON.stringify({ roots, scope_id: scope.id, pending: scope.pendingOperations, bodyErrors: scope.bodyErrors(), error: String(error) }))
    throw error
  } finally { vi.restoreAllMocks() }
})

async function setup(options = {}, limits = {}, rawVerdict?: string, isolateVersionProbes = false, observeNative?: (spec: SubprocessSpawnSpec, handle: SubprocessHandle) => void) {
  const root = await mkdtemp(join(tmpdir(), 'phase1-verification-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root
  config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  config.limits = { ...config.limits, timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192 }
  const runner = operationScope().own(new VerificationRunner(ctx.subprocess, config, { compileMs: 5000, elaborateMs: 5000, simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 20, maxEventBytes: 65536, ...limits }), ['registerFixture', 'registerReviewedCounter', 'registerDataset', 'verify', 'preflightDataset']); runners.push(runner)
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const prefix = [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify(options)]
  const fixture = rawVerdict === undefined ? undefined : new DeterministicEdaOutput(prefix, rawVerdict)
  if (fixture) fixtures.push(fixture)
  const versionFixture = isolateVersionProbes ? new ManagedVersionProbeFixture(spawn, [...prefix, '-version'], { stdout: 'Vivado Simulator v2026.1\n', stderr: '', exitCode: 0 }) : undefined
  if (versionFixture) versionFixtures.push(versionFixture)
  const spy = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => {
    const mapped = { ...spec, argv: [...prefix, ...spec.argv.slice(1)] }
    witness?.record('subprocess_call_start', { argv: mapped.argv, cwd: mapped.cwd })
    const handle = versionFixture ? versionFixture.spawn(mapped) : fixture ? fixture.spawn(mapped) : spawn(mapped)
    const observed = operationScope().observeManaged(witness ? witness.observe(mapped, handle, versionFixture?.calls.at(-1)?.kind === 'VERSION_FIXTURE' ? 'LOGICAL_VERSION' : fixture ? 'LOGICAL_OUTPUT' : 'NATIVE') : handle)
    observeNative?.(mapped, observed)
    return observed
  })
  const register = (fixture: FixtureId = 'counter') => runner.registerFixture(fixture, { experiment_id: 'mock' as PhaseId, task_id: fixture as PhaseId, sample_id: 0, mode: 'agent' })
  return { root, ctx, runner, spy, register }
}
const unconfined = (argv: readonly string[]) => argv
const mixedEvaluation = { top: 'counter', tbTop: 'tb', sources: [{ path: 'rtl/solution.v', role: 'dut' as const }, { path: 'trusted/ref.sv', role: 'reference' as const }, { path: 'trusted/tb.v', role: 'testbench' as const }], evaluatorId: 'mock', seed: 1, datasetRevision: 'mock' }
const mixedAssets = { 'rtl/solution.v': 'module counter; endmodule', 'trusted/ref.sv': 'module reference; endmodule', 'trusted/tb.v': 'module tb; endmodule', 'trusted/clock.xdc': '' }
const identity = { experiment_id: 'mock' as PhaseId, task_id: 'mixed' as PhaseId, sample_id: 0, mode: 'agent' as const }

it('rejects a 2025.2 tool or evaluator when configured for 2026.1', async () => {
  const s = await setup({ actualVersion: '2025.2' })
  await expect(s.runner.registerDataset(mixedAssets, { ...mixedEvaluation, compatibility: { vivado_version: '2025.2' } }, identity)).rejects.toThrow('Evaluator Vivado version')
  const result = await s.runner.verify(await s.register(), new AbortController().signal, unconfined)
  expect(result.stages[0]!.status).not.toBe('PASS')
  expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
  expect(s.spy.mock.calls.every(([spec]) => spec.argv.includes('-version'))).toBe(true)
})

it('records an evaluator-specific default without overriding source timescales', async () => {
  witness = new TargetWitness('F03-A1')
  const s = await setup({ verdict: 'Mismatches: 0 in 20 samples' }, {}, undefined, true)
  const evaluation = { ...mixedEvaluation, defaultTimescale: '1ps/1ps' as const, compatibility: { original_tb_sha256: 'original', effective_tb_sha256: 'derived' } }
  const result = await s.runner.preflightDataset(await s.runner.registerDataset(mixedAssets, evaluation, identity), new AbortController().signal, unconfined)
  const elaborate = result.stages[1]!.invocations![0]!
  expect(elaborate.args).toContain('-timescale')
  expect(elaborate.args).toContain('1ps/1ps')
  expect(elaborate.args.join(' ')).not.toContain('override')
  const files = await readdir(result.artifacts)
  const snapshot = files.find(name => name.startsWith('snapshot-'))!
  const manifest = JSON.parse(await readFile(join(result.artifacts, snapshot, 'manifest.json'), 'utf8'))
  expect(manifest.evaluation).toEqual(evaluation)
  expect(result.stages[0]!.verification_key).toMatch(/^sha256:/)
})

it('preflights a dataset through simulation without synthesis or a candidate PASS', async () => {
  witness = new TargetWitness('F03-A2')
  const s = await setup({ verdict: 'Mismatches: 0 in 20 samples' }, {}, undefined, true)
  const id = await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity)
  const result = await s.runner.preflightDataset(id, new AbortController().signal, unconfined)
  expect(result.stages.map(stage => stage.status)).toEqual(['PASS', 'PASS', 'PASS', 'SKIPPED'])
  expect(classifyPreflight(result)).toEqual({ status: 'EVALUATOR_READY', blocked_stage: null })
  const record = JSON.parse(await readFile(join(result.artifacts, 'result.json'), 'utf8'))
  expect(record).toMatchObject({ final_verified: false, final_status: 'INCONCLUSIVE', model_requests_total: 0 })
  expect(parseRecord('RunResult', record)).toEqual(record)
  expect(s.spy.mock.calls.every(([spec]) => !spec.argv.includes('-mode'))).toBe(true)
  await expect(s.runner.verify(id, new AbortController().signal, unconfined)).rejects.toThrow('consumed')
})

it('rejects non-dataset preflight and attributes original testbench compile errors', async () => {
  const s = await setup({ error: 'compile', trustedError: true })
  await expect(s.runner.preflightDataset(await s.register(), new AbortController().signal, unconfined)).rejects.toThrow('registered dataset')
  const assets = { ...mixedAssets, 'trusted/tb.sv': mixedAssets['trusted/tb.v'] }
  const evaluation = { ...mixedEvaluation, sources: mixedEvaluation.sources.map(source => source.role === 'testbench' ? { ...source, path: 'trusted/tb.sv' } : source) }
  const result = await s.runner.preflightDataset(await s.runner.registerDataset(assets, evaluation, identity), new AbortController().signal, unconfined)
  expect(classifyPreflight(result)).toEqual({ status: 'TESTBENCH_COMPATIBILITY_BLOCKED', blocked_stage: 'compile' })
  expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
})

it.each(['Mismatches: 0 in 0 samples', 'Mismatches: 2 in 20 samples'])('does not mark an unhealthy evaluator ready: %s', async verdict => {
  witness = new TargetWitness('B2-' + (verdict.includes('0 in 0') ? 'zero' : 'mismatch'))
  const s = await setup({ verdict }, {}, verdict)
  const result = await s.runner.preflightDataset(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), new AbortController().signal, unconfined)
  expect(classifyPreflight(result).status).toBe('INCONCLUSIVE')
  witness.record('readiness_parser_settled', { verdict, classification: classifyPreflight(result), status: result.status, artifacts: result.artifacts, stages: result.stages })
  expect(result.stages[3]!.status).toBe('SKIPPED')
})

it('records ordered mixed invocations, skips downstream stages after a group fails and reads 1.3 evidence', async () => {
  const s = await setup({ errorGroup: 2 })
  const id = await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity)
  const result = await s.runner.verify(id, new AbortController().signal, unconfined)
  const compile = result.stages[0]!
  const groups = compile.invocations!.filter(value => value.label.startsWith('compile-'))
  expect(groups.map(value => value.systemverilog_mode)).toEqual([false, true])
  expect(groups[0]!.args).not.toContain('-sv'); expect(groups[1]!.args[0]).toBe('-sv')
  expect(groups.map(value => value.sources[0]!.role)).toEqual(['dut', 'reference'])
  expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
  expect(parseRecord('StageResult', compile)).toEqual(compile)
  expect(() => parseRecord('StageResult', { ...compile, processes: [] })).toThrow('disagree')
})

it('completes all mixed groups in order without adding sv flags to elaboration or simulation', async () => {
  witness = new TargetWitness('F03-A3')
  const s = await setup({ verdict: 'Mismatches: 0 in 20 samples' }, {}, undefined, true)
  const result = await s.runner.verify(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), new AbortController().signal, unconfined)
  expect(result.status).toBe('PASS')
  const groups = result.stages[0]!.invocations!.filter(value => value.label.startsWith('compile-'))
  expect(groups.map(value => value.systemverilog_mode)).toEqual([false, true, false])
  expect(groups.flatMap(value => value.sources.map(source => source.role))).toEqual(['dut', 'reference', 'testbench'])
  for (const stage of result.stages.slice(1, 3)) expect(stage.invocations![0]!.args).not.toContain('-sv')
  expect(result.stages[2]!.invocations![0]!.args).toContain('-sv_seed')
  expect(result.stages[3]!.invocations![0]!.sources.map(source => source.role)).toEqual(['dut'])
})

it('preserves informational version exit 1 without accepting exit 1 from an actual compiler', async () => {
  const s = await setup({ versionExit: 1 })
  const result = await s.runner.verify(await s.register(), new AbortController().signal, unconfined)
  expect(result.status).toBe('PASS')
  expect(result.stages[0]!.invocations!.slice(0, 4).every(value => value.version_matches && value.process.exit_code === 1)).toBe(true)
  const forged = structuredClone(result.stages[0]!)
  forged.invocations!.at(-1)!.version_matches = true
  expect(() => parseRecord('StageResult', forged)).toThrow()
})

it('keeps completed synthesis invocation evidence when report policy rejects the next launch', async () => {
  const s = await setup()
  const result = await s.runner.verify(await s.register(), new AbortController().signal, argv => {
    if (argv.some(arg => /report\.tcl$/.test(arg))) throw new Error('Sandbox policy rejected report')
    return argv
  })
  expect(result.status).toBe('TOOL_ERROR')
  expect(result.stages[3]!.invocations!.map(value => value.label)).toEqual(['synthesis'])
  expect(result.stages[3]!.processes[0]!.exit_code).toBe(0)
})

it('binds source order and mode to manifests and rejects mutated execution metadata', async () => {
  const s = await setup()
  const original = await createDatasetSnapshot(s.root, mixedAssets, mixedEvaluation, snapshotEnvironment)
  const changed = await createDatasetSnapshot(s.root, mixedAssets, { ...mixedEvaluation, language: 'systemverilog' }, snapshotEnvironment)
  const reordered = await createDatasetSnapshot(s.root, mixedAssets, { ...mixedEvaluation, sources: [...mixedEvaluation.sources].reverse() }, snapshotEnvironment)
  expect(original.sources.map(source => source.language)).not.toEqual(changed.sources.map(source => source.language))
  expect(original.sources.map(source => source.path)).not.toEqual(reordered.sources.map(source => source.path))
  original.sources.reverse()
  await expect(checkSnapshot(original)).rejects.toThrow('execution configuration changed')
})

it('shares the compile deadline across version probes and multiple groups', async () => {
  const s = await setup({ compileDelay: 500 }, { compileMs: 1400 })
  const result = await s.runner.verify(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), new AbortController().signal, unconfined)
  expect(result.status).toBe('TIMEOUT')
  expect(result.stages[0]!.invocations!.filter(value => value.label.startsWith('compile-')).length).toBeLessThan(3)
  expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
})

it('cancels a mixed compile group, joins its tree, then accepts the next snapshot', async () => {
  witness = new TargetWitness('F03-A4')
  const s = await setup({ hangGroup: 2 }, {}, undefined, true)
  const control = new AbortController()
  const pending = s.runner.verify(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), control.signal, unconfined)
  let run = ''
  await waitForBoundTarget(async () => {
    const name = (await readdir(s.root))[0]
    if (name === undefined) return false
    run = join(s.root, name)
    const file = join(run, 'child.pid')
    let text: string
    try { text = await readFile(file, 'utf8') }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT' && (error as NodeJS.ErrnoException).path === file) return false; throw error }
    expect(text).toMatch(/^\d+$/)
    witness!.record('mixed_child_ready', { run, pid: Number(text) })
    return true
  }, listener => {
    let listening = true
    void pending.then(result => {
      witness?.record('mixed_verification_terminal', { status: result.status, artifacts: result.artifacts, stages: result.stages })
      if (listening) listener(result.status === 'PASS' ? 0 : 1)
    }, (error: unknown) => { witness?.record('mixed_verification_error', { error: String(error) }); if (listening) listener(1) })
    return () => { listening = false }
  }, () => {}, 10000, 50)
  control.abort()
  expect((await pending).status).toBe('ABORTED')
  const pid = Number(await readFile(join(run, 'child.pid'), 'utf8'))
  expect(() => process.kill(pid, 0)).toThrow()
  const next = await s.runner.verify(await s.register('syntax'), new AbortController().signal, unconfined)
  expect(next.stages[0]!.status).toBe('FAIL')
})

it.each(fixtureIds)('records %s fixture stages and stops at its first failure', async fixture => {
  const s = await setup()
  const id = await s.register(fixture)
  const result = await s.runner.verify(id, new AbortController().signal, unconfined)
  expect(result.stages.find(row => row.status !== 'PASS')?.stage ?? null).toBe(expectedStage[fixture])
  expect(result.status).toBe(expectedStage[fixture] === null ? 'PASS' : 'FAIL')
  const index = result.stages.findIndex(row => row.status !== 'PASS')
  if (index >= 0) expect(result.stages.slice(index + 1).every(row => row.status === 'SKIPPED')).toBe(true)
  expect((await inspectRun(result.artifacts)).state).toBe('TERMINAL')
  await expect(s.runner.verify(id, new AbortController().signal, unconfined)).rejects.toThrow('consumed')
  if (fixture === 'syntax') {
    const stable = { ...result, artifacts: '<run>', stages: result.stages.map(stage => ({ ...stage, errors: stage.errors.map(error => ({ ...error, file: error.file ? '<snapshot>/rtl/solution.sv' : null })), duration_ms: 0, processes: stage.processes.map(process => ({ ...process, duration_ms: 0 })) })) }
    expect(renderVerification(stable)).toMatchSnapshot()
  }
  if (fixture === 'functional') {
    const stage = result.stages[2]!
    expect(stage).toMatchObject({ status: 'FAIL', failure_domain: 'design', exit_code: 0, evidence: { test_completed: true, checks_executed: 20, mismatch_count: 19 },
      errors: [{ category: 'functional_mismatch', origin: 'unknown', attribution: 'UNKNOWN', file: null, line: null, repairable_by_model: false }] })
    expect(stage.errors[0]!.message).toContain('19 of 20 checks failed')
    const stable = { ...result, artifacts: '<run>', stages: result.stages.map(stage => ({ ...stage, duration_ms: 0, processes: stage.processes.map(process => ({ ...process, duration_ms: 0 })) })) }
    expect(renderVerification(stable)).toMatchSnapshot()
  }
})

it.each(['PASS', 'PHASE1_COMPLETE checks=0 mismatches=0', 'PHASE1_COMPLETE checks=2 mismatches=1', 'PHASE1_COMPLETE checks=2 mismatches=0\nPHASE1_COMPLETE checks=2 mismatches=0'])('does not accept %s as successful evidence', async verdict => {
  const s = await setup({ verdict })
  const result = await s.runner.verify(await s.register(), new AbortController().signal, unconfined)
  expect(result.stages[2]?.status).not.toBe('PASS'); expect(result.stages[3]?.status).toBe('SKIPPED')
})

it.each([
  'PHASE1_COMPLETE checks=2 mismatches=1\nPHASE1_COMPLETE checks=2 mismatches=1',
  'PHASE1_COMPLETE checks=2 mismatches=1\nFatal: evaluation stopped',
  'PHASE1_COMPLETE checks=0 mismatches=1',
  'PHASE1_COMPLETE checks=2 mismatches=3',
])('does not misclassify incomplete evidence as a functional mismatch: %s', async verdict => {
  const s = await setup({ verdict })
  const result = await s.runner.verify(await s.register(), new AbortController().signal, unconfined)
  expect(result.stages[2]).toMatchObject({ status: 'INCONCLUSIVE', failure_domain: 'unknown', evidence: { test_completed: false },
    errors: [{ category: 'simulation_evidence', attribution: 'UNKNOWN', repairable_by_model: false }] })
  expect(result.stages[3]!.status).toBe('SKIPPED')
})

it('reports dataset mismatch counts without inventing source locations', async () => {
  witness = new TargetWitness('F03-A5')
  const s = await setup({ verdict: 'Mismatches: 18 in 20 samples' }, {}, undefined, true)
  const result = await s.runner.verify(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), new AbortController().signal, unconfined)
  expect(result.stages[2]).toMatchObject({ status: 'FAIL', failure_domain: 'design',
    errors: [{ category: 'functional_mismatch', file: null, line: null, message_id: null, attribution: 'UNKNOWN', repairable_by_model: false }] })
  expect(result.stages[2]!.errors[0]!.message).toContain('18 of 20 checks failed')
  expect(result.stages[3]!.status).toBe('SKIPPED')
})

it('rejects unknown ids and sandbox denial without spawning any process', async () => {
  const s = await setup()
  await expect(s.runner.verify('../evil', new AbortController().signal, unconfined)).rejects.toThrow('Unknown')
  const result = await s.runner.verify(await s.register(), new AbortController().signal, () => { throw new Error('Partial sandbox refused') })
  expect(result.stages[0]).toMatchObject({ status: 'TOOL_ERROR', failure_domain: 'policy' }); expect(s.spy).not.toHaveBeenCalled()
})

it('bounds version probes inside the compile and total wall-clock budgets', async () => {
  for (const limits of [{ compileMs: 1 }, { totalMs: 1 }]) {
    const s = await setup({}, limits)
    const result = await s.runner.verify(await s.register(), new AbortController().signal, unconfined)
    expect(result.status).toBe('TIMEOUT')
    expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
  }
})

it.each([{ error: 'compile', zeroError: true }, { error: 'report' }, { missingNetlist: true }, { tamper: 'compile' }, { noise: 'simulation' }, { artifact: 'simulation' }])('does not return PASS for %j', async options => {
  const s = await setup(options, { maxArtifactBytes: 100000 })
  const result = await s.runner.verify(await s.register(), new AbortController().signal, unconfined)
  expect(result.status).not.toBe('PASS')
  if (options.tamper) expect(result.stages[0]?.failure_domain).toBe('policy')
  if (options.noise) expect(result.stages[2]?.processes[0]?.log_truncated).toBe(true)
  if (options.artifact) expect(result.stages[2]?.failure_domain).toBe('resource')
})

it.each(['timeout', 'cancel'] as const)('joins the child process tree on %s before allowing another task', async mode => {
  witness = new TargetWitness('S3-CHILD-' + mode)
  const scope = operationScope(), simulationMs = mode === 'timeout' ? 600 : 5000
  const control = new AbortController(), terminal = Promise.withResolvers<number>()
  let simulation: { spec: SubprocessSpawnSpec; handle: SubprocessHandle; command: number; run: string; abortAt: number | undefined; aborted: () => void } | undefined
  const s = await setup({ hang: 'simulation', fastSimulationHang: true, readinessId: scope.id }, { simulationMs }, undefined, false, (spec, handle) => {
    if (!spec.argv.includes('-tclbatch')) return
    expect(simulation).toBeUndefined(); expect(basename(spec.cwd!)).toBe('build')
    const run = dirname(spec.cwd!); expect(dirname(run)).toBe(s.root)
    const command = witness!.liveSimulation(spec.cwd!)!.command
    const binding = { spec, handle, command, run, abortAt: undefined as number | undefined, aborted: () => {
      binding.abortAt = Date.now()
      witness!.record('child_simulation_abort', { command, scope_id: scope.id, run, at_ms: binding.abortAt, reason: String(spec.signal?.reason) })
    } }
    simulation = binding; spec.signal!.addEventListener('abort', binding.aborted, { once: true })
    witness!.record('child_simulation_dispatched', { command, scope_id: scope.id, run, cwd: spec.cwd, argv: spec.argv, simulation_ms: simulationMs })
  })
  const id = await s.register()
  let pending: Promise<VerificationResult> | undefined, settled: Promise<void> | undefined
  const notifications: Promise<void>[] = []
  const ready = async () => {
    const binding = simulation
    if (!binding) return false
    const path = join(binding.run, 'child-ready.json')
    let text: string
    try { text = await readFile(path, 'utf8') }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT' && (error as NodeJS.ErrnoException).path === path) return false; throw error }
    const value = JSON.parse(text) as { schema_version: string; readiness_id: string; run: string; cwd: string; argv: string[]; parent_pid: number; child_pid: number; child_ready_at_ms: number; pid_published_at_ms: number }
    expect(value).toMatchObject({ schema_version: 'native-child-ready-1', readiness_id: scope.id, run: binding.run, cwd: binding.spec.cwd, argv: binding.spec.argv.slice(3) })
    expect(Number.isSafeInteger(value.child_pid) && value.child_pid > 0).toBe(true)
    expect(Number.isSafeInteger(value.parent_pid) && value.parent_pid > 0 && value.parent_pid !== value.child_pid).toBe(true)
    const pid = await readFile(join(binding.run, 'child.pid'), 'utf8'); expect(pid).toMatch(/^\d+$/); expect(Number(pid)).toBe(value.child_pid)
    const events = (await readFile(join(binding.run, 'events.jsonl'), 'utf8')).trim().split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line) as { type: string; timestamp: string; value: { stage?: string } | null })
    const started = events.filter(event => event.type === 'stage_started' && event.value?.stage === 'simulation')
    expect(started).toHaveLength(1)
    const stageStartedAt = Date.parse(started[0]!.timestamp)
    expect(value.child_ready_at_ms - stageStartedAt).toBeGreaterThanOrEqual(0)
    expect(value.pid_published_at_ms - stageStartedAt).toBeLessThan(simulationMs)
    expect(value.child_ready_at_ms).toBeLessThanOrEqual(value.pid_published_at_ms)
    if (binding.abortAt !== undefined) expect(value.pid_published_at_ms).toBeLessThan(binding.abortAt)
    witness!.record('child_native_ready', { command: binding.command, scope_id: scope.id, receipt: value, stage_started_at_ms: stageStartedAt, simulation_ms: simulationMs,
      observed_signal_aborted: binding.spec.signal!.aborted, producer_clock: 'same-host Date.now; worker hrtime clocks not subtracted' })
    return true
  }
  try {
    await scope.track('native child readiness', () => waitForChildReadiness(ready, listener => {
      let listening = true
      notifications.push(terminal.promise.then(code => { if (listening) listener(code) }))
      return () => { listening = false }
    }, () => {
      witness!.record('child_verification_started', { scope_id: scope.id, snapshot_id: id, simulation_ms: simulationMs })
      pending = s.runner.verify(id, control.signal, unconfined)
      settled = pending.then(result => {
        witness!.record('child_verification_terminal', { scope_id: scope.id, status: result.status, artifacts: result.artifacts, stages: result.stages })
        terminal.resolve(result.status === 'PASS' ? 0 : 1)
      }, (error: unknown) => { witness!.record('child_verification_error', { scope_id: scope.id, error: String(error) }); terminal.resolve(1) })
    }, 10000, 30))
    if (mode === 'cancel') { witness!.record('child_caller_cancel', { scope_id: scope.id }); control.abort() }
    const result = await pending!
    expect(result.status).toBe(mode === 'timeout' ? 'TIMEOUT' : 'ABORTED')
    expect(result.artifacts).toBe(simulation!.run)
    expect(await simulation!.handle.waitForExit()).toBe(true)
    witness!.record('child_native_range_proven', { scope_id: scope.id, command: simulation!.command, run: result.artifacts, wait_for_exit: true,
      original_scope_proof: 'FIX07_SCOPE_AUDIT managed_ranges; command and scope IDs are observer identities' })
    const pid = Number(await readFile(join(result.artifacts, 'child.pid'), 'utf8'))
    expect(() => process.kill(pid, 0)).toThrow()
    const next = await s.runner.verify(await s.register('syntax'), new AbortController().signal, unconfined)
    expect(next.stages[0]?.status).toBe('FAIL')
  } catch (error) {
    control.abort(); terminal.resolve(1)
    await settled
    throw error
  } finally {
    await settled; await Promise.all(notifications)
    if (simulation) simulation.spec.signal!.removeEventListener('abort', simulation.aborted)
  }
})

it('detects changed assets, traversal, ADS, junction escapes and forged manifests', async () => {
  const s = await setup()
  const snapshot = await createSnapshot(s.root, 'counter', snapshotEnvironment)
  await checkSnapshot(snapshot)
  for (const path of ['../other', 'rtl/solution.sv:secret', 'D:/other', 'rtl/../../other']) await expect(checkedFile(snapshot.directory, path)).rejects.toThrow()
  await writeFile(join(snapshot.directory, 'trusted/tb.sv'), 'changed')
  await expect(checkSnapshot(snapshot)).rejects.toThrow('changed')
  await symlink(s.root, join(snapshot.directory, 'escape'), process.platform === 'win32' ? 'junction' : 'dir')
  await expect(checkedFile(snapshot.directory, 'escape/file')).rejects.toThrow('Linked')
  await writeFile(join(snapshot.directory, 'manifest.json'), '{}')
  await expect(checkSnapshot(snapshot)).rejects.toThrow('manifest')
})

it('does not accept unsafe counts or a fatal even alongside a valid completion marker', () => {
  const evidence = new SimulationEvidence()
  evidence.accept('PHASE1_COMPLETE checks=99999999999999999999999 mismatches=0'); expect(evidence.checks).toBeNull(); expect(evidence.passed).toBe(false)
  const fatal = new SimulationEvidence(); fatal.accept('PHASE1_COMPLETE checks=20 mismatches=0'); fatal.accept('Fatal: design failed'); expect(fatal.passed).toBe(false)
})
