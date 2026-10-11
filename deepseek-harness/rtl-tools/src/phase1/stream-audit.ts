/** Bounded public projection, independent of semantic assembly and complete stream archives. @module rtl-tools/phase1/stream-audit */
import { createHash } from 'node:crypto'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'

/** Public normalized-array facts; omission never describes semantic or HTTP truncation. */
export interface StreamAuditMetadata {
  truncated: boolean
  original_bytes: number
  retained_bytes: number
  original_chunks: number
  retained_chunks: number
  omitted_chunks: number
  omitted_critical_chunks: number
  original_sha256: string
  hash_encoding: 'sanitized normalized chunks, JSON plus LF'
  omitted_fields: string[]
  terminal_metadata_preserved: boolean
  audit_error: 'AUDIT_METADATA_LIMIT' | null
  full_normalized_transcript: 'stream.jsonl'
}

/**
 * Reuse the complete transcript's finish-failure projection without retaining transport error text.
 * @param chunk - unchanged consumer-visible normalized chunk.
 * @returns the public chunk representation; semantic consumers still receive the original chunk.
 */
export function normalizeChunk(chunk: StreamChunk): unknown {
  if (chunk.type === 'finish' && (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted')) {
    const failure = chunk.reason.failure
    return { type: 'finish', reason: { kind: chunk.reason.kind,
      code: /^[A-Z_]+$/.test(failure.code) ? failure.code : 'UNKNOWN',
      status: 'status' in failure && typeof failure.status === 'number' ? failure.status : null },
      ...(chunk.providerProtocolComplete === true ? { providerProtocolComplete: true } : {}) }
  }
  return chunk
}

/** Retain a bounded ordinary prefix and fitting usage/finish chunks; never owns a provider iterator. */
export class StreamAudit {
  readonly chunks: unknown[] = []
  private bytes = 2
  private originalBytes = 2
  private count = 0
  private omitted = 0
  private omittedCritical = 0
  private auditError: 'AUDIT_METADATA_LIMIT' | null = null
  private finished = false
  private readonly digest = createHash('sha256')

  /** @param limit - exact compact JSON-array UTF-8 budget; 4096 bytes stay reserved for terminal chunks. */
  constructor(private readonly limit: number) {
    if (!Number.isFinite(limit) || limit < 2) throw new Error('INVALID_AUDIT_LIMIT')
  }

  /**
   * Count and hash every public chunk, retaining only fitting detached payloads.
   * Ordinary overflow omits whole chunks. Critical overflow records an audit error and continues observation.
   * @param chunk - original normalized chunk; no semantic content or caller object is modified.
   */
  append(chunk: StreamChunk): void {
    if (this.finished) throw new Error('AUDIT_ALREADY_FINISHED')
    const serialized = JSON.stringify(normalizeChunk(chunk))
    const payloadBytes = Buffer.byteLength(serialized)
    this.digest.update(serialized + '\n')
    this.originalBytes += payloadBytes + (this.count++ ? 1 : 0)
    const critical = chunk.type === 'usage' || chunk.type === 'finish'
    const size = payloadBytes + (this.chunks.length ? 1 : 0)
    if (!critical && (this.omitted > 0 || this.bytes + size > this.limit - 4096)) { this.omitted++; return }
    if (this.bytes + size > this.limit) {
      this.omitted++; this.omittedCritical++; this.auditError = 'AUDIT_METADATA_LIMIT'; return
    }
    this.chunks.push(JSON.parse(serialized)); this.bytes += size
  }

  /**
   * Finalize once after observation; preserved terminal metadata means every received critical chunk fitted.
   * The SHA-256 covers sanitized chunk JSON plus LF, whereas byte counts cover compact arrays including brackets and commas.
   * @returns metadata outside the bounded chunk array; omitted payloads are absent from all projection state.
   */
  finish(): StreamAuditMetadata {
    if (this.finished) throw new Error('AUDIT_ALREADY_FINISHED')
    this.finished = true
    return { truncated: this.omitted > 0, original_bytes: this.originalBytes, retained_bytes: this.bytes,
      original_chunks: this.count, retained_chunks: this.chunks.length, omitted_chunks: this.omitted,
      omitted_critical_chunks: this.omittedCritical, original_sha256: this.digest.digest('hex'),
      hash_encoding: 'sanitized normalized chunks, JSON plus LF',
      omitted_fields: [...(this.omitted > this.omittedCritical ? ['verbose normalized stream chunks'] : []),
        ...(this.omittedCritical ? ['critical normalized stream metadata'] : [])],
      terminal_metadata_preserved: this.omittedCritical === 0, audit_error: this.auditError,
      full_normalized_transcript: 'stream.jsonl' }
  }
}
