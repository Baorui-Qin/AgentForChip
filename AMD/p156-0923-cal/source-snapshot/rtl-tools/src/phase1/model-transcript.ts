/** Incremental consumer-visible model evidence, separate from released result records. @module rtl-tools/phase1/model-transcript */
import { open, type FileHandle } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { BlockAssembler, type StreamChunk } from '@deepseek-ai/dsh-llm'
import { publish } from './candidates.ts'

/** Append every received normalized chunk before parsing or enforcing response limits. */
export class ModelTranscript {
  private readonly started = performance.now()
  private readonly assembler = new BlockAssembler()
  private readonly digest = createHash('sha256')
  private count = 0
  private bytes = 0
  private finishKind: string | null = null
  private reasoningReceived = false

  private constructor(private readonly root: string, private readonly file: FileHandle) {}

  /** Create exclusive evidence files. @param root - private model-run directory. @returns owned transcript writer. */
  static async create(root: string): Promise<ModelTranscript> {
    return new ModelTranscript(root, await open(join(root, 'stream.jsonl'), 'wx', 0o600))
  }

  /** Persist normalized output, omitting unsafe transport error text. @param chunk - next consumer-visible provider chunk. */
  async append(chunk: StreamChunk): Promise<void> {
    let logged: unknown = chunk
    if (chunk.type === 'finish') {
      this.finishKind = chunk.reason.kind
      if (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted') {
        const failure = chunk.reason.failure
        logged = { type: 'finish', reason: { kind: chunk.reason.kind,
          code: /^[A-Z_]+$/.test(failure.code) ? failure.code : 'UNKNOWN',
          status: 'status' in failure && typeof failure.status === 'number' ? failure.status : null } }
      }
    }
    const line = JSON.stringify({ seq: this.count, elapsed_ms: Math.round(performance.now() - this.started), chunk: logged }) + '\n'
    await this.file.writeFile(line)
    this.digest.update(line); this.bytes += Buffer.byteLength(line); this.count++
    if (chunk.type === 'reasoning-delta' || chunk.type === 'block-end' && chunk.block.type === 'reasoning') this.reasoningReceived = true
    this.assembler.push(chunk)
  }

  /** Retain partial text and finalize hashes even on model failure. @param terminal - host verdict, distinct from stream completeness. */
  async finish(terminal: { complete: boolean; error: string | null }): Promise<void> {
    try { await this.file.sync() } finally { await this.file.close() }
    const blocks = this.assembler.interruptedBlocks()
    const reasoning = blocks.filter(b => b.type === 'reasoning').map(b => b.text).join('')
    const output = blocks.filter(b => b.type === 'text').map(b => b.text).join('')
    await publish(this.root, 'reasoning.txt', reasoning)
    await publish(this.root, 'output.txt', output)
    const entry = (value: string) => ({ bytes: Buffer.byteLength(value), sha256: createHash('sha256').update(value).digest('hex') })
    await publish(this.root, 'transcript.json', JSON.stringify({ schema_version: 'p10-model-transcript-1',
      source: 'harness_normalized_provider_stream', hidden_reasoning_available: false,
      reasoning_status: this.reasoningReceived ? 'returned' : 'not_returned',
      all_received_chunks_recorded: true, chunk_count: this.count, provider_finish_kind: this.finishKind,
      response_complete: terminal.complete, error: terminal.error,
      files: { 'stream.jsonl': { bytes: this.bytes, sha256: this.digest.digest('hex') }, 'reasoning.txt': entry(reasoning), 'output.txt': entry(output) },
      exclusions: ['transport headers and credentials', 'raw transport exception text', 'provider-internal or unpublished reasoning'],
    }, null, 2))
  }
}
