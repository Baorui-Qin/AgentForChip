import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it, vi } from 'vitest'
import { TestOperationScope } from './test-operation-scope.ts'

it.each(['rejected', 'false'] as const)('forbids removal and quarantines a settled direct handle with %s range proof', async mode => {
  const original = new Error('Windows Job range proof missing'), remove = vi.fn(async () => {})
  let audit: object | undefined
  const scope = new TestOperationScope(new AbortController().signal, 10000, () => [], async value => { audit = value })
  scope.observeManaged({ stdin: undefined, stdout: undefined, stderr: undefined, collected: {}, done: Promise.resolve({ exitCode: 0, signal: null }), terminate() {},
    waitForExit: () => mode === 'rejected' ? Promise.reject(original) : Promise.resolve(false) })
  const cleanup = scope.cleanup(async () => {}, remove)
  if (mode === 'rejected') await expect(cleanup).rejects.toBe(original)
  else await expect(cleanup).rejects.toThrow('Managed ranges lack proof')
  expect(scope.pending).toEqual([])
  expect(audit).toMatchObject({ removal_allowed: false, managed_ranges: [{ direct_settled: true, range_proven: false }] })
  expect(remove).not.toHaveBeenCalled()
  expect(() => scope.assertReleased()).toThrow('Previous test scope did not quiesce')
  expect(scope.cleanup(async () => {}, remove)).toBe(cleanup)
})

it('retains the test root until the caller operation finally writer settles', async () => {
  const root = await mkdtemp(join(tmpdir(), 'scope-writer-'))
  const writer = Promise.withResolvers<void>()
  const entered = Promise.withResolvers<void>()
  const scope = new TestOperationScope(new AbortController().signal, 10000)
  const close = vi.fn(async () => {})
  const remove = vi.fn(() => rm(root, { recursive: true, force: true }))
  const operation = scope.track('resume/finally-save', async () => {
    try { scope.signal.throwIfAborted() } finally {
      entered.resolve()
      await writer.promise
      await writeFile(join(root, 'saved.json'), '{}')
    }
  })
  await entered.promise
  // The development-only baseline driver uses the exact former hook ordering.
  const cleanup = process.env.FIX07_LEGACY_TEARDOWN === '1'
    ? close().then(remove)
    : scope.cleanup(close, remove)
  try {
    await Promise.resolve()
    if (process.env.FIX07_LEGACY_TEARDOWN === '1') await cleanup
    expect(existsSync(root)).toBe(true)
    expect(remove).not.toHaveBeenCalled()
    writer.resolve()
    await operation
    await cleanup
    expect(close).toHaveBeenCalledOnce()
    expect(remove).toHaveBeenCalledOnce()
    expect(existsSync(root)).toBe(false)
    scope.assertReleased()
  } finally {
    writer.resolve()
    await Promise.allSettled([operation, cleanup])
    await rm(root, { recursive: true, force: true })
  }
})

it('propagates test cancellation and records the original operation rejection', async () => {
  const test = new AbortController()
  const scope = new TestOperationScope(test.signal, 10000)
  const entered = Promise.withResolvers<void>()
  const failure = new Error('original deadline')
  const operation = scope.track('verification', () => new Promise<void>((_resolve, reject) => {
    scope.signal.addEventListener('abort', () => { entered.resolve(); reject(scope.signal.reason) }, { once: true })
  }))
  // track installed its own rejection observer before the test timeout arrives.
  test.abort(failure)
  await entered.promise
  await expect(operation).rejects.toBe(failure)
  await scope.cleanup(async () => {}, async () => {})
  expect(scope.errors).toEqual([{ operation: 'verification', error: failure }])
  expect(scope.pending).toEqual([])
})

it('retains roots and quarantines the next case when existing cleanup time expires', async () => {
  vi.useFakeTimers()
  const operation = Promise.withResolvers<void>()
  const scope = new TestOperationScope(new AbortController().signal, 10000)
  const remove = vi.fn(async () => {})
  scope.track('unresponsive-writer', () => operation.promise)
  const cleanup = scope.cleanup(async () => {}, remove)
  const rejected = expect(cleanup).rejects.toThrow('retained roots; pending: unresponsive-writer')
  try {
    await vi.advanceTimersByTimeAsync(10000)
    await rejected
    expect(remove).not.toHaveBeenCalled()
    expect(() => scope.assertReleased()).toThrow('Previous test scope did not quiesce')
    expect(() => scope.track('late-operation', async () => {})).toThrow('closing')
    operation.resolve()
    await operation.promise
    await expect(scope.cleanup(async () => {}, remove)).rejects.toThrow('retained roots')
    expect(remove).not.toHaveBeenCalled()
  } finally { operation.resolve(); vi.useRealTimers() }
})

it('joins caller finally work before closing, drains disposal, and cleans only once', async () => {
  const scope = new TestOperationScope(new AbortController().signal, 10000)
  const save = Promise.withResolvers<void>()
  const drain = Promise.withResolvers<void>()
  const closeEntered = Promise.withResolvers<void>()
  const events: string[] = []
  scope.track('resume', async () => { await save.promise; events.push('save') })
  const cleanup = scope.cleanup(async () => {
    events.push('close'); closeEntered.resolve(); await drain.promise; events.push('drain')
  }, async () => { events.push('rm') })
  expect(scope.cleanup(async () => { throw new Error('duplicate') }, async () => {})).toBe(cleanup)
  expect(events).toEqual([])
  save.resolve()
  await closeEntered.promise
  expect(events).toEqual(['save', 'close'])
  drain.resolve()
  await cleanup
  expect(events).toEqual(['save', 'close', 'drain', 'rm'])
  scope.assertReleased()
})

it('merges scope cancellation with caller signals and preserves receiver and success assertions', async () => {
  const scope = new TestOperationScope(new AbortController().signal, 10000)
  const caller = new AbortController()
  const target = { value: 7, async resume(_id: string, signal: AbortSignal) { signal.throwIfAborted(); return this.value } }
  const owned = scope.own(target, ['resume'])
  expect(await owned.resume('case', caller.signal)).toBe(7)
  caller.abort(new Error('caller cancelled'))
  await expect(owned.resume('case', caller.signal)).rejects.toThrow('caller cancelled')
  await scope.cleanup(async () => {}, async () => {})
  expect(scope.pending).toEqual([])
})

it('preserves the body failure separately when disposal fails and forbids root removal', async () => {
  const primary = new Error('original body assertion'), secondary = new Error('range proof missing')
  const scope = new TestOperationScope(new AbortController().signal, 10000, () => [primary])
  const remove = vi.fn(async () => {})
  await expect(scope.cleanup(async () => { throw secondary }, remove)).rejects.toBe(secondary)
  expect(scope.bodyErrors()).toEqual([primary])
  expect(remove).not.toHaveBeenCalled()
  expect(() => scope.assertReleased()).toThrow('Previous test scope did not quiesce')
})

it('does not remove roots after an overdue disposal eventually settles', async () => {
  vi.useFakeTimers()
  const close = Promise.withResolvers<void>(), entered = Promise.withResolvers<void>()
  const scope = new TestOperationScope(new AbortController().signal, 10000)
  const remove = vi.fn(async () => {})
  const cleanup = scope.cleanup(async () => { entered.resolve(); await close.promise }, remove)
  const rejected = expect(cleanup).rejects.toThrow('retained roots')
  try {
    await entered.promise
    await vi.advanceTimersByTimeAsync(10000)
    await rejected
    close.resolve()
    await close.promise
    expect(remove).not.toHaveBeenCalled()
    expect(() => scope.assertReleased()).toThrow('Previous test scope did not quiesce')
  } finally { close.resolve(); vi.useRealTimers() }
})

it('joins the scope evidence writer before allowing removal', async () => {
  const writer = Promise.withResolvers<void>(), entered = Promise.withResolvers<void>()
  const remove = vi.fn(async () => {})
  const scope = new TestOperationScope(new AbortController().signal, 10000, () => [], async value => {
    expect(value).toMatchObject({ scope_id: scope.id, pending: [], omitted_events: 0 })
    entered.resolve(); await writer.promise
  })
  const cleanup = scope.cleanup(async () => {}, remove)
  try {
    await entered.promise
    expect(remove).not.toHaveBeenCalled()
    writer.resolve()
    await cleanup
    expect(remove).toHaveBeenCalledOnce()
  } finally { writer.resolve(); await cleanup }
})

it('retains managed identity until range proof settles after direct exit', async () => {
  const direct = Promise.withResolvers<{ exitCode: number; signal: null }>()
  const proof = Promise.withResolvers<boolean>(), joinEntered = Promise.withResolvers<void>(), closeEntered = Promise.withResolvers<void>(), allowClose = Promise.withResolvers<void>()
  const remove = vi.fn(async () => {})
  let audit: object | undefined
  const scope = new TestOperationScope(new AbortController().signal, 10000, () => [], async value => { audit = value })
  scope.observeManaged({ stdin: undefined, stdout: undefined, stderr: undefined, done: direct.promise, collected: {}, terminate() {}, waitForExit() { joinEntered.resolve(); return proof.promise } })
  direct.resolve({ exitCode: 0, signal: null })
  await joinEntered.promise
  const cleanup = scope.cleanup(async () => { closeEntered.resolve(); await allowClose.promise; proof.resolve(true) }, remove)
  try {
    await closeEntered.promise
    expect(remove).not.toHaveBeenCalled()
    allowClose.resolve()
    await cleanup
    expect(audit).toMatchObject({ managed_ranges: [{ managed_id: scope.id + '-managed-1', direct_settled: true, range_proven: true, outcome: { exitCode: 0, signal: null } }] })
    expect(remove).toHaveBeenCalledOnce()
  } finally { allowClose.resolve(); proof.resolve(true); await cleanup }
})

it('retains actual lifecycle timestamps when the bounded event prefix omits successful cleanup', async () => {
  let audit: { events: Array<{ type: string; monotonic_ns: string }>; event_cap: number; omitted_events: number; final_lifecycle_ns: Record<string, string | null> } | undefined
  const remove = vi.fn(async () => {})
  const scope = new TestOperationScope(new AbortController().signal, 10000, () => [], async value => { audit = value as typeof audit })
  await Promise.all(Array.from({ length: 65 }, (_, index) => scope.track('bounded-prefix-' + index, async () => {})))
  await scope.cleanup(async () => {}, remove)
  expect(audit).toMatchObject({ event_cap: 128, omitted_events: 5, final_lifecycle_ns: { resources_unproven: null } })
  expect(audit!.events).toHaveLength(128)
  expect(audit!.events.some(event => ['cleanup_started', 'operations_quiescent', 'resources_quiescent'].includes(event.type))).toBe(false)
  const final = audit!.final_lifecycle_ns
  expect(Object.keys(final)).toEqual(['cleanup_started', 'operations_quiescent', 'resources_quiescent', 'resources_unproven'])
  expect(BigInt(final.cleanup_started!)).toBeGreaterThanOrEqual(BigInt(audit!.events.at(-1)!.monotonic_ns))
  expect(BigInt(final.operations_quiescent!)).toBeGreaterThanOrEqual(BigInt(final.cleanup_started!))
  expect(BigInt(final.resources_quiescent!)).toBeGreaterThanOrEqual(BigInt(final.operations_quiescent!))
  expect(remove).toHaveBeenCalledOnce()
  scope.assertReleased()
})

it('retains an actual unproven lifecycle timestamp after event overflow without claiming resources quiescent', async () => {
  let audit: { events: unknown[]; omitted_events: number; final_lifecycle_ns: Record<string, string | null> } | undefined
  const remove = vi.fn(async () => {})
  const scope = new TestOperationScope(new AbortController().signal, 10000, () => [], async value => { audit = value as typeof audit })
  await Promise.all(Array.from({ length: 65 }, (_, index) => scope.track('bounded-prefix-' + index, async () => {})))
  scope.observeManaged({ stdin: undefined, stdout: undefined, stderr: undefined, collected: {}, done: Promise.resolve({ exitCode: 0, signal: null }), terminate() {}, waitForExit: async () => false })
  await expect(scope.cleanup(async () => {}, remove)).rejects.toThrow('Managed ranges lack proof')
  expect(audit).toMatchObject({ omitted_events: 8, final_lifecycle_ns: { resources_quiescent: null }, removal_allowed: false, pending: [], managed_ranges: [{ direct_settled: true, range_proven: false }] })
  expect(audit!.events).toHaveLength(128)
  const final = audit!.final_lifecycle_ns
  expect(BigInt(final.operations_quiescent!)).toBeGreaterThanOrEqual(BigInt(final.cleanup_started!))
  expect(BigInt(final.resources_unproven!)).toBeGreaterThanOrEqual(BigInt(final.operations_quiescent!))
  expect(remove).not.toHaveBeenCalled()
  expect(() => scope.assertReleased()).toThrow('Previous test scope did not quiesce')
})
