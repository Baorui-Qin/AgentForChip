/** Caller-owned test work settles before workflow disposal or root removal. */
import { beforeEach, type TestContext, type WorkerGlobalState } from 'vitest'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { SubprocessHandle, SubprocessOutcome } from '@deepseek-ai/dsh-subprocess'

/** Test-only owner; the caller supplies the existing runner hook budget. */
export class TestOperationScope {
  readonly id = randomUUID()
  private readonly controller = new AbortController()
  readonly signal: AbortSignal
  private accepting = true
  private readonly operations = new Map<Promise<unknown>, string>()
  private readonly operationIds = new Map<Promise<unknown>, string>()
  private sequence = 0
  private readonly events: Array<{ type: string; operation_id: string | null; monotonic_ns: string }> = []
  private omittedEvents = 0
  private readonly finalLifecycle: Record<'cleanup_started' | 'operations_quiescent' | 'resources_quiescent' | 'resources_unproven', string | null> = {
    cleanup_started: null, operations_quiescent: null, resources_quiescent: null, resources_unproven: null,
  }
  private readonly managed: Array<{ managed_id: string; direct_settled: boolean; range_proven: boolean; direct_ns?: string; proof_ns?: string; outcome?: SubprocessOutcome; command_error?: string; range_error?: string }> = []
  private readonly managedSettlements: Promise<void>[] = []
  private readonly rangeFailures: unknown[] = []
  readonly errors: Array<{ operation: string; error: unknown }> = []
  private cleanupPromise: Promise<void> | undefined
  private released = false

  constructor(testSignal: AbortSignal, private readonly hookMs: number, readonly bodyErrors: () => unknown[] = () => [], private readonly audit?: (value: object) => Promise<void>) {
    if (!Number.isFinite(hookMs) || hookMs <= 0) throw new Error('Invalid existing hook budget')
    this.signal = AbortSignal.any([testSignal, this.controller.signal])
  }

  get pending(): string[] { return [...this.operations.values()] }
  get pendingOperations(): Array<{ id: string | undefined; operation: string }> {
    return [...this.operations].map(([promise, operation]) => ({ id: this.operationIds.get(promise), operation }))
  }

  private record(type: string, operation_id: string | null = null): void {
    const terminal = type === 'cleanup_started' || type === 'operations_quiescent' || type === 'resources_quiescent' || type === 'resources_unproven'
    const timestamp = terminal || this.events.length < 128 ? process.hrtime.bigint().toString() : null
    if (terminal) this.finalLifecycle[type] = timestamp
    if (this.events.length < 128) this.events.push({ type, operation_id, monotonic_ns: timestamp! })
    else this.omittedEvents += 1
  }

  /** Observe the unchanged handle; its ID names this observer's handle instance. */
  observeManaged<T extends SubprocessHandle>(handle: T): T {
    const row = { managed_id: `${this.id}-managed-${this.managed.length + 1}`, direct_settled: false, range_proven: false } as typeof this.managed[number]
    this.managed.push(row)
    this.record('managed_spawned', row.managed_id)
    const directSettled = () => { row.direct_settled = true; row.direct_ns = process.hrtime.bigint().toString(); this.record('direct_settled', row.managed_id); return handle.waitForExit() }
    this.managedSettlements.push(handle.done.then(outcome => { row.outcome = outcome; return directSettled() }, (error: unknown) => {
      row.command_error = String(error); return directSettled()
    }).then(proven => {
      row.range_proven = proven; row.proof_ns = process.hrtime.bigint().toString(); this.record('range_proof', row.managed_id)
    }, (error: unknown) => {
      this.rangeFailures.push(error)
      row.range_error = String(error); this.record('range_failure', row.managed_id)
    }))
    return handle
  }

  /** Preserve the original operation promise and observe rejection immediately. */
  track<T>(label: string, operation: () => Promise<T>): Promise<T> {
    if (!this.accepting) throw new Error('Test operation scope is closing')
    this.signal.throwIfAborted()
    const promise = operation()
    const id = `${this.id}-${++this.sequence}`
    this.operationIds.set(promise, id)
    this.record('operation_started', id)
    this.operations.set(promise, label)
    const settled = () => { this.record('operation_settled', id); this.operations.delete(promise); this.operationIds.delete(promise) }
    void promise.then(settled, error => {
      this.errors.push({ operation: label, error })
      settled()
    })
    return promise
  }

  /** Bind methods to their actual receiver; merge explicit caller cancellation. */
  own<T extends object>(target: T, methods: readonly (keyof T)[]): T {
    return new Proxy(target, {
      get: (object, key) => {
        const value: unknown = Reflect.get(object, key)
        if (typeof value !== 'function') return value
        if (!methods.includes(key as keyof T)) return value.bind(object)
        return (...args: unknown[]) => this.track(String(key), () => {
          const merged = args.map(arg => arg instanceof AbortSignal ? AbortSignal.any([arg, this.signal]) : arg)
          return Reflect.apply(value, object, merged) as Promise<unknown>
        })
      },
    })
  }

  /** A failed cleanup quarantines the next case instead of sharing live work. */
  assertReleased(): void {
    if (!this.released) throw new Error(`Previous test scope did not quiesce: ${this.pending.join(', ')}`)
  }

  /** All cleanup steps share one unchanged hook budget; removal is always last. */
  cleanup(close: () => Promise<void>, remove: () => Promise<void>): Promise<void> {
    if (this.cleanupPromise !== undefined) return this.cleanupPromise
    this.accepting = false
    this.record('cleanup_started')
    this.controller.abort(new Error('Test scope teardown'))
    const deadline = Promise.withResolvers<never>()
    const timer = setTimeout(() => {
      deadline.reject(new Error(`Test scope exceeded existing ${this.hookMs}ms hook budget; retained roots; pending: ${this.pending.join(', ')}`))
    }, this.hookMs)
    const bounded = <T>(promise: Promise<T>): Promise<T> => Promise.race([promise, deadline.promise])
    this.cleanupPromise = (async () => {
      try {
        await bounded(Promise.allSettled([...this.operations.keys()]))
        this.record('operations_quiescent')
        await bounded(close())
        await bounded(Promise.all(this.managedSettlements))
        const removalAllowed = this.managed.every(row => row.range_proven)
        this.record(removalAllowed ? 'resources_quiescent' : 'resources_unproven')
        if (this.audit !== undefined) await bounded(this.audit({ scope_id: this.id, hook_ms: this.hookMs, pending: this.pendingOperations, body_errors: this.bodyErrors(), operation_errors: this.errors.map(row => ({ operation: row.operation, error: String(row.error) })), events: this.events, event_cap: 128, omitted_events: this.omittedEvents, final_lifecycle_ns: { ...this.finalLifecycle }, managed_ranges: this.managed, managed_id_scope: 'OBSERVER_HANDLE_INSTANCE', removal_allowed: removalAllowed }))
        if (!removalAllowed) {
          if (this.rangeFailures.length > 0) throw this.rangeFailures[0]
          throw new Error(`Managed ranges lack proof: ${this.managed.filter(row => !row.range_proven).map(row => row.managed_id).join(', ')}`)
        }
        await bounded(remove())
        this.released = true
      } finally { clearTimeout(timer) }
    })()
    return this.cleanupPromise
  }
}

/**
 * Vitest 4.1.8 exposes TestContext.signal publicly, but not its resolved hook
 * budget. Read the same worker config used by withTimeout; fail if unavailable.
 */
export function installTestOperationScope(): () => TestOperationScope {
  let scope: TestOperationScope | undefined
  beforeEach((context: TestContext) => {
    scope?.assertReleased()
    const worker = (globalThis as typeof globalThis & { __vitest_worker__?: WorkerGlobalState }).__vitest_worker__
    if (worker === undefined) throw new Error('Vitest worker config unavailable')
    const auditRoot = process.env.FIX07_SCOPE_AUDIT
    scope = new TestOperationScope(context.signal, worker.config.hookTimeout, () => context.task.result?.errors ?? [],
      auditRoot === undefined ? undefined : value => writeFile(join(auditRoot, `${context.task.id}.json`), JSON.stringify({ test_id: context.task.id, test: context.task.name, ...value }) + '\n', { flag: 'wx' }))
  })
  return () => {
    if (scope === undefined) throw new Error('Test operation scope unavailable')
    return scope
  }
}
