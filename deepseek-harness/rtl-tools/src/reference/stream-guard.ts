/** Admit complete bounded responses before the existing loop can dispatch tools. @module rtl-tools/reference/stream-guard */
import type { StreamChunk } from '@deepseek-ai/dsh-llm'
import { isDeepStrictEqual } from 'node:util'

/** Buffer one response, requiring a terminal finish and unrepaired JSON tool arguments.
 * @param stream - Registered provider's normalized stream.
 * @param maxBytes - Serialized response cap, not a tokenizer estimate.
 * @param observe - Persist each received chunk before admitting any tools.
 * @returns Complete chunks or a terminal rejection; never partial callable tools.
 */
export async function* guardStream(stream: AsyncIterable<StreamChunk>, maxBytes: number,
  observe: (chunk: StreamChunk) => Promise<void>): AsyncGenerator<StreamChunk> {
  const chunks: StreamChunk[] = []
  const raw = new Map<number, string>()
  const open = new Set<number>()
  let bytes = 0
  let failure: string | undefined
  let terminal: Extract<StreamChunk, { type: 'finish' }> | undefined
  for await (const chunk of stream) {
    bytes += Buffer.byteLength(JSON.stringify(chunk))
    if (bytes > maxBytes) { failure = 'Response byte limit exceeded'; break }
    await observe(chunk)
    if (terminal) { failure = 'Chunks after terminal finish'; break }
    chunks.push(chunk)
    if (chunk.type === 'block-start') {
      if (open.has(chunk.index)) failure = 'Duplicate block start'
      open.add(chunk.index)
    }
    if (chunk.type === 'block-end' && !open.delete(chunk.index)) failure = 'Block ended without start'
    if (chunk.type === 'tool-call-delta') raw.set(chunk.index, (raw.get(chunk.index) ?? '') + chunk.argumentsDelta)
    if (chunk.type === 'block-end' && chunk.block.type === 'tool-call') {
      try {
        const value: unknown = JSON.parse(raw.get(chunk.index) ?? '')
        if (!value || Array.isArray(value) || typeof value !== 'object'
          || !isDeepStrictEqual(value, JSON.parse(chunk.block.arguments))) throw new Error('Mismatched arguments')
      } catch { failure = 'Tool arguments are incomplete, invalid, or repaired by the provider' }
    }
    if (chunk.type === 'finish') terminal = chunk
  }
  if (!terminal) failure ??= 'Stream ended without terminal finish'
  if (open.size && terminal && ['stop', 'tool-calls'].includes(terminal.reason.kind)) failure ??= 'Unclosed response block'
  if (failure) {
    yield { type: 'finish', reason: { kind: 'error', failure: { code: 'RTL_STREAM_REJECTED', message: failure } } }
  } else if (terminal!.reason.kind !== 'stop' && terminal!.reason.kind !== 'tool-calls') {
    for (const chunk of chunks) if (chunk.type === 'usage') yield chunk
    yield terminal!
  } else {
    const calls = chunks.filter(chunk => chunk.type === 'block-end' && chunk.block.type === 'tool-call')
    if ((calls.length > 0) !== (terminal!.reason.kind === 'tool-calls')) {
      yield { type: 'finish', reason: { kind: 'error', failure: { code: 'RTL_STREAM_REJECTED', message: 'Tool blocks disagree with finish reason' } } }
    } else yield* chunks
  }
}
