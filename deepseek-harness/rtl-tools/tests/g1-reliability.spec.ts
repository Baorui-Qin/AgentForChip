/** Negative controls for target waits, raw-output ownership and pre-removal capture. */
import { mkdtemp, mkdir, readFile, rm, writeFile, symlink } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, expect, it, vi } from 'vitest'
import type { SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'
import { waitForBoundTarget } from './helpers/bound-target-wait.ts'
import { DeterministicEdaOutput } from './helpers/deterministic-eda-output.ts'
import { TargetWitness } from './helpers/g1-target-witness.ts'
import { TestOperationScope } from './test-operation-scope.ts'

const roots: string[] = [], fixtures: DeterministicEdaOutput[] = []
afterEach(async () => {
  vi.useRealTimers()
  for (const fixture of fixtures.splice(0)) await fixture.close()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
async function temp() { const root = await mkdtemp(join(tmpdir(), 'g1-reliability-')); roots.push(root); return root }
function terminals() {
  const listeners = new Set<(code: number) => void>()
  return { listeners, subscribe(listener: (code: number) => void) { listeners.add(listener); return () => { listeners.delete(listener) } }, send(code: number) { for (const listener of listeners) listener(code) } }
}
function spec(cwd: string, args = ['-version'], signal?: AbortSignal): SubprocessSpawnSpec {
  return { argv: ['owned-output', ...args], cwd, signal, graceMs: 100, stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' } }
}
function outputFixture(verdict?: string) { const fixture = new DeterministicEdaOutput(['owned-output'], verdict); fixtures.push(fixture); return fixture }
async function stream(stream: NodeJS.ReadableStream) { let text = ''; for await (const chunk of stream) text += String(chunk); return text }

it.each([{ case_id: 'OFF', enabled: false }, { case_id: 'ON', enabled: true }])('preserves handle and output with bounded first-receive observation: $case_id', async ({ enabled }) => {
  const root = await temp(), audit = await temp(), fixture = outputFixture()
  const scope = new TestOperationScope(new AbortController().signal, 1000), witness = new TargetWitness('receive', audit, enabled)
  const input = spec(root), handle = fixture.spawn(input)
  expect(witness.observe(input, handle, 'LOGICAL_OUTPUT')).toBe(handle)
  scope.observeManaged(handle)
  const [out, err, result] = await Promise.all([stream(handle.stdout!), stream(handle.stderr!), handle.done])
  expect(out).toBe('Vivado Simulator v2026.1\n'); expect(err).toBe(''); expect(result.exitCode).toBe(0)
  await scope.cleanup(async () => {}, async () => { await witness.capture(scope, []) })
  const receipt = JSON.parse(await readFile(join(audit, `${scope.id}-receive/observation.json`), 'utf8'))
  const first = receipt.events.filter((event: { kind: string }) => event.kind === 'first_output_received')
  expect(first).toHaveLength(enabled ? 1 : 0)
  if (enabled) expect(first[0]).toMatchObject({ channel: 'stdout', execution: 'LOGICAL_OUTPUT', bytes: Buffer.byteLength(out) })
  expect(receipt.lifecycle_trace).toMatchObject({ enabled, observer_errors: 0, cross_process_clock_subtraction: false })
  expect(receipt.event_sequence_complete).toBe(true)
  expect(scope.pendingOperations).toHaveLength(0)
})

it('contains first-receive observer failures while preserving the original output and outcome', async () => {
  const root = await temp(), audit = await temp(), fixture = outputFixture()
  const scope = new TestOperationScope(new AbortController().signal, 1000), witness = new TargetWitness('receive-error', audit, true)
  const original = witness.record.bind(witness)
  vi.spyOn(witness, 'record').mockImplementation((kind, value) => {
    if (kind === 'first_output_received') throw new Error('Observer-only fault')
    original(kind, value)
  })
  const input = spec(root), handle = fixture.spawn(input)
  expect(witness.observe(input, handle, 'LOGICAL_OUTPUT')).toBe(handle); scope.observeManaged(handle)
  const [out, result] = await Promise.all([stream(handle.stdout!), handle.done])
  expect(out).toBe('Vivado Simulator v2026.1\n'); expect(result.exitCode).toBe(0)
  await scope.cleanup(async () => {}, async () => { await witness.capture(scope, []) })
  const receipt = JSON.parse(await readFile(join(audit, `${scope.id}-receive-error/observation.json`), 'utf8'))
  expect(receipt.lifecycle_trace).toMatchObject({ enabled: true, observer_errors: 1 })
  expect(receipt.event_sequence_complete).toBe(false)
  expect(receipt.omitted_events).toBe(0); expect(scope.pendingOperations).toHaveLength(0)
})

it('retains fixed command counters when the bounded event prefix omits later dispatches', async () => {
  const root = await temp(), audit = await temp(), fixture = outputFixture()
  const scope = new TestOperationScope(new AbortController().signal, 1000), witness = new TargetWitness('counter-overflow', audit, true)
  for (let index = 0; index < 96; index++) {
    const input = spec(root), handle = fixture.spawn(input)
    scope.observeManaged(witness.observe(input, handle, 'LOGICAL_OUTPUT'))
    await Promise.all([stream(handle.stdout!), stream(handle.stderr!), handle.done, handle.waitForExit()])
  }
  await scope.cleanup(async () => {}, async () => { await witness.capture(scope, []) })
  const receipt = JSON.parse(await readFile(join(audit, `${scope.id}-counter-overflow/observation.json`), 'utf8'))
  expect(receipt.events).toHaveLength(512); expect(receipt.omitted_events).toBeGreaterThan(0)
  expect(receipt.events.filter((event: { kind: string }) => event.kind === 'command_dispatch').length).toBeLessThan(96)
  expect(receipt.command_totals).toEqual({ NATIVE: { dispatched: 0, resolved: 0, rejected: 0 },
    LOGICAL_OUTPUT: { dispatched: 96, resolved: 96, rejected: 0 }, LOGICAL_VERSION: { dispatched: 0, resolved: 0, rejected: 0 } })
  expect(receipt.live_native_dispatches).toBe(0); expect(receipt.event_sequence_complete).toBe(false)
  expect(receipt.lifecycle_trace.observer_errors).toBe(0); expect(scope.pendingOperations).toHaveLength(0)
})

it('fails a bound early terminal immediately and detaches readiness polling', async () => {
  const t = terminals(), check = vi.fn(async () => false)
  await expect(waitForBoundTarget(check, t.subscribe, () => t.send(1), 10000, 25)).rejects.toThrow('exit=1')
  expect(check).not.toHaveBeenCalled(); expect(t.listeners.size).toBe(0)
})
it('settles an in-flight readiness read before rejecting a terminal loser', async () => {
  const t = terminals(), entered = Promise.withResolvers<void>(), release = Promise.withResolvers<boolean>()
  let settled = false
  const wait = waitForBoundTarget(async () => { entered.resolve(); return release.promise }, t.subscribe, () => {}, 10000, 25)
  const checked = expect(wait).rejects.toThrow('exit=1').then(() => { settled = true })
  await entered.promise; t.send(1); await Promise.resolve(); expect(settled).toBe(false)
  release.resolve(true); await checked; expect(t.listeners.size).toBe(0)
})
it('keeps the original readiness deadline and removes all losing timers', async () => {
  vi.useFakeTimers()
  const t = terminals(), wait = waitForBoundTarget(async () => false, t.subscribe, () => {}, 10000, 25)
  const checked = expect(wait).rejects.toThrow('original deadline')
  await vi.advanceTimersByTimeAsync(10000); await checked
  expect(t.listeners.size).toBe(0); expect(vi.getTimerCount()).toBe(0)
})
it('produces raw zero-sample text through buffered streams without a classified status', async () => {
  const root = await temp(); await mkdir(join(root, 'build')); await mkdir(join(root, 'snapshot-local'))
  await writeFile(join(root, 'snapshot-local/manifest.json'), JSON.stringify({ fixture: 'counter' }))
  const owner = outputFixture('Mismatches: 0 in 0 samples'), handle = owner.spawn(spec(join(root, 'build'), ['phase1_sim', '-tclbatch', 'simulate.tcl']))
  await handle.done
  expect(await stream(handle.stdout!)).toBe('Mismatches: 0 in 0 samples\n')
  expect(Object.hasOwn(handle, 'pid')).toBe(false); expect(Object.hasOwn(handle, 'status')).toBe(false)
  expect(await handle.waitForExit()).toBe(true)
})
it('rejects unsupported requests and never publishes a cancelled success', async () => {
  const owner = outputFixture(), root = await temp()
  expect(() => owner.spawn({ ...spec(root), argv: ['foreign', '-version'] })).toThrow('Unexpected')
  await expect(owner.spawn(spec(root, ['unsupported'])).done).rejects.toThrow('Unsupported')
  const control = new AbortController(), handle = owner.spawn(spec(root, ['-version'], control.signal)); control.abort()
  await expect(handle.done).resolves.toEqual({ exitCode: null, signal: 'SIGTERM' })
  expect(await stream(handle.stdout!)).toBe(''); expect(await handle.waitForExit()).toBe(true)
  const closed = owner.close(); expect(owner.close()).toBe(closed); await closed
  expect(() => owner.spawn(spec(root))).toThrow('Unexpected')
})
it('observes output without flowing or discarding bytes before the consumer attaches', async () => {
  const owner = outputFixture(), request = spec(await temp()), handle = owner.spawn(request)
  new TargetWitness('bytes').observe(request, handle, 'LOGICAL_OUTPUT')
  await handle.done
  expect(await stream(handle.stdout!)).toBe('Vivado Simulator v2026.1\n')
})
it('captures only after writer settlement and does not follow an owned-root link', async () => {
  const root = await temp(), audit = await temp(), outside = await temp()
  await writeFile(join(outside, 'result.json'), 'foreign')
  await symlink(outside, join(root, 'foreign'), process.platform === 'win32' ? 'junction' : 'dir')
  const scope = new TestOperationScope(new AbortController().signal, 1000), witness = new TargetWitness('capture', audit)
  const writer = Promise.withResolvers<void>(); scope.track('writer', () => writer.promise)
  let removed = false
  const cleanup = scope.cleanup(async () => {}, async () => { expect(await witness.capture(scope, [root])).toBe(false); removed = true })
  expect(removed).toBe(false); await writeFile(join(root, 'result.json'), '{"complete":true}'); writer.resolve(); await cleanup
  const record = JSON.parse(await readFile(join(audit, `${scope.id}-capture/observation.json`), 'utf8'))
  expect(record.pending_at_capture).toEqual([]); expect(record.links_not_followed).toEqual([join(root, 'foreign')])
  expect(record.files).toHaveLength(1); expect(record.capture_error).toBeNull()
})
it('keeps the primary failure and retains the root when capture itself fails', async () => {
  const root = await temp(), audit = await temp(), primary = 'original stage TIMEOUT'
  const scope = new TestOperationScope(new AbortController().signal, 1000, () => [primary]), witness = new TargetWitness('failure', audit)
  await mkdir(join(audit, `${scope.id}-failure`)); await writeFile(join(root, 'result.json'), '{}')
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  await scope.cleanup(async () => {}, async () => { expect(await witness.capture(scope, [root])).toBe(true) })
  expect(await readFile(join(root, 'result.json'), 'utf8')).toBe('{}')
  expect(error.mock.calls[0]![1]).toContain(primary); expect(error.mock.calls[0]![1]).toContain('capture_error')
})
it('captures public revision and control state without copying private model payloads', async () => {
  const root = await temp(), audit = await temp(), scope = new TestOperationScope(new AbortController().signal, 1000)
  const witness = new TargetWitness('state', audit)
  await writeFile(join(root, 'state.json'), JSON.stringify({ experiment_id: 'owned', phase: 'AWAITING_REVIEW', attempts: 2,
    current: { revision_id: 'revision-2', source_sha256: 'public-hash', source: 'PRIVATE_SENTINEL' },
    model_runs: ['owned/models/run-2'], verification_runs: ['owned/eda/run-2'], auto: { tool_steps: 3, history: ['PRIVATE_SENTINEL'] },
    private_payload: 'PRIVATE_SENTINEL' }))
  await writeFile(join(root, 'model.json'), 'PRIVATE_SENTINEL')
  await scope.cleanup(async () => {}, async () => { expect(await witness.capture(scope, [root])).toBe(false) })
  const target = join(audit, `${scope.id}-state`), state = await readFile(join(target, 'root-1/state.json'), 'utf8')
  expect(state).not.toContain('PRIVATE_SENTINEL')
  expect(JSON.parse(state)).toMatchObject({ experiment_id: 'owned', phase: 'AWAITING_REVIEW', attempts: 2,
    current: { revision_id: 'revision-2', source_sha256: 'public-hash' }, auto: { tool_steps: 3 }, private_fields_selected: false })
  const observation = JSON.parse(await readFile(join(target, 'observation.json'), 'utf8'))
  expect(observation.files).toHaveLength(1)
  expect(observation.files[0]).toMatchObject({ public_state_projection: true, retained_path: join('root-1', 'state.json') })
  expect(observation.files[0].source_sha256).toMatch(/^[0-9a-f]{64}$/)
})
