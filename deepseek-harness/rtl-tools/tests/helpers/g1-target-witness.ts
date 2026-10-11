/** Target-local observations; lifecycle and hook deadlines remain owned by TestOperationScope. */
import { hrtime } from 'node:process'
import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, join, relative } from 'node:path'
import type { SubprocessHandle, SubprocessSpawnSpec } from '@deepseek-ai/dsh-subprocess'
import { vi } from 'vitest'
import type { TestOperationScope } from '../test-operation-scope.ts'

function publicControlState(value: unknown): object {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) throw new Error('Invalid public state object')
  const state = value as Record<string, unknown>
  const select = (input: unknown, keys: readonly string[]) => {
    const fields: Record<string, unknown> = {}
    if (typeof input !== 'object' || input === null || Array.isArray(input)) return fields
    const record = input as Record<string, unknown>
    for (const key of keys) {
      const field = record[key]
      if (field === null || ['string', 'number', 'boolean'].includes(typeof field)) fields[key] = field
    }
    return fields
  }
  const paths = (input: unknown) => Array.isArray(input) ? input.filter((path): path is string => typeof path === 'string') : null
  const loop = typeof state.loop === 'object' && state.loop !== null ? state.loop as Record<string, unknown> : undefined
  return { ...select(state, ['schema_version', 'experiment_id', 'fixture', 'configuration_sha256', 'seq', 'phase', 'operation', 'outcome', 'attempts', 'active_ms', 'review_wait_ms', 'calibrated', 'calibration_run', 'verification_run']),
    current: select(state.current, ['revision_id', 'parent_revision', 'source_sha256', 'response_sha256', 'feedback_sha256', 'experiment_id', 'configuration_sha256', 'kind']),
    model_runs: paths(state.model_runs), verification_runs: paths(state.verification_runs),
    p09: select(state.p09, ['variant_id', 'model_requests_total', 'transport_retries', 'initial_generation_requests', 'negative_calibration_run']),
    auto: select(state.auto, ['tool_steps', 'verifications', 'pending_verification']),
    rounds: Array.isArray(loop?.rounds) ? loop.rounds.map(round => select(round, ['semantic_repair_round', 'prompt_current_source_sha256', 'feedback_sha256', 'verification_run', 'outcome'])) : null,
    projection_only_not_state_validation: true, private_fields_selected: false }
}

/** In-memory observer for one explicitly selected test; unknown producer boundaries stay null. */
export class TargetWitness {
  private readonly events: object[] = []
  private omitted = 0
  private commandCount = 0
  private lifecycleErrors = 0
  private readonly commandTotals = {
    NATIVE: { dispatched: 0, resolved: 0, rejected: 0 },
    LOGICAL_OUTPUT: { dispatched: 0, resolved: 0, rejected: 0 },
    LOGICAL_VERSION: { dispatched: 0, resolved: 0, rejected: 0 },
  }
  private readonly live = new Map<number, SubprocessSpawnSpec>()
  constructor(readonly target: string, private readonly directory = process.env.G1_TARGET_AUDIT,
    private readonly lifecycleTrace = process.env.G1_NATIVE_LIFECYCLE_TRACE === '1') {
    if (!/^[A-Za-z0-9-]+$/.test(target)) throw new Error('Invalid target identity')
  }

  /** Record a bounded event on this worker's monotonic clock. */
  record(kind: string, value: object = {}): void {
    if (this.events.length < 512) this.events.push({ ns: hrtime.bigint().toString(), kind, ...value })
    else this.omitted++
  }

  /** Record public control identities; model messages and private state payloads are excluded. */
  recordState(kind: string, state: unknown): void { this.record(kind, { state: publicControlState(state) }) }

  /** Observe the same native or logical handle without consuming streams or acquiring lifecycle ownership. */
  observe(spec: SubprocessSpawnSpec, handle: SubprocessHandle, execution: 'NATIVE' | 'LOGICAL_OUTPUT' | 'LOGICAL_VERSION'): SubprocessHandle {
    const command = ++this.commandCount
    const totals = this.commandTotals[execution]
    totals.dispatched++
    if (execution === 'NATIVE') this.live.set(command, spec)
    this.record('command_dispatch', { command, execution, argv: spec.argv, cwd: spec.cwd, actual_deadline_ns: null,
      boundary: 'handle returned; call start is separately observed', target_start_ns: null, cancellation_source: null, signal_id: `command-${command}` })
    const aborted = () => this.record('command_signal_abort', { command, reason: String(spec.signal?.reason),
      caller: null, stage: null, total: null, watcher_stop: null, test_teardown: null })
    spec.signal?.addEventListener('abort', aborted, { once: true })
    for (const [channel, stream] of [['stdout', handle.stdout], ['stderr', handle.stderr]] as const) {
      if (!stream) continue
      const push = stream.push.bind(stream)
      let firstOutput = true
      vi.spyOn(stream, 'push').mockImplementation((chunk, encoding) => {
        if (this.lifecycleTrace && chunk !== null && firstOutput) {
          try {
            const bytes = typeof chunk === 'string' ? Buffer.byteLength(chunk, encoding) : ArrayBuffer.isView(chunk) ? chunk.byteLength : null
            if (bytes !== null && bytes > 0) {
              firstOutput = false
              this.record('first_output_received', { command, channel, execution, bytes,
                boundary: 'worker stream.push observation; producer execution and OS target spawn are not observed' })
            }
          } catch { this.lifecycleErrors++ }
        }
        if (chunk !== null && /PHASE1_COMPLETE|Mismatches:|ERROR:|Vivado Simulator/.test(String(chunk))) this.record('relevant_output', { command, channel, text: String(chunk).slice(0, 512), truncated: String(chunk).length > 512 })
        return push(chunk, encoding)
      })
      stream.once('end', () => this.record('stream_end', { command, channel }))
      stream.once('close', () => this.record('stream_close', { command, channel }))
    }
    void handle.done.then(outcome => { totals.resolved++; spec.signal?.removeEventListener('abort', aborted); this.live.delete(command); this.record('direct_outcome', { command, outcome }) }, (error: unknown) => { totals.rejected++; spec.signal?.removeEventListener('abort', aborted); this.live.delete(command); this.record('direct_error', { command, error: String(error) }) })
    return handle
  }

  /** Bind readiness to an unsettled real simulation dispatch for this exact run's build directory. */
  liveSimulation(build: string): { command: number; cwd: string; argv: readonly string[] } | undefined {
    for (const [command, spec] of this.live) if (spec.cwd === build && spec.argv.includes('-tclbatch')) return { command, cwd: spec.cwd, argv: spec.argv }
    return undefined
  }

  /** Save bounded public receipts after scope settlement and before owned roots are removed; failure retains roots. */
  async capture(scope: TestOperationScope, roots: readonly string[]): Promise<boolean> {
    const directory = this.directory
    if (!directory) return scope.bodyErrors().length > 0
    const target = join(directory, `${scope.id}-${this.target}`)
    const files: object[] = [], links: string[] = []
    let bytes = 0, omittedFiles = 0
    this.record('capture_after_scope_settlement', { scope_id: scope.id, pending: scope.pendingOperations, body_errors: scope.bodyErrors(),
      test_teardown: scope.signal.aborted, other_signal_sources: null })
    try {
      if ((await lstat(directory)).isSymbolicLink()) throw new Error('Linked capture directory refused')
      await mkdir(target)
      async function visit(source: string, destination: string, depth: number): Promise<void> {
        const info = await lstat(source)
        if (info.isSymbolicLink()) { links.push(source); return }
        if (info.isDirectory()) {
          if (depth > 5) { omittedFiles++; return }
          await mkdir(destination, { recursive: true })
          for (const entry of await readdir(source)) await visit(join(source, entry), join(destination, entry), depth + 1)
        } else if (info.isFile() && /^(state\.json|result\.json|filesystem-error\.json|events\.jsonl|child\.pid|child-ready\.json|last-stage|.*\.(stdout|stderr)\.log)$/.test(basename(source))) {
          if (files.length >= 256 || bytes + info.size > 4_000_000) { omittedFiles++; return }
          const original = await readFile(source), projected = basename(source) === 'state.json'
          const data = projected ? Buffer.from(JSON.stringify(publicControlState(JSON.parse(original.toString()))) + '\n') : original
          if (bytes + data.length > 4_000_000) { omittedFiles++; return }
          await writeFile(destination, data, { flag: 'wx' }); bytes += data.length
          files.push({ source, retained_path: relative(target, destination), bytes: data.length, public_state_projection: projected,
            source_sha256: projected ? createHash('sha256').update(original).digest('hex') : undefined })
        }
      }
      for (let i = 0; i < roots.length; i++) await visit(roots[i]!, join(target, `root-${i + 1}`), 0)
      this.record('capture_public_files_complete', { files: files.length, bytes, omitted_files: omittedFiles })
      await writeFile(join(target, 'observation.json'), JSON.stringify({ target: this.target, scope_id: scope.id, clock: 'worker process.hrtime.bigint; cross-process clocks not subtracted',
        owned_roots: roots, primary_errors: scope.bodyErrors(), pending_at_capture: scope.pendingOperations, events: this.events, cap: 512, omitted_events: this.omitted,
        files, bytes, omitted_files: omittedFiles, links_not_followed: links, capture_error: null, registered_writers_settled: true,
        range_proof_source: 'FIX07_SCOPE_AUDIT managed_ranges; observer identities do not identify OS processes',
        lifecycle_trace: { enabled: this.lifecycleTrace, observer_errors: this.lifecycleErrors,
          first_output_boundary: 'worker receive only; runner/target spawn remain unobserved',
          cross_process_clock_subtraction: false },
        command_totals: this.commandTotals, live_native_dispatches: this.live.size,
        event_sequence_complete: this.omitted === 0 && this.lifecycleErrors === 0,
        final_counter_boundary: 'actual observed handles and direct Promise reactions; independent Scope supplies range proof' }, null, 2) + '\n', { flag: 'wx' })
      return scope.bodyErrors().length > 0
    } catch (error) {
      console.error('Target capture failed; primary error preserved and roots retained', JSON.stringify({ target: this.target, roots, primary_errors: scope.bodyErrors(), capture_error: String(error) }))
      return true
    }
  }
}
