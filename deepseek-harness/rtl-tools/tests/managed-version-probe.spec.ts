/** Local version fixtures retain parsing and lifecycle checks; native stages keep their original provider. */
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import type { SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'
import { afterEach, expect, it, vi } from 'vitest'
import { ManagedVersionProbeFixture, type VersionProbeResponse } from './helpers/managed-version-probe-fixture.ts'
import { installTestOperationScope } from './test-operation-scope.ts'
import { runCommand } from '../src/process.ts'
import { readDoctorConfig, versionFact, type Probe } from '../src/phase1/doctor.ts'
import { VerificationRunner } from '../src/phase1/verification.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'

const fake = fileURLToPath(new URL('./fake-verification.mjs', import.meta.url))
const versionArgv = [process.execPath, fake, '{}', '-version']
const response: VersionProbeResponse = { stdout: 'Vivado Simulator v2026.1\n', stderr: '', exitCode: 0 }
const fixtures: ManagedVersionProbeFixture[] = [], contexts: Context[] = [], roots: string[] = [], runners: VerificationRunner[] = []
const operationScope = installTestOperationScope()
afterEach(async () => {
  const scope = operationScope()
  await scope.cleanup(async () => {
    for (const runner of runners) await runner.close()
    for (const fixture of fixtures) await fixture.close()
    for (const ctx of contexts) await ctx.fiber.dispose()
    if (fixtures.length && process.env.FIX07_SCOPE_AUDIT) await writeFile(join(process.env.FIX07_SCOPE_AUDIT, `${scope.id}-version-probes.json`), JSON.stringify({ scope_id: scope.id, evidence_kind: 'TEST_FIXTURE_LOGICAL_IDENTITIES_NO_OS_PROOF', fixtures: fixtures.map(fixture => fixture.calls) }) + '\n', { flag: 'wx' })
  }, async () => {
    if (scope.bodyErrors().length) { console.error('Retained failed test roots', JSON.stringify({ roots, bodyErrors: scope.bodyErrors() })); return }
    for (const root of roots) await rm(root, { recursive: true, force: true })
  })
  fixtures.length = 0; contexts.length = 0; roots.length = 0; runners.length = 0
  vi.restoreAllMocks()
})

function request(signal?: AbortSignal): SubprocessSpawnSpec {
  return { argv: versionArgv, cwd: tmpdir(), graceMs: 100, stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' }, env: { NO_COLOR: '1' }, signal }
}
function fixture(data = response) {
  const native = vi.fn((_spec: SubprocessSpawnSpec) => { throw new Error('Native delegation observed') })
  const owner = new ManagedVersionProbeFixture(native, versionArgv, data); fixtures.push(owner)
  return { owner, native }
}
async function output(stream: NodeJS.ReadableStream): Promise<string> {
  let text = ''
  for await (const chunk of stream) text += String(chunk)
  return text
}
async function setup(data = response, options = {}, limits = {}) {
  const root = await mkdtemp(join(tmpdir(), 'version-probe-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root; config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  config.limits = { ...config.limits, timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192 }
  const native = ctx.subprocess.spawn.bind(ctx.subprocess), prefix = [process.execPath, fake, JSON.stringify(options)]
  const owner = new ManagedVersionProbeFixture(native, [...prefix, '-version'], data); fixtures.push(owner)
  vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => operationScope().observeManaged(owner.spawn({ ...spec, argv: [...prefix, ...spec.argv.slice(1)] })))
  const runner = operationScope().own(new VerificationRunner(ctx.subprocess, config, { compileMs: 5000, elaborateMs: 5000, simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 20, maxEventBytes: 65536, ...limits }), ['registerFixture', 'verify']); runners.push(runner)
  return { root, ctx, owner, runner, register: () => runner.registerFixture('counter', { experiment_id: 'version-fixture' as PhaseId, task_id: 'counter' as PhaseId, sample_id: 0, mode: 'agent' }) }
}

it('buffers complete stdout and stderr before consumers attach and settles asynchronously', async () => {
  const { owner, native } = fixture({ stdout: 'banner\n\tstdout', stderr: 'stderr\n', exitCode: 1 })
  const handle = owner.spawn(request())
  expect(owner.calls[0]!.settled).toBe(false)
  await expect(handle.done).resolves.toEqual({ exitCode: 1, signal: null })
  expect(await output(handle.stdout!)).toBe('banner\n\tstdout')
  expect(await output(handle.stderr!)).toBe('stderr\n')
  expect(await handle.waitForExit()).toBe(true)
  expect(handle.stdin).toBeUndefined(); expect(handle.collected).toEqual({})
  expect(Object.hasOwn(handle, 'pid')).toBe(false); expect(native).not.toHaveBeenCalled()
})
it('records every probe without caching and isolates fixture instances', async () => {
  const a = fixture(), b = fixture()
  for (let i = 0; i < 8; i++) await a.owner.spawn(request()).done
  await b.owner.spawn(request()).done
  expect(a.owner.calls).toHaveLength(8); expect(b.owner.calls).toHaveLength(1)
  expect(new Set(a.owner.calls.map(call => call.identity)).size).toBe(8)
  expect(a.owner.calls.every(call => call.kind === 'VERSION_FIXTURE' && call.settled && call.outcome?.exitCode === 0)).toBe(true)
})
it('rejects pre-aborted requests before publishing a successful handle', () => {
  const { owner } = fixture(), control = new AbortController(); control.abort(new Error('pre-abort'))
  expect(() => owner.spawn(request(control.signal))).toThrow('pre-abort')
  expect(owner.calls[0]).toMatchObject({ settled: true, error: 'Error: pre-abort' })
  expect(owner.calls[0]!.outcome).toBeUndefined()
})
it('settles cancellation before queued completion with closed empty output and joined ownership', async () => {
  const { owner } = fixture(), control = new AbortController(), handle = owner.spawn(request(control.signal))
  const waiting = handle.waitForExit(); control.abort(); control.abort(); handle.terminate(); handle.terminate()
  await expect(handle.done).resolves.toEqual({ exitCode: null, signal: 'SIGTERM' })
  await expect(waiting).resolves.toBe(true)
  expect(await output(handle.stdout!)).toBe(''); expect(await output(handle.stderr!)).toBe('')
  expect(owner.calls[0]!.settled).toBe(true)
})
it('bounds a pending range wait without leaking cancellation into normal completion', async () => {
  const { owner } = fixture(), handle = owner.spawn(request()), control = new AbortController()
  const waiting = handle.waitForExit(control.signal); control.abort()
  await expect(waiting).resolves.toBe(false)
  await expect(handle.done).resolves.toEqual({ exitCode: 0, signal: null })
  expect(await handle.waitForExit(control.signal)).toBe(true)
})
it('releases repeated close and terminate operations without late calls or unfinished streams', async () => {
  const { owner } = fixture(), handle = owner.spawn(request()), first = owner.close()
  expect(owner.close()).toBe(first); handle.terminate(); await first; await owner.close()
  expect(handle.stdout!.destroyed).toBe(true); expect(handle.stderr!.destroyed).toBe(true)
  expect(await handle.waitForExit()).toBe(true); expect(owner.calls.every(call => call.settled)).toBe(true)
  expect(() => owner.spawn(request())).toThrow('closed')
})
it.each([
  [process.execPath, fake, '{}', '-version', 'extra'],
  [process.execPath, fake, '{}', '--version'],
  [process.execPath, fake, '{}', '-mode', 'batch', '-source', 'version.tcl'],
  [process.execPath, fake + '.other', '{}', '-version'],
  [process.execPath, fake, '{"actualVersion":"2025.2"}', '-version'],
].map(argv => ({ argv })))('delegates the original spec for nonexact version-looking argv %j', ({ argv }) => {
  const { owner, native } = fixture(), spec = { ...request(), argv }
  expect(() => owner.spawn(spec)).toThrow('Native delegation observed')
  expect(native).toHaveBeenCalledExactlyOnceWith(spec)
  expect(native.mock.calls[0]![0]).toBe(spec)
  expect(owner.calls[0]!.kind).toBe('NATIVE_FAKE_VERIFICATION')
})
it('fails explicitly for unsupported exact-version stream dispositions', () => {
  const { owner, native } = fixture()
  expect(() => owner.spawn({ ...request(), stdio: { stdin: 'ignore', stdout: 'inherit', stderr: 'pipe' } })).toThrow('piped output')
  expect(native).not.toHaveBeenCalled()
})
it('parses four correct fixture responses and runs subsequent stages through native fake verification', async () => {
  const s = await setup(), result = await s.runner.verify(await s.register(), new AbortController().signal, argv => argv)
  expect(result.status).toBe('PASS')
  expect(result.stages[0]!.invocations!.slice(0, 4).map(item => [item.label, item.version_matches])).toEqual(['vivado', 'xvlog', 'xelab', 'xsim'].map(tool => [tool + '-version', true]))
  expect(s.owner.calls.filter(call => call.kind === 'VERSION_FIXTURE')).toHaveLength(4)
  expect(s.owner.calls.filter(call => call.kind === 'NATIVE_FAKE_VERIFICATION')).toHaveLength(5)
  expect(s.owner.calls.every(call => call.settled)).toBe(true)
})
it.each(['Vivado Simulator v2025.2\n', '', 'unparseable output\n'])('preserves rejection of version response %j before native compile', async stdout => {
  const s = await setup({ ...response, stdout }), result = await s.runner.verify(await s.register(), new AbortController().signal, argv => argv)
  expect(result.status).not.toBe('PASS'); expect(result.stages[0]!.status).toBe('TOOL_ERROR')
  expect(result.stages[0]!.invocations!.every(item => item.version_matches === false)).toBe(true)
  expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
  expect(s.owner.calls.every(call => call.kind === 'VERSION_FIXTURE')).toBe(true)
})
it('accepts original informational version exit one from stderr without masking native compile failure', async () => {
  const s = await setup({ stdout: '', stderr: 'Vivado Simulator v2026.1\n', exitCode: 1 }, { error: 'compile' })
  const result = await s.runner.verify(await s.register(), new AbortController().signal, argv => argv)
  expect(result.status).toBe('FAIL')
  expect(result.stages[0]!.invocations!.slice(0, 4).every(item => item.version_matches && item.process.exit_code === 1)).toBe(true)
  expect(result.stages[0]!.invocations!.at(-1)!).toMatchObject({ label: 'compile', process: { exit_code: 1 } })
  expect(s.owner.calls.at(-1)!.kind).toBe('NATIVE_FAKE_VERIFICATION')
})
it('retains the real compile deadline after fast version responses', async () => {
  const s = await setup(response, { compileDelay: 2000 }, { compileMs: 1400 })
  const result = await s.runner.verify(await s.register(), new AbortController().signal, argv => argv)
  expect(result.status).toBe('TIMEOUT')
  expect(result.stages[0]!.invocations!.slice(0, 4).every(item => item.version_matches)).toBe(true)
  expect(result.stages[0]!.invocations!.at(-1)!.process.timed_out).toBe(true)
  expect(s.owner.calls.at(-1)!.kind).toBe('NATIVE_FAKE_VERIFICATION')
  expect(result.stages.slice(1).every(stage => stage.status === 'SKIPPED')).toBe(true)
})
it('consumes actual native version output with original parsing and exit facts', async () => {
  const root = await mkdtemp(join(tmpdir(), 'version-probe-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const native = ctx.subprocess.spawn.bind(ctx.subprocess), owner = new ManagedVersionProbeFixture(native, versionArgv, response); fixtures.push(owner)
  vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => operationScope().observeManaged(owner.spawn(spec)))
  const argv = [process.execPath, '-e', 'process.stderr.write("Vivado Simulator v2026.1\\n");process.exitCode=1']
  const processResult = await operationScope().track('native-version', () => runCommand(ctx.subprocess, { timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192, maxLineChars: 4096 }, argv, root, 'native-version', new AbortController().signal, { accept() {} }))
  const probe: Probe = { executable: process.execPath, argv, process: processResult, error: null }
  const text = await readFile(processResult.stdoutLog, 'utf8') + await readFile(processResult.stderrLog, 'utf8')
  expect(versionFact(probe, text, '2026.1').matches).toBe(true)
  expect(processResult).toMatchObject({ exitCode: 1, timedOut: false, aborted: false })
  expect(owner.calls[0]!.kind).toBe('NATIVE_FAKE_VERIFICATION')
})
it('cancels and joins a real native version command after observing its banner', async () => {
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  await operationScope().track('native-version-cancel', async () => {
    const control = new AbortController(), signal = AbortSignal.any([control.signal, operationScope().signal])
    const handle = operationScope().observeManaged(ctx.subprocess.spawn({ ...request(signal), argv: [process.execPath, '-e', 'process.stdout.write("Vivado Simulator v2026.1\\n");setInterval(()=>{},1000)'] }))
    const banner = Promise.withResolvers<string>()
    const data = (chunk: Buffer) => banner.resolve(String(chunk))
    handle.stdout!.once('data', data)
    try {
      const observed = await Promise.race([banner.promise, handle.done.then(() => { throw new Error('Native command ended before banner') })])
      expect(observed).toContain('Vivado Simulator v2026.1')
    } finally {
      control.abort(); handle.terminate(); handle.stdout!.removeListener('data', data)
      await handle.done; expect(await handle.waitForExit()).toBe(true)
    }
  })
})
it('keeps default repair setup native and selects only the two authorized parameter instances', async () => {
  const text = await readFile(new URL('./repair.spec.ts', import.meta.url), 'utf8')
  expect(text).toContain('options = {}, isolateVersionProbes = false')
  expect(text.match(/new ManagedVersionProbeFixture/g)).toHaveLength(1)
  expect(text.match(/\{ repairDiagnostics: true \}, true\)/g)).toHaveLength(5)
  const selected = text.split(/(?=it\()/).filter(block => block.includes('{ repairDiagnostics: true }, true)')).map(block => block.match(/^it\('([^']+)'/)?.[1])
  expect(selected).toEqual(['P09 binds two real Mock verification rounds, audits sent text and exports only the approved version',
    'P09 never stops changed sources solely because they repeat a primary diagnostic', 'uses fresh feedback and the previous candidate in a two-round controlled loop',
    'stops semantic budget exhaustion, not transport retries, after three valid failed candidates', 'stops a candidate that repeats any earlier revision rather than only the parent'])
  expect(text.match(/\{ repairDiagnostics: true \}, success\)/g)).toHaveLength(1)
  expect(text.match(/\{ repairDiagnostics: true \}, fixture === 'syntax'\)/g)).toHaveLength(1)
  const syntaxRepair = text.slice(text.indexOf("it.each(['syntax', 'synthesis-only'] as const)"), text.indexOf('it.each([true, false])'))
  expect(syntaxRepair).toContain("if (fixture === 'syntax') witness = new TargetWitness('F03-SYNTAX')")
  expect(syntaxRepair).toContain("setup([good], { repairDiagnostics: true }, fixture === 'syntax')")
  expect(syntaxRepair).toContain('} else expect(s.versionFixture).toBeUndefined()')
  const phase1 = await readFile(new URL('./phase1-verification.spec.ts', import.meta.url), 'utf8')
  expect(phase1).toContain('rawVerdict?: string, isolateVersionProbes = false')
  expect(phase1.match(/\{\}, undefined, true\)/g)).toHaveLength(5)
  const phase1Selected = phase1.split(/(?=it\()/).filter(block => block.includes('{}, undefined, true)')).map(block => block.match(/^it\('([^']+)'/)?.[1])
  expect(phase1Selected).toEqual(['records an evaluator-specific default without overriding source timescales', 'preflights a dataset through simulation without synthesis or a candidate PASS',
    'completes all mixed groups in order without adding sv flags to elaboration or simulation', 'cancels a mixed compile group, joins its tree, then accepts the next snapshot',
    'reports dataset mismatch counts without inventing source locations'])
  const auto = await readFile(new URL('./p09-auto.spec.ts', import.meta.url), 'utf8')
  expect(auto).toContain('async function setup(steps: Step[], isolateVersionProbes = false)')
  expect(auto.match(/setup\(Array\(16\)\.fill\('read'\), true\)/g)).toHaveLength(1)
  const loader = await readFile(new URL('./repair-loader.spec.ts', import.meta.url), 'utf8')
  expect(loader).not.toContain('ManagedVersionProbeFixture')
  expect(text.match(/\{\}, error\.error === 'TIMEOUT'\)/g)).toHaveLength(1)
  expect(text).toContain('versionFixture ? versionFixture.spawn(mapped) : spawn(mapped)')
})
