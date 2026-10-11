/** Append-only project events and atomic terminal results. @module rtl-tools/phase1/recorder */
import { chmod, mkdtemp, open, readFile, realpath, rename, type FileHandle } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { parseContract, stages, type ModelResult, type PhaseId, type RunIdentity, type RunResult, type StageResult } from './contracts.ts'
import { parseRecord, type ModelRecord, type StageRecord, type RunRecord } from './records.ts'
import type { ContextAudit } from './p09-context.ts'
import type { EvidenceAccess } from './evidence-access.ts'

/** Correlation keys are host-assigned, not inferred from log text. */
export interface EventLink { revision_id: PhaseId | null; call_id: PhaseId }
/** Only domain data is loggable; credentials and transport headers have no event fields. */
export type EventInput =
  | { type: 'agent_request' | 'agent_response'; link: EventLink; value: Record<string, unknown> }
  | { type: 'model_context'; link: EventLink; value: ContextAudit }
  | { type: 'model_started'; link: EventLink; value: { prompt: string; system?: string } }
  | { type: 'model_request'; link: EventLink; value: { prompt: string; system?: string; provider: string; model: string; maxTokens: number; temperature: number; reasoningEffort: string | null; transport: 'stream'; tools: [] } }
  | { type: 'model_finished'; link: EventLink; value: ModelResult | ModelRecord }
  | { type: 'stage_started'; link: EventLink; value: { stage: StageResult['stage'] } }
  | { type: 'stage_finished'; link: EventLink; value: StageResult | StageRecord }

/**
 * Publish complete JSON through an exclusive temporary file and same-directory rename.
 * @param directory - host-owned directory, never candidate-controlled.
 * @param name - fixed caller-owned filename.
 * @param value - already-validated JSON-serializable data.
 * @param access - optional same-run coordination shared with live metadata scans.
 * @param signal - original deadline/cancellation; terminal owner publication may omit it.
 */
export async function atomicJson(directory: string, name: string, value: unknown, access?: EvidenceAccess, signal?: AbortSignal): Promise<void> {
  access?.assertPath(join(directory, name))
  const publish = async (current?: AbortSignal) => {
    current?.throwIfAborted()
    const temp = join(directory, `.${randomUUID()}.tmp`)
    const handle = await open(temp, 'wx', 0o600)
    try {
      current?.throwIfAborted()
      await handle.writeFile(JSON.stringify(value, null, 2) + '\n')
      current?.throwIfAborted()
      await handle.sync()
    } finally { await handle.close() }
    current?.throwIfAborted()
    await rename(temp, join(directory, name))
    // An in-flight rename must settle even if cancellation arrives after its commit point.
    current?.throwIfAborted()
  }
  if (access) await access.run('atomic_json:' + name, publish, signal)
  else await publish(signal)
}

/** Serial durable writer. The host owns the directory for its entire lifetime. */
export class EventRecorder {
  private queue: Promise<void> = Promise.resolve()
  private closing = false
  private seq = 0
  private readonly started = performance.now()

  private constructor(readonly directory: string, private readonly identity: RunIdentity, private readonly file: FileHandle, private readonly maxEventBytes: number, private readonly version: '1.0' | '1.1' | '1.3') {}

  /**
   * Allocate one private independent sample and persist its start before returning.
   * @param parent - existing host-owned output directory.
   * @param identity - externally validated sample identifiers.
   * @param maxEventBytes - positive deployment cap; overflow fails, never silently truncates evidence.
   * @param version - project record generation; existing callers remain on 1.0.
   * @returns a recorder which the caller must close, including on failure.
   */
  static async create(parent: string, identity: RunIdentity, maxEventBytes: number, version: '1.0' | '1.1' | '1.3' = '1.0'): Promise<EventRecorder> {
    parseContract('RunResult', unfinished(identity))
    if (!Number.isSafeInteger(maxEventBytes) || maxEventBytes < 1) throw new Error('Invalid event byte limit')
    const directory = await mkdtemp(join(await realpath(parent), 'run-'))
    if (process.platform !== 'win32') await chmod(directory, 0o700)
    const file = await open(join(directory, 'events.jsonl'), 'wx', 0o600)
    const recorder = new EventRecorder(directory, structuredClone(identity), file, maxEventBytes, version)
    try {
      await atomicJson(directory, 'run.json', { schema_version: version, ...identity, state: 'RUNNING' })
      await recorder.write('run_started', null, null)
      return recorder
    } catch (error) { await file.close(); throw error }
  }

  private async write(type: string, link: EventLink | null, value: unknown): Promise<void> {
    const event = { schema_version: this.version, ...this.identity, revision_id: link?.revision_id ?? null, call_id: link?.call_id ?? null,
      seq: this.seq, timestamp: new Date().toISOString(), elapsed_ms: Math.round(performance.now() - this.started), type, value }
    const line = JSON.stringify(event) + '\n'
    if (Buffer.byteLength(line) > this.maxEventBytes) throw new Error('Event byte limit exceeded')
    await this.file.writeFile(line)
    await this.file.sync()
    this.seq++
  }

  /**
   * Append validated request or stage facts in invocation order and flush them to disk.
   * @param input - no HTTP headers, credentials, or arbitrary metadata fields.
   * @returns persistence completion; a failed write poisons subsequent writes.
   */
  append(input: EventInput): Promise<void> {
    if (this.closing) return Promise.reject(new Error('Recorder is closed or terminal'))
    for (const id of [input.link.revision_id, input.link.call_id]) {
      if (id !== null && !/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/.test(id)) throw new Error('Invalid event identifier')
    }
    let value: unknown
    switch (input.type) {
      case 'agent_request': case 'agent_response': value = structuredClone(input.value); break
      case 'model_context': value = structuredClone(input.value); break
      case 'model_started':
        if (typeof input.value.prompt !== 'string') throw new Error('Missing model request prompt')
        value = { prompt: input.value.prompt, ...(input.value.system === undefined ? {} : { system: input.value.system }) }
        break
      case 'model_finished':
        value = parseRecord('ModelResult', input.value)
        if (input.value.call_id !== input.link.call_id) throw new Error('Model call correlation mismatch')
        break
      case 'model_request':
        value = { prompt: input.value.prompt, provider: input.value.provider, model: input.value.model, maxTokens: input.value.maxTokens, temperature: input.value.temperature,
          reasoningEffort: input.value.reasoningEffort, transport: input.value.transport, tools: [], ...(input.value.system === undefined ? {} : { system: input.value.system }) }
        break
      case 'stage_started':
        if (!stages.includes(input.value.stage)) throw new Error('Unknown stage')
        value = { stage: input.value.stage }
        break
      case 'stage_finished': value = parseRecord('StageResult', input.value); break
    }
    const link = structuredClone(input.link)
    const type = input.type
    this.queue = this.queue.then(() => this.write(type, link, value))
    return this.queue
  }

  /**
   * Persist the terminal event then atomically publish its result. This prevents further appends.
   * @param input - validated final accounting for exactly this independent sample.
   * @returns completion of the terminal file publication.
   */
  finish(input: RunResult | RunRecord): Promise<void> {
    if (this.closing) return Promise.reject(new Error('Recorder is closed or terminal'))
    const result = parseRecord('RunResult', input)
    for (const key of ['experiment_id', 'task_id', 'sample_id', 'mode'] as const) {
      if (result[key] !== this.identity[key]) throw new Error('Run identity mismatch')
    }
    this.closing = true
    this.queue = this.queue.then(async () => {
      await this.write('run_finished', null, result)
      await atomicJson(this.directory, 'result.json', result)
    })
    return this.queue
  }

  /** Wait for pending writes and release the file, even after a failed write. */
  async close(): Promise<void> {
    this.closing = true
    try { await this.queue } finally { await this.file.close() }
  }
}

function unfinished(identity: RunIdentity): RunResult {
  return { schema_version: '1.0', ...identity, final_status: 'ABORTED', final_revision_id: null, final_source_sha256: null,
    verification_key: null, final_verified: false, stages: { compile: null, elaborate: null, simulation: null, synthesis: null },
    semantic_repairs: 0, model_requests_total: 0, transport_retries: 0, stop_reason: 'Incomplete run; owner termination not yet established.', artifact_manifest: [] }
}

/**
 * Identify missing terminal results without declaring a possibly live process dead.
 * @param directory - trusted run directory; unknown/corrupt metadata rejects.
 * @returns a final result or explicit INCOMPLETE state; never drops a missing result.
 */
export async function inspectRun(directory: string): Promise<{ state: 'TERMINAL'; result: RunResult | RunRecord } | { state: 'INCOMPLETE'; identity: RunIdentity }> {
  const manifest = JSON.parse(await readFile(join(directory, 'run.json'), 'utf8')) as Record<string, unknown>
  if (!['1.0', '1.1', '1.3'].includes(String(manifest.schema_version)) || manifest.state !== 'RUNNING') throw new Error('Invalid running manifest')
  const identity = { experiment_id: manifest.experiment_id, task_id: manifest.task_id, sample_id: manifest.sample_id, mode: manifest.mode } as RunIdentity
  parseContract('RunResult', unfinished(identity))
  let text: string
  try { text = await readFile(join(directory, 'result.json'), 'utf8') } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { state: 'INCOMPLETE', identity }
    throw error
  }
  const result = parseRecord('RunResult', JSON.parse(text))
  for (const key of ['experiment_id', 'task_id', 'sample_id', 'mode'] as const) if (result[key] !== identity[key]) throw new Error('Terminal identity mismatch')
  return { state: 'TERMINAL', result }
}
