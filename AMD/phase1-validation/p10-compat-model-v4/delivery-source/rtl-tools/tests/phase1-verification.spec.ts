import { mkdtemp, readdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { afterEach, expect, it, vi } from 'vitest'
import { VerificationRunner, SimulationEvidence } from '../src/phase1/verification.ts'
import { checkedFile, checkSnapshot, createSnapshot, createDatasetSnapshot } from '../src/phase1/snapshots.ts'
import { parseRecord } from '../src/phase1/records.ts'
import { fixtureIds, expectedStage, type FixtureId } from '../src/phase1/fixtures.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'
import { inspectRun } from '../src/phase1/recorder.ts'
import { renderVerification } from '../src/phase1/development.ts'
import { classifyPreflight } from '../src/phase1/p10-report.ts'

const roots: string[] = [], contexts: Context[] = [], runners: VerificationRunner[] = []
afterEach(async () => {
  for (const runner of runners.splice(0)) await runner.close()
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})

async function setup(options = {}, limits = {}) {
  const root = await mkdtemp(join(tmpdir(), 'phase1-verification-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root
  config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  config.limits = { ...config.limits, timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192 }
  const runner = new VerificationRunner(ctx.subprocess, config, { compileMs: 5000, elaborateMs: 5000, simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 20, maxEventBytes: 65536, ...limits }); runners.push(runner)
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const spy = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify(options), ...spec.argv.slice(1)] }))
  const register = (fixture: FixtureId = 'counter') => runner.registerFixture(fixture, { experiment_id: 'mock' as PhaseId, task_id: fixture as PhaseId, sample_id: 0, mode: 'agent' })
  return { root, ctx, runner, spy, register }
}
const unconfined = (argv: readonly string[]) => argv
const mixedEvaluation = { top: 'counter', tbTop: 'tb', sources: [{ path: 'rtl/solution.v', role: 'dut' as const }, { path: 'trusted/ref.sv', role: 'reference' as const }, { path: 'trusted/tb.v', role: 'testbench' as const }], evaluatorId: 'mock', seed: 1, datasetRevision: 'mock' }
const mixedAssets = { 'rtl/solution.v': 'module counter; endmodule', 'trusted/ref.sv': 'module reference; endmodule', 'trusted/tb.v': 'module tb; endmodule', 'trusted/clock.xdc': '' }
const identity = { experiment_id: 'mock' as PhaseId, task_id: 'mixed' as PhaseId, sample_id: 0, mode: 'agent' as const }

it('records an evaluator-specific default without overriding source timescales', async () => {
  const s = await setup({ verdict: 'Mismatches: 0 in 20 samples' })
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
  const s = await setup({ verdict: 'Mismatches: 0 in 20 samples' })
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
  const s = await setup({ verdict })
  const result = await s.runner.preflightDataset(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), new AbortController().signal, unconfined)
  expect(classifyPreflight(result).status).toBe('INCONCLUSIVE')
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
  const s = await setup({ verdict: 'Mismatches: 0 in 20 samples' })
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
  const original = await createDatasetSnapshot(s.root, mixedAssets, mixedEvaluation)
  const changed = await createDatasetSnapshot(s.root, mixedAssets, { ...mixedEvaluation, language: 'systemverilog' })
  const reordered = await createDatasetSnapshot(s.root, mixedAssets, { ...mixedEvaluation, sources: [...mixedEvaluation.sources].reverse() })
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
  const s = await setup({ hangGroup: 2 })
  const control = new AbortController()
  const pending = s.runner.verify(await s.runner.registerDataset(mixedAssets, mixedEvaluation, identity), control.signal, unconfined)
  let run = ''
  await vi.waitFor(async () => { run = join(s.root, (await readdir(s.root))[0]!); expect(await readFile(join(run, 'child.pid'), 'utf8')).toMatch(/^\d+$/) }, { timeout: 10000 })
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
  const s = await setup({ verdict: 'Mismatches: 18 in 20 samples' })
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
  const s = await setup({ hang: 'simulation' }, { simulationMs: mode === 'timeout' ? 600 : 5000 })
  const control = new AbortController()
  const pending = s.runner.verify(await s.register(), control.signal, unconfined)
  let run: string | undefined
  await vi.waitFor(async () => {
    run = join(s.root, (await readdir(s.root))[0]!)
    expect(await readFile(join(run, 'child.pid'), 'utf8')).toMatch(/^\d+$/)
  }, { timeout: 10000, interval: 30 })
  if (mode === 'cancel') control.abort()
  const result = await pending
  expect(result.status).toBe(mode === 'timeout' ? 'TIMEOUT' : 'ABORTED')
  const pid = Number(await readFile(join(run!, 'child.pid'), 'utf8'))
  expect(() => process.kill(pid, 0)).toThrow()
  const next = await s.runner.verify(await s.register('syntax'), new AbortController().signal, unconfined)
  expect(next.stages[0]?.status).toBe('FAIL')
})

it('detects changed assets, traversal, ADS, junction escapes and forged manifests', async () => {
  const s = await setup()
  const snapshot = await createSnapshot(s.root, 'counter')
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
