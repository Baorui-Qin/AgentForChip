/** Test-local call timing; no production hooks, file writes, timers or signal replacement. */
import { AsyncLocalStorage } from 'node:async_hooks'
import { hrtime } from 'node:process'
import { isPromise } from 'node:util/types'
import { threadId } from 'node:worker_threads'

/** Exact caller-supplied test identity; it does not establish source integrity. */
export interface TimingTestIdentity { file: string; fullName: string; occurrence: number }
/** Only public scalar correlations may enter a timing event. */
export interface TimingFields {
  operation_name?: string | null; round?: number | null; state_seq?: number | null
  tool_steps?: number | null; model_requests?: number | null; semantic_attempts?: number | null
  file_role?: string | null; input_bytes?: number | null
}
/** One observed call or mark; Promise end time is the observer reaction boundary. */
export interface TimingEvent extends TimingFields {
  span_id: number; parent_span_id: number | null; operation_id: number | null
  kind: 'CALL' | 'MARK'; phase: string; start_monotonic_ns: string; end_monotonic_ns: string | null
  outcome: 'PENDING' | 'RETURNED' | 'FULFILLED' | 'THREW' | 'REJECTED' | 'MARK' | 'OBSERVATION_ERROR'
  error_code: string | number | null; observation_error: boolean
}
/** Installation is disabled unless the selected test explicitly enables it. */
export interface InterstepTimingOptions {
  enabled?: boolean; runId: string; testIdentity: TimingTestIdentity
  maxEvents?: number; maxPending?: number; maxOutputBytes?: number
  clock?: () => bigint
  onSpan?: (event: Readonly<TimingEvent>) => undefined
}
interface Correlation { span: number; operation: number | null; round: number | null }
interface Interval { start: bigint; end: bigint }
interface EvaluatedEvent extends TimingEvent { inclusive_ns: string | null; exclusive_ns: string | null; child_overlap_ns: string | null }

function bounded(value: unknown, maximum = 64): string | null {
  return typeof value === 'string' && value.length <= maximum ? value : null
}
function count(value: unknown): number | null {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : null
}
function scalars(fields: TimingFields): TimingFields {
  return { operation_name: bounded(fields.operation_name), round: count(fields.round), state_seq: count(fields.state_seq),
    tool_steps: count(fields.tool_steps), model_requests: count(fields.model_requests), semantic_attempts: count(fields.semantic_attempts),
    file_role: bounded(fields.file_role), input_bytes: count(fields.input_bytes) }
}
function union(intervals: Interval[]): Interval[] {
  const result: Interval[] = []
  for (const interval of intervals.sort((a, b) => a.start < b.start ? -1 : a.start > b.start ? 1 : 0)) {
    const last = result.at(-1)
    if (last && interval.start <= last.end) { if (interval.end > last.end) last.end = interval.end }
    else result.push({ ...interval })
  }
  return result
}

/** Instance-owned observer; its Promise reactions preserve the original returned Promise. */
export class InterstepTiming {
  private readonly enabled: boolean
  private readonly clock: () => bigint
  private readonly context: AsyncLocalStorage<Correlation> | undefined
  private readonly events: TimingEvent[] = []
  private readonly pending = new Map<number, TimingEvent>()
  private readonly restorers = new Set<() => void>()
  private readonly installed = new WeakMap<object, Set<string>>()
  private readonly faults = new Map<string, number>()
  private readonly maxEvents: number
  private readonly maxPending: number
  private readonly maxOutputBytes: number
  private readonly runId: string
  private readonly testIdentity: TimingTestIdentity
  private readonly injectedClock: boolean
  private readonly onSpan: InterstepTimingOptions['onSpan']
  private nextSpan = 0
  private nextOperation = 0
  private dropped = 0
  private observationErrors = 0
  private closed = false
  private incomplete = false

  constructor(options: InterstepTimingOptions) {
    this.enabled = options.enabled === true
    this.maxEvents = options.maxEvents ?? 4096
    this.maxPending = options.maxPending ?? Math.min(128, this.maxEvents)
    this.maxOutputBytes = options.maxOutputBytes ?? 2 * 1024 * 1024
    if (!Number.isSafeInteger(this.maxEvents) || this.maxEvents < 1 || this.maxEvents > 4096 ||
      !Number.isSafeInteger(this.maxPending) || this.maxPending < 1 || this.maxPending > this.maxEvents ||
      !Number.isSafeInteger(this.maxOutputBytes) || this.maxOutputBytes < 8192 || this.maxOutputBytes > 2 * 1024 * 1024 ||
      !bounded(options.runId, 128) || !bounded(options.testIdentity.file, 256) || !bounded(options.testIdentity.fullName, 512) ||
      !count(options.testIdentity.occurrence) || options.testIdentity.occurrence < 1) throw new Error('Invalid timing configuration')
    this.clock = options.clock ?? (() => hrtime.bigint())
    this.runId = options.runId
    this.testIdentity = { file: options.testIdentity.file, fullName: options.testIdentity.fullName,
      occurrence: options.testIdentity.occurrence }
    this.injectedClock = options.clock !== undefined
    this.onSpan = options.onSpan
    this.context = this.enabled ? new AsyncLocalStorage<Correlation>() : undefined
  }

  private fault(code: string): void {
    this.observationErrors++; this.incomplete = true
    this.faults.set(code, (this.faults.get(code) ?? 0) + 1)
  }
  private begin(phase: string, fields: TimingFields, operation = false, mark = false): TimingEvent | undefined {
    if (!this.enabled || this.closed) return undefined
    if (this.events.length >= this.maxEvents || !mark && this.pending.size >= this.maxPending) {
      this.dropped++; this.incomplete = true; return undefined
    }
    try {
      const parent = this.context?.getStore(), start = this.clock().toString()
      const row: TimingEvent = { ...scalars(fields), span_id: ++this.nextSpan, parent_span_id: parent?.span ?? null,
        operation_id: operation ? ++this.nextOperation : parent?.operation ?? null,
        kind: mark ? 'MARK' : 'CALL', phase, start_monotonic_ns: start, end_monotonic_ns: mark ? start : null,
        outcome: mark ? 'MARK' : 'PENDING', error_code: null, observation_error: false }
      if (row.round === null) row.round = parent?.round ?? null
      this.events.push(row)
      if (!mark) this.pending.set(row.span_id, row)
      return row
    } catch { this.fault('BEGIN'); return undefined }
  }
  private end(row: TimingEvent | undefined, outcome: TimingEvent['outcome'], error?: unknown): void {
    if (!row) return
    this.pending.delete(row.span_id)
    row.outcome = outcome
    try {
      const end = this.clock()
      if (end < BigInt(row.start_monotonic_ns)) throw new Error('Timing clock regressed')
      row.end_monotonic_ns = end.toString()
      if (typeof error === 'object' && error !== null) {
        const code: unknown = Object.getOwnPropertyDescriptor(error, 'code')?.value
        row.error_code = typeof code === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(code) ? code : count(code)
      }
    } catch { row.observation_error = true; this.fault('END') }
    try { this.onSpan?.({ ...row }) } catch { row.observation_error = true; this.fault('SPAN_OBSERVER') }
  }
  private fields(method: string, args: readonly unknown[]): TimingFields {
    if (!['source', 'json', 'save', 'operation', 'boundFacts', 'resumeAutomatic', 'verify', 'terminal',
      'revision', 'contextCandidate'].includes(method)) return {}
    try {
      const input = args[method === 'source' ? 2 : 1]
      const state = input && typeof input === 'object' ? input as Record<string, unknown> : undefined
      const auto = state?.auto && typeof state.auto === 'object' ? state.auto as Record<string, unknown> : undefined
      const p09 = state?.p09 && typeof state.p09 === 'object' ? state.p09 as Record<string, unknown> : undefined
      const result: TimingFields = { state_seq: count(state?.seq), tool_steps: count(auto?.tool_steps),
        model_requests: count(p09?.model_requests_total), semantic_attempts: count(state?.attempts) }
      if (method === 'operation') {
        result.operation_name = bounded(args[2]); result.round = auto ? (count(auto.tool_steps) ?? 0) + 1 : null
      }
      if (method === 'json') {
        const name = typeof args[1] === 'string' ? args[1] : ''
        result.file_role = name === 'state.json' ? 'workflow_state' : name.startsWith('event-') ? 'workflow_event'
          : name.endsWith('/candidate.json') ? 'candidate_identity' : name === 'diagnostics-1.4.json' ? 'diagnostic_receipt' : 'bound_json'
      }
      if (method === 'save') result.file_role = 'workflow_event_and_state'
      return result
    } catch { this.fault('METADATA'); return {} }
  }
  private invoke(original: (...args: unknown[]) => unknown, receiver: unknown, args: unknown[], method: string): unknown {
    if (!this.enabled || this.closed) return Reflect.apply(original, receiver, args)
    const row = this.begin('workflow.' + method, this.fields(method, args), method === 'operation')
    let value: unknown
    try {
      value = row && this.context ? this.context.run({ span: row.span_id, operation: row.operation_id, round: row.round ?? null },
        () => Reflect.apply(original, receiver, args)) : Reflect.apply(original, receiver, args)
    } catch (error) { this.end(row, 'THREW', error); throw error }
    if (row) {
      if (isPromise(value)) {
        try {
          // Native Promise observation does not read a thenable's getter or return a derived Promise to the caller.
          void Reflect.apply(Promise.prototype.then, value, [() => { this.end(row, 'FULFILLED') },
            (error: unknown) => { this.end(row, 'REJECTED', error) }])
        } catch {
          this.pending.delete(row.span_id); row.outcome = 'OBSERVATION_ERROR'
          row.observation_error = true; this.fault('PROMISE_OBSERVATION')
        }
      } else this.end(row, 'RETURNED')
    }
    return value
  }

  /**
   * Shadow only selected value methods on this object; restore their exact prior own descriptors.
   * @param target - the one caller-owned instance, before any lifecycle proxy is installed.
   * @param methods - explicit method names; free ESM functions are not intercepted.
   * @returns idempotent restoration; the collector also restores installations when closed.
   */
  observeMethods(target: object, methods: readonly string[]): () => void {
    if (!this.enabled || this.closed) return () => {}
    if (methods.length > 32 || this.restorers.size >= 16) { this.fault('INSTALL_CAP'); return () => {} }
    const owned = this.installed.get(target) ?? new Set<string>()
    const descriptors: Array<{ name: string; previous: PropertyDescriptor | undefined; wrapper: (...args: unknown[]) => unknown }> = []
    this.installed.set(target, owned)
    for (const name of methods) {
      try {
        if (!/^[A-Za-z][A-Za-z0-9_]{0,47}$/.test(name) || owned.has(name)) throw new Error('Invalid or duplicate observed method')
        const previous = Object.getOwnPropertyDescriptor(target, name)
        let owner: object | null = target, descriptor: PropertyDescriptor | undefined
        while (owner && !descriptor) {
          descriptor = Object.getOwnPropertyDescriptor(owner, name); owner = Object.getPrototypeOf(owner) as object | null
        }
        if (typeof descriptor?.value !== 'function') throw new Error('Only value methods can be observed')
        const original = descriptor.value as (...args: unknown[]) => unknown, trace = this
        const wrapper = function (this: unknown, ...args: unknown[]) { return trace.invoke(original, this, args, name) }
        Object.defineProperty(target, name, previous ? { ...previous, value: wrapper }
          : { value: wrapper, writable: true, configurable: true, enumerable: false })
        descriptors.push({ name, previous, wrapper }); owned.add(name)
      } catch { this.fault('INSTALL') }
    }
    let restored = false
    const restore = () => {
      if (restored) return
      restored = true
      for (const { name, previous, wrapper } of descriptors.reverse()) {
        try {
          if (Object.getOwnPropertyDescriptor(target, name)?.value !== wrapper) {
            throw new Error('Observed method changed before restoration')
          }
          if (previous) Object.defineProperty(target, name, previous)
          else if (!Reflect.deleteProperty(target, name)) throw new Error('Cannot restore inherited method')
          owned.delete(name)
        } catch { this.fault('RESTORE') }
      }
      this.restorers.delete(restore)
    }
    this.restorers.add(restore)
    return restore
  }

  /**
   * Record one explicit public boundary; nothing is read from business payloads.
   * @param phase - bounded boundary name.
   * @param fields - scalar public correlations.
   */
  record(phase: string, fields: TimingFields = {}): void {
    if (!this.enabled || this.closed) return
    if (!bounded(phase) || !phase) { this.fault('MARK_NAME'); return }
    this.begin(phase, fields, false, true)
  }

  /** Stop new observations and restore owned methods; pending work is reported, never declared settled. */
  close(): void {
    if (this.closed) return
    this.closed = true
    for (const restore of [...this.restorers]) restore()
    if (this.pending.size) this.incomplete = true
    this.context?.disable()
  }

  /**
   * Export once after caller-owned operations settle; this method creates no writer.
   * @returns public receipt and the exact compact JSON bytes to flush under the existing hook budget.
   */
  export() {
    const children = new Map<number, TimingEvent[]>()
    for (const row of this.events) if (row.parent_span_id !== null && row.kind === 'CALL') {
      const list = children.get(row.parent_span_id) ?? []; list.push(row); children.set(row.parent_span_id, list)
    }
    const gaps: Array<{ span_id: number; start_monotonic_ns: string; end_monotonic_ns: string }> = []
    let omittedGaps = 0
    const evaluated: EvaluatedEvent[] = this.events.map(row => {
      if (row.end_monotonic_ns === null) return { ...row, inclusive_ns: null, exclusive_ns: null, child_overlap_ns: null }
      const start = BigInt(row.start_monotonic_ns), end = BigInt(row.end_monotonic_ns), intervals: Interval[] = []
      let childSum = 0n
      for (const child of children.get(row.span_id) ?? []) if (child.end_monotonic_ns !== null) {
        const childStart = BigInt(child.start_monotonic_ns), childEnd = BigInt(child.end_monotonic_ns)
        const clipped = { start: childStart > start ? childStart : start, end: childEnd < end ? childEnd : end }
        if (clipped.end > clipped.start) { intervals.push(clipped); childSum += clipped.end - clipped.start }
      }
      const merged = union(intervals), covered = merged.reduce((sum, value) => sum + value.end - value.start, 0n)
      if (row.parent_span_id === null && row.kind === 'CALL') {
        let cursor = start
        for (const interval of [...merged, { start: end, end }]) {
          if (interval.start > cursor) {
            if (gaps.length < 64) gaps.push({ span_id: row.span_id, start_monotonic_ns: cursor.toString(),
              end_monotonic_ns: interval.start.toString() })
            else omittedGaps++
          }
          cursor = interval.end
        }
      }
      return { ...row, inclusive_ns: (end - start).toString(), exclusive_ns: (end - start - covered).toString(),
        child_overlap_ns: (childSum - covered).toString() }
    })
    const receipt = { schema_version: 'interstep-timing-1', run_id: this.runId, test_identity: { ...this.testIdentity },
      worker_pid: process.pid, thread_id: threadId, enabled: this.enabled, closed: this.closed,
      status: !this.enabled ? 'OFF' : this.incomplete || this.pending.size ? 'INCOMPLETE' : 'OBSERVED',
      clock: this.injectedClock ? 'injected monotonic clock for facility tests' : 'worker process.hrtime.bigint',
      promise_end_boundary: 'observer reaction after settlement; original Promise is returned',
      pending_spans: this.pending.size, trace_incomplete: this.incomplete || this.pending.size > 0,
      dropped_event_count: this.dropped, dropped_event_unit: 'one rejected call/mark row; accepted rows reserve their end fields',
      observer_error_count: this.observationErrors,
      observation_errors: [...this.faults].map(([code, occurrences]) => ({ code, occurrences })),
      event_cap: this.maxEvents, pending_cap: this.maxPending, output_cap_bytes: this.maxOutputBytes,
      output_omitted_events: 0, output_omitted_gap_intervals: omittedGaps,
      analysis: { exclusive_uses_direct_child_union: true, cross_process_time_subtraction: false,
        call_wall_time_only: true, unobserved_subcalls_and_scheduling_may_occupy_exclusive_time: true,
        complete_explanation_claim: false, root_unexplained_intervals: gaps }, events: [] as EvaluatedEvent[] }
    while (Buffer.byteLength(JSON.stringify(receipt)) > this.maxOutputBytes - 512 && gaps.length) {
      gaps.pop(); receipt.output_omitted_gap_intervals++
    }
    let bytes = Buffer.byteLength(JSON.stringify(receipt)) + 1
    for (const row of evaluated) {
      const added = Buffer.byteLength(JSON.stringify(row)) + (receipt.events.length ? 1 : 0)
      if (bytes + added > this.maxOutputBytes - 512) break
      receipt.events.push(row); bytes += added
    }
    receipt.output_omitted_events = evaluated.length - receipt.events.length
    if (receipt.output_omitted_events || receipt.output_omitted_gap_intervals) {
      receipt.trace_incomplete = true; receipt.status = 'INCOMPLETE'
    }
    const json = JSON.stringify(receipt) + '\n'
    return { receipt, json, bytes: Buffer.byteLength(json) }
  }
}
