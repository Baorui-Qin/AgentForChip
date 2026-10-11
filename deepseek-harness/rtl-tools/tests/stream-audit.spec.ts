import { createHash } from 'node:crypto'
import { expect, it } from 'vitest'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'
import { normalizeChunk, StreamAudit } from '../src/phase1/stream-audit.ts'

const usage: StreamChunk = { type: 'usage', usage: { inputTokens: 101, cacheReadTokens: 7, outputTokens: 53, totalTokens: 161 } }
const stop: StreamChunk = { type: 'finish', reason: { kind: 'stop' } }

it.each([8192, 4096])('omits one oversized multibyte chunk while preserving critical metadata in an independent %i-byte array', limit => {
  const audit = new StreamAudit(limit)
  const chunk: StreamChunk = { type: 'reasoning-delta', index: 0, text: '理'.repeat(10000) }
  const observed = [chunk, usage, stop]
  for (const item of observed) audit.append(item)
  const metadata = audit.finish()
  expect(audit.chunks).toEqual([usage, stop])
  expect(metadata).toMatchObject({ truncated: true, original_chunks: 3, retained_chunks: 2, omitted_chunks: 1,
    omitted_critical_chunks: 0, terminal_metadata_preserved: true, audit_error: null })
  expect(metadata.original_bytes).toBe(Buffer.byteLength(JSON.stringify(observed)))
  expect(metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
  expect(metadata.retained_bytes).toBeLessThanOrEqual(limit)
  const digest = createHash('sha256')
  for (const item of observed) digest.update(JSON.stringify(item) + '\n')
  expect(metadata.original_sha256).toBe(digest.digest('hex'))
})

it('retains an exact 4096-byte UTF-8 ordinary prefix under the 8192-byte budget and omits the next whole chunk', () => {
  const audit = new StreamAudit(8192)
  const prefix: StreamChunk = { type: 'text-delta', index: 0, text: '' }
  const textBytes = 4096 - Buffer.byteLength(JSON.stringify([prefix]))
  prefix.text = '理'.repeat(Math.floor(textBytes / 3)) + 'x'.repeat(textBytes % 3)
  expect(Buffer.byteLength(JSON.stringify([prefix]))).toBe(4096)
  audit.append(prefix)
  audit.append({ type: 'text-delta', index: 0, text: 'next' })
  audit.append(usage); audit.append(stop)
  expect(audit.chunks).toEqual([prefix, usage, stop])
  const metadata = audit.finish()
  expect(metadata).toMatchObject({ original_chunks: 4, retained_chunks: 3, omitted_chunks: 1, audit_error: null })
  expect(metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
  expect(metadata.retained_bytes).toBeLessThanOrEqual(8192)
})

it('counts JSON escapes and commas and snapshots only retained payloads at append time', () => {
  const audit = new StreamAudit(8192)
  const chunk: StreamChunk = { type: 'reasoning-delta', index: 0, text: '理"\\\n\t' }
  const original = JSON.stringify([chunk, usage, stop])
  audit.append(chunk); chunk.text = 'changed after append'.repeat(10000)
  audit.append(usage); audit.append(stop)
  expect(JSON.stringify(audit.chunks)).toBe(original)
  const metadata = audit.finish()
  expect(metadata.original_bytes).toBe(Buffer.byteLength(original))
  expect(metadata.retained_bytes).toBe(Buffer.byteLength(original))
  expect(metadata.omitted_chunks).toBe(0)
})

it('keeps a bounded prefix while incrementally observing thousands of omitted chunks and their later terminal metadata', () => {
  const audit = new StreamAudit(8192)
  const chunk: StreamChunk = { type: 'reasoning-delta', index: 0, text: 'x' }
  for (let i = 0; i < 100; i++) audit.append(chunk)
  const prefixCount = audit.chunks.length
  for (let i = 0; i < 12000; i++) audit.append(chunk)
  expect(audit.chunks).toHaveLength(prefixCount)
  expect(Buffer.byteLength(JSON.stringify(audit.chunks))).toBeLessThanOrEqual(4096)
  audit.append(usage); audit.append(stop)
  const metadata = audit.finish()
  expect(metadata.original_chunks).toBe(12102)
  expect(metadata.omitted_chunks).toBe(12100 - prefixCount)
  expect(metadata.retained_chunks).toBe(prefixCount + 2)
  expect(audit.chunks.slice(-2)).toEqual([usage, stop])
  expect(metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
})

it.each([8192, 4096])('records explicit critical overflow without throwing or losing later observations in a %i-byte array', limit => {
  const audit = new StreamAudit(limit)
  const oversized: StreamChunk = { type: 'finish', reason: { kind: 'stop' }, replayState: { response: '理'.repeat(limit) } }
  expect(() => audit.append(oversized)).not.toThrow()
  audit.append(usage); audit.append(stop)
  const metadata = audit.finish()
  expect(audit.chunks).toEqual([usage, stop])
  expect(metadata).toMatchObject({ audit_error: 'AUDIT_METADATA_LIMIT', terminal_metadata_preserved: false,
    original_chunks: 3, retained_chunks: 2, omitted_chunks: 1, omitted_critical_chunks: 1 })
  expect(metadata.original_bytes).toBe(Buffer.byteLength(JSON.stringify([oversized, usage, stop])))
  expect(metadata.retained_bytes).toBe(Buffer.byteLength(JSON.stringify(audit.chunks)))
  expect(metadata.retained_bytes).toBeLessThanOrEqual(limit)
  expect(JSON.stringify(metadata)).not.toContain('OUTPUT_TRUNCATED')
})

it.each(['error', 'aborted'] as const)('reuses unchanged %s finish sanitization and hashes only the public representation', kind => {
  const chunk: StreamChunk = { type: 'finish', reason: { kind, failure: { code: 'SERVER', status: 503, message: 'unsafe provider detail' } } }
  const normalized = { type: 'finish', reason: { kind, code: 'SERVER', status: 503 } }
  expect(normalizeChunk(chunk)).toEqual(normalized)
  const audit = new StreamAudit(4096); audit.append(chunk)
  const metadata = audit.finish()
  expect(audit.chunks).toEqual([normalized])
  expect(metadata.original_bytes).toBe(Buffer.byteLength(JSON.stringify([normalized])))
  expect(metadata.original_sha256).toBe(createHash('sha256').update(JSON.stringify(normalized) + '\n').digest('hex'))
  expect(JSON.stringify(audit.chunks)).not.toContain('unsafe provider detail')
  expect('failure' in chunk.reason && chunk.reason.failure.message).toBe('unsafe provider detail')
})

it('preserves current failure code and unavailable status rules without adding a second sanitizer', () => {
  const chunk: StreamChunk = { type: 'finish', reason: { kind: 'error', failure: { code: 'unsafe-code', message: 'unsafe' } } }
  expect(normalizeChunk(chunk)).toEqual({ type: 'finish', reason: { kind: 'error', code: 'UNKNOWN', status: null } })
  const uppercase: StreamChunk = { type: 'finish', reason: { kind: 'error', failure: { code: 'S'.repeat(200), message: 'unsafe' } } }
  expect(normalizeChunk(uppercase)).toEqual({ type: 'finish', reason: { kind: 'error', code: 'S'.repeat(200), status: null } })
})

it('accepts the exact half-event budget without flooring and rejects budgets that cannot encode an empty array', () => {
  const audit = new StreamAudit(8193 / 2); audit.append(usage); audit.append(stop)
  const metadata = audit.finish()
  expect(metadata.retained_bytes).toBeLessThanOrEqual(8193 / 2)
  for (const limit of [1, -1, NaN, Infinity]) expect(() => new StreamAudit(limit)).toThrow('INVALID_AUDIT_LIMIT')
})

it('finalizes once and refuses later append without retaining an additional payload', () => {
  const audit = new StreamAudit(8192)
  expect(audit.finish()).toMatchObject({ original_bytes: 2, retained_bytes: 2, original_chunks: 0, retained_chunks: 0,
    omitted_chunks: 0, terminal_metadata_preserved: true, audit_error: null })
  expect(() => audit.append(usage)).toThrow('AUDIT_ALREADY_FINISHED')
  expect(() => audit.finish()).toThrow('AUDIT_ALREADY_FINISHED')
  expect(audit.chunks).toEqual([])
})
