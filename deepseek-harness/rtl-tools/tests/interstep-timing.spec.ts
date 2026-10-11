import { AsyncLocalStorage } from 'node:async_hooks'
import { expect, it } from 'vitest'
import { InterstepTiming, type InterstepTimingOptions } from './helpers/interstep-timing.ts'

const identity = { file: 'rtl-tools/tests/interstep-timing.spec.ts', fullName: 'facility contract', occurrence: 1 }
function timing(options: Partial<InterstepTimingOptions> = {}) {
  let now = 0n
  return new InterstepTiming({ enabled: true, runId: 'facility-test', testIdentity: identity, clock: () => ++now, ...options })
}

it('preserves synchronous values, native Promise identities and untouched thenables', async () => {
  const value = { original: true }, promise = Promise.resolve(value)
  let thenReads = 0
  const thenable = Object.defineProperty({}, 'then', { get() { thenReads++; throw new Error('Do not assimilate') } })
  const target = { value: () => value, promise: () => promise, thenable: () => thenable }, trace = timing()
  const restore = trace.observeMethods(target, ['value', 'promise', 'thenable'])
  expect(target.value()).toBe(value); expect(target.promise()).toBe(promise); expect(target.thenable()).toBe(thenable)
  await promise
  restore(); trace.close()
  expect(thenReads).toBe(0)
  expect(trace.export().receipt.events.map(event => event.outcome)).toEqual(['RETURNED', 'FULFILLED', 'RETURNED'])
})

it('rethrows the original synchronous error at the original synchronous boundary', () => {
  const failure = Object.assign(new Error('business failure'), { code: 'BUSINESS' })
  const target = { fail() { throw failure } }, trace = timing()
  trace.observeMethods(target, ['fail'])
  let caught: unknown
  try { target.fail() } catch (error) { caught = error }
  expect(caught).toBe(failure)
  trace.close()
  expect(trace.export().receipt.events[0]).toMatchObject({ outcome: 'THREW', error_code: 'BUSINESS' })
})

it('preserves asynchronous rejection identity without returning the observer reaction Promise', async () => {
  const failure = new Error('asynchronous business failure'), promise = Promise.reject(failure)
  const target = { fail: () => promise }, trace = timing()
  trace.observeMethods(target, ['fail'])
  const observed = target.fail()
  expect(observed).toBe(promise)
  await expect(observed).rejects.toBe(failure)
  trace.close()
  expect(trace.export().receipt).toMatchObject({ pending_spans: 0, observer_error_count: 0 })
  expect(trace.export().receipt.events[0]?.outcome).toBe('REJECTED')
})

it('passes the original cancellation signal and reason without starting replacement work', async () => {
  const control = new AbortController(), reason = new Error('caller cancellation')
  let received: AbortSignal | undefined, calls = 0
  const target = { wait(signal: AbortSignal) {
    received = signal; calls++
    return new Promise<void>((_resolve, reject) => {
      const aborted = () => reject(signal.reason)
      signal.addEventListener('abort', aborted, { once: true })
      if (signal.aborted) { signal.removeEventListener('abort', aborted); aborted() }
    })
  } }, trace = timing()
  trace.observeMethods(target, ['wait'])
  const pending = target.wait(control.signal)
  control.abort(reason)
  await expect(pending).rejects.toBe(reason)
  expect(received).toBe(control.signal); expect(calls).toBe(1)
  trace.close(); expect(trace.export().receipt.pending_spans).toBe(0)
})

it('invokes each method once with its receiver and arguments and unions overlapping child intervals', async () => {
  let now = 0n, calls = 0
  const first = Promise.withResolvers<void>(), second = Promise.withResolvers<void>()
  const target = { tag: { receiver: true }, seen: [] as unknown[],
    child(input: unknown, pending: Promise<void>) { calls++; this.seen.push(this.tag, input); return pending },
    async parent(left: unknown, right: unknown) {
      now = 2n; const a = this.child(left, first.promise)
      now = 4n; const b = this.child(right, second.promise)
      await Promise.all([a, b]); now = 12n
    } }
  const trace = timing({ clock: () => now })
  trace.observeMethods(target, ['parent', 'child'])
  const left = {}, right = Object.defineProperty({}, 'auto', { get() { throw new Error('Business argument must stay opaque') } })
  const parent = target.parent(left, right)
  now = 8n; first.resolve(); await first.promise
  now = 10n; second.resolve(); await parent
  trace.close()
  const events = trace.export().receipt.events
  expect(calls).toBe(2); expect(target.seen).toEqual([target.tag, left, target.tag, right])
  expect(events.map(event => event.parent_span_id)).toEqual([null, 1, 1])
  expect(events[0]).toMatchObject({ inclusive_ns: '12', exclusive_ns: '4', child_overlap_ns: '4' })
  expect(trace.export().receipt.observer_error_count).toBe(0)
})

it('leaves methods and all observation callbacks untouched when disabled by default', () => {
  let clockCalls = 0, observerCalls = 0
  const original = () => ({ original: true }), target = { run: original }
  const descriptor = Object.getOwnPropertyDescriptor(target, 'run')
  const trace = new InterstepTiming({ runId: 'disabled', testIdentity: identity,
    clock: () => { clockCalls++; return 0n }, onSpan: () => { observerCalls++; return undefined } })
  trace.observeMethods(target, ['run', 'missing'])(); expect(target.run).toBe(original)
  expect(Object.getOwnPropertyDescriptor(target, 'run')).toEqual(descriptor)
  trace.record('ignored'); trace.close()
  expect(clockCalls).toBe(0); expect(observerCalls).toBe(0)
  expect(trace.export().receipt).toMatchObject({ status: 'OFF', events: [], observer_error_count: 0, pending_spans: 0 })
})

it('separates observer faults from the unchanged business result and business error', () => {
  const value = {}, failure = new Error('business sentinel'), target = { good: () => value, bad() { throw failure } }
  const trace = timing({ onSpan: () => { throw new Error('observer sentinel') } })
  trace.observeMethods(target, ['good', 'bad'])
  expect(target.good()).toBe(value)
  let caught: unknown
  try { target.bad() } catch (error) { caught = error }
  expect(caught).toBe(failure)
  trace.close()
  expect(trace.export().receipt).toMatchObject({ trace_incomplete: true, observer_error_count: 2,
    dropped_event_count: 0, pending_spans: 0 })
  const clockFailure = timing({ clock: () => { throw new Error('clock sentinel') } })
  clockFailure.observeMethods(target, ['good'])
  expect(target.good()).toBe(value); clockFailure.close()
  expect(clockFailure.export().receipt).toMatchObject({ observer_error_count: 1, dropped_event_count: 0, trace_incomplete: true })
})

it('bounds pending and retained events and reports serialized truncation separately from observer errors', async () => {
  const waiting = Promise.withResolvers<void>(), target = { wait: () => waiting.promise, value: () => 1 }
  const trace = timing({ maxEvents: 2, maxPending: 1 })
  trace.observeMethods(target, ['wait', 'value'])
  const pending = target.wait(); expect(target.value()).toBe(1)
  waiting.resolve(); await pending
  expect(target.value()).toBe(1); expect(target.value()).toBe(1)
  trace.close()
  expect(trace.export().receipt).toMatchObject({ events: expect.any(Array), dropped_event_count: 2,
    observer_error_count: 0, pending_spans: 0 })
  expect(trace.export().receipt.events).toHaveLength(2)
  const output = timing({ maxOutputBytes: 8192 }), many = { run: () => 1 }
  output.observeMethods(many, ['run'])
  for (let index = 0; index < 64; index++) many.run()
  output.close()
  const exported = output.export()
  expect(exported.bytes).toBe(Buffer.byteLength(exported.json)); expect(exported.bytes).toBeLessThanOrEqual(8192)
  expect(exported.receipt.output_omitted_events).toBeGreaterThan(0)
  expect(exported.receipt).toMatchObject({ trace_incomplete: true, observer_error_count: 0, dropped_event_count: 0 })
})

it('restores only its instance and context while exposing pending work until it actually settles', async () => {
  class Target { run() { return 1 } }
  const target = new Target(), untouched = new Target(), original = target.run, trace = timing()
  const restore = trace.observeMethods(target, ['run'])
  expect(target.run).not.toBe(original); expect(untouched.run).toBe(original)
  restore(); restore(); expect(Object.hasOwn(target, 'run')).toBe(false); expect(target.run).toBe(original)
  const pending = Promise.withResolvers<void>(), late = { run: () => pending.promise }
  trace.observeMethods(late, ['run']); const observed = late.run()
  const foreign = new AsyncLocalStorage<string>()
  foreign.run('unrelated', () => { trace.close(); trace.close(); expect(foreign.getStore()).toBe('unrelated') })
  foreign.disable()
  expect(trace.export().receipt).toMatchObject({ closed: true, trace_incomplete: true, pending_spans: 1 })
  pending.resolve(); await observed
  expect(trace.export().receipt.pending_spans).toBe(0)
  const count = trace.export().receipt.events.length
  late.run(); trace.record('closed_boundary'); expect(trace.export().receipt.events).toHaveLength(count)
})
