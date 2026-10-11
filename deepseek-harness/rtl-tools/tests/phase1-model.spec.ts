import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import type { GenerateOptions, LlmCallConfig, PreparedLlmCall, StreamChunk } from '@deepseek-ai/dsh-llm'
import { ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import { callText, type ModelRuntime, type ModelObservation } from '../src/phase1/model.ts'
import { EventRecorder } from '../src/phase1/recorder.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'
import { parseRecord } from '../src/phase1/records.ts'

const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }) })
const text: StreamChunk[] = [{ type: 'block-start', index: 0, blockType: 'text' }, { type: 'text-delta', index: 0, text: 'A counter.' }, { type: 'block-end', index: 0, block: { type: 'text', text: 'A counter.' } }]
const stop: StreamChunk = { type: 'finish', reason: { kind: 'stop' } }
const settings = { model: 'mock-explicit-model', maxTokens: 32, temperature: 0, timeoutMs: 1000, maxResponseBytes: 4096 }

async function invoke(chunks: StreamChunk[], options: { hang?: boolean; timeoutMs?: number; signal?: AbortSignal; prepareError?: string; maxResponseBytes?: number; reasoningEffort?: LlmCallConfig['reasoningEffort'] } = {}) {
  const root = await mkdtemp(join(tmpdir(), 'phase1-api-mock-')); roots.push(root)
  const recorder = await EventRecorder.create(root, { experiment_id: 'mock' as PhaseId, task_id: 'text' as PhaseId, sample_id: 0, mode: 'agent' }, 65536, '1.1')
  const released = vi.fn()
  let request: GenerateOptions | undefined
  const stream = vi.fn(async function* (value: GenerateOptions) {
    request = value
    try {
      for (const chunk of chunks) yield chunk
      if (options.hang) await new Promise<void>(resolve => { if (value.signal!.aborted) resolve(); else value.signal!.addEventListener('abort', () => resolve(), { once: true }) })
    } finally { released() }
  })
  const prepareCall = vi.fn(async (config: LlmCallConfig) => {
    if (options.prepareError) throw Object.assign(new Error('secret-sk-should-not-be-logged'), { code: options.prepareError })
    return { config, stream } as unknown as PreparedLlmCall
  })
  const runtime: ModelRuntime = { prepareCall }
  let observation: ModelObservation | undefined
  try {
    const result = await callText(runtime, { ...settings, reasoningEffort: options.reasoningEffort, timeoutMs: options.timeoutMs ?? settings.timeoutMs, maxResponseBytes: options.maxResponseBytes ?? settings.maxResponseBytes }, 'Public development prompt.', recorder,
      { revision_id: 'rev' as PhaseId, call_id: 'call' as PhaseId }, options.signal ?? new AbortController().signal, value => { observation = value })
    const events = await readFile(join(recorder.directory, 'events.jsonl'), 'utf8')
    return { result, events, stream, prepareCall, released, request, observation, directory: recorder.directory }
  } finally { await recorder.close() }
}

it('assembles one stream without duplicate block-end text, records requests and cached usage, and exposes no tools', async () => {
  const s = await invoke([...text, { type: 'usage', usage: { inputTokens: 3, cacheReadTokens: 5, outputTokens: 4 } }, stop])
  expect(s.result).toMatchObject({ content: 'A counter.', error: null, dispatched: true, usage: { prompt_tokens: 8, completion_tokens: 4, source: 'provider' }, timing: { transport: 'stream', ttft_ms: null, ttft_source: 'not_collected' } })
  expect(s.prepareCall).toHaveBeenCalledTimes(1); expect(s.stream).toHaveBeenCalledTimes(1); expect(s.released).toHaveBeenCalledTimes(1)
  expect(s.request).toMatchObject({ tools: [], model: settings.model, maxTokens: 32, temperature: 0 })
  expect(s.events).toContain('Public development prompt.')
  expect(s.events).toContain('"type":"model_request"')
  expect(parseRecord('ModelResult', s.result)).toEqual(s.result)
  expect({ ...s.result, timing: { ...s.result.timing, request_wall_ms: 0 } }).toMatchSnapshot()
})

it('passes an explicit generation recovery reasoning override to prepared calls', async () => {
  const normal = await invoke([...text, stop])
  expect(normal.prepareCall.mock.calls[0]![0]).not.toHaveProperty('reasoningEffort')
  const recovery = await invoke([...text, stop], { reasoningEffort: ReasoningEffortId('off') })
  expect(recovery.prepareCall.mock.calls[0]![0]).toMatchObject({ reasoningEffort: 'off' })
  expect(recovery.request).toMatchObject({ reasoningEffort: 'off' })
})

it('archives returned reasoning and partial output before response-limit enforcement without changing ModelRecord', async () => {
  const reasoning: StreamChunk[] = [{ type: 'block-start', index: 1, blockType: 'reasoning' },
    { type: 'reasoning-delta', index: 1, text: 'Returned reasoning.' },
    { type: 'block-end', index: 1, block: { type: 'reasoning', text: 'Returned reasoning.' } }]
  const s = await invoke([...reasoning, ...text, stop])
  expect(await readFile(join(s.directory, 'reasoning.txt'), 'utf8')).toBe('Returned reasoning.')
  expect(await readFile(join(s.directory, 'output.txt'), 'utf8')).toBe('A counter.')
  expect(JSON.parse(await readFile(join(s.directory, 'transcript.json'), 'utf8'))).toMatchObject({
    reasoning_status: 'returned', response_complete: true, all_received_chunks_recorded: true, chunk_count: 7, hidden_reasoning_available: false })
  expect(s.result).not.toHaveProperty('reasoning')
  const partial = await invoke(reasoning, { maxResponseBytes: 2 })
  expect(partial.result.error?.category).toBe('truncated')
  expect(await readFile(join(partial.directory, 'reasoning.txt'), 'utf8')).toBe('Returned reasoning.')
  expect(JSON.parse(await readFile(join(partial.directory, 'transcript.json'), 'utf8'))).toMatchObject({ response_complete: false, chunk_count: 2 })
})

it.each([['AUTH', 'authentication'], ['TRANSPORT', 'connection'], ['RATE_LIMIT', 'rate_limit'], ['SERVER', 'service'], ['TIMEOUT', 'timeout'], ['MALFORMED_RESPONSE', 'parse'], ['INVALID_REQUEST', 'configuration']])('classifies %s without leaking provider exception text or retrying', async (code, category) => {
  const s = await invoke([{ type: 'finish', reason: { kind: 'error', failure: { code: code!, message: 'secret-sk-should-not-be-logged' } } }])
  expect(s.result.error?.category).toBe(category)
  expect(s.events).not.toContain('secret-sk')
  expect(await readFile(join(s.directory, 'stream.jsonl'), 'utf8')).not.toContain('secret-sk')
  expect(s.stream).toHaveBeenCalledTimes(1)
  expect(s.events.split('\n').filter(line => line.includes('"type":"model_finished"'))).toHaveLength(1)
})

it('retains a credential failure before dispatch as a parseable terminal call', async () => {
  const s = await invoke([], { prepareError: 'MISSING_CREDENTIAL' })
  expect(s.result).toMatchObject({ dispatched: false, error: { category: 'authentication' } })
  expect(s.stream).not.toHaveBeenCalled(); expect(s.events).not.toContain('secret-sk')
})

it('does not claim server cancellation when the caller aborts before dispatch', async () => {
  const s = await invoke([], { signal: AbortSignal.abort() })
  expect(s.result).toMatchObject({ dispatched: false, finish_reason: 'cancelled', server_cancellation: 'not_requested' })
  expect(s.prepareCall).not.toHaveBeenCalled(); expect(s.stream).not.toHaveBeenCalled()
})

it.each([
  [[stop], 'empty_output'],
  [[...text], 'parse'],
  [[...text, { type: 'finish', reason: { kind: 'max-tokens' } }], 'truncated'],
  [[stop, stop], 'parse'],
  [[{ type: 'text-delta', index: 0, text: 'bad' }, stop], 'parse'],
  [[{ type: 'block-start', index: 0, blockType: 'tool-call' }], 'parse'],
] as [StreamChunk[], string][])('gives incomplete/invalid streams a terminal error', async (chunks, category) => {
  expect((await invoke(chunks)).result.error?.category).toBe(category)
})

it('terminates on response quota, timeout and caller cancellation and releases the stream', async () => {
  const cases: (() => NonNullable<Parameters<typeof invoke>[1]>)[] = [() => ({ maxResponseBytes: 2 }), () => ({ hang: true, timeoutMs: 50 }), () => ({ hang: true, signal: AbortSignal.timeout(100) })]
  for (const makeOptions of cases) {
    const options = makeOptions()
    const s = await invoke(text, options)
    expect(s.result.error?.category).toBe(options.maxResponseBytes ? 'truncated' : options.timeoutMs ? 'timeout' : 'cancelled')
    expect(s.released).toHaveBeenCalledTimes(1)
    expect(s.result.server_cancellation).toBe('unconfirmed')
    expect(s.observation).toMatchObject({ caller_cancelled: options.signal !== undefined, deadline_expired: options.timeoutMs !== undefined,
      provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null } })
  }
})
