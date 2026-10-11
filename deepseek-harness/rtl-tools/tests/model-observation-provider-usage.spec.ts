import { expect, it } from 'vitest'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'
import { ModelTelemetry } from '../src/phase1/model-observation.ts'

const usage: StreamChunk = { type: 'usage', usage: { inputTokens: 101, cacheReadTokens: 7, outputTokens: 53, totalTokens: 161 } }
const stop: StreamChunk = { type: 'finish', reason: { kind: 'stop' } }

async function observe(chunks: StreamChunk[], complete = false) {
  const telemetry = new ModelTelemetry()
  for await (const _chunk of telemetry.stream(async function* () { yield* chunks })) { /* Observe the complete normalized stream. */ }
  telemetry.finish(0, complete)
  return telemetry.value
}

it('initializes unavailable accounting and public terminal facts for a new call', () => {
  expect(new ModelTelemetry().value).toMatchObject({ provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null },
    usage_observation_source: null, usage_samples: 0, usage_conflict: false, provider_stream_exhausted: false,
    terminal_read_error_code: null, caller_cancelled: false, deadline_expired: false })
})

it('classifies missing usage at normal EOF independently from semantic rejection', async () => {
  expect(await observe([stop], false)).toMatchObject({ provider_usage: { state: 'USAGE_MISSING_PROVIDER', total_tokens: null },
    model_response_complete: false, finish_received: true, usage_received: false, provider_stream_exhausted: true })
})

it('does not use a stop finish instead of EOF after the consumer stops', async () => {
  const telemetry = new ModelTelemetry()
  let returned = false
  for await (const _chunk of telemetry.stream(async function* () {
    try { yield stop; yield usage } finally { returned = true }
  })) { break }
  telemetry.finish(0, false)
  expect(returned).toBe(true)
  expect(telemetry.value).toMatchObject({ provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null },
    finish_received: true, usage_received: false, provider_stream_exhausted: false })
})

it.each(['error', 'aborted'] as const)('keeps normalized %s EOF separate from normal provider completion', async kind => {
  const value = await observe([{ type: 'finish', reason: { kind, failure: { code: kind === 'error' ? 'TRANSPORT' : 'ABORTED', message: 'SECRET' } } }])
  expect(value).toMatchObject({ provider_usage: { state: 'USAGE_LOST_HOST', source: 'unavailable', total_tokens: null },
    provider_stream_exhausted: true, provider_activity_observed: false })
  expect(JSON.stringify(value)).not.toContain('SECRET')
})

it('retains exact received usage after an aborted finish', async () => {
  const value = await observe([usage, { type: 'finish', reason: { kind: 'aborted', failure: { code: 'ABORTED', message: 'SECRET' } } }])
  expect(value).toMatchObject({ provider_usage: { state: 'USAGE_RETURNED', prompt_tokens: 108, completion_tokens: 53, total_tokens: 161, source: 'provider' },
    usage_samples: 1, usage_observation_source: 'normalized-provider-stream', model_response_complete: false })
})

it.each([false, true])('preserves observed accounting when a source throws after usage=%s', async received => {
  const telemetry = new ModelTelemetry()
  const failure = Object.assign(new Error('PRIVATE'), { code: 'ECONNRESET' })
  await expect(async () => {
    for await (const _chunk of telemetry.stream(async function* () { if (received) yield usage; throw failure })) { /* Consume until the real source throws. */ }
  }).rejects.toBe(failure)
  telemetry.finish(0, false)
  expect(telemetry.value).toMatchObject({ provider_usage: { state: received ? 'USAGE_RETURNED' : 'USAGE_LOST_HOST', total_tokens: received ? 161 : null },
    provider_stream_exhausted: false, network_code: 'ECONNRESET' })
  expect(JSON.stringify(telemetry.value)).not.toContain('PRIVATE')
})

it('deduplicates equal normalized usage instead of summing two observations', async () => {
  const value = await observe([usage, { type: 'usage', usage: { inputTokens: 101, cacheReadTokens: 7, cacheWriteTokens: 0, outputTokens: 53, totalTokens: 161 } }, stop], true)
  expect(value).toMatchObject({ provider_usage: { state: 'USAGE_RETURNED', total_tokens: 161 }, usage_samples: 2,
    usage_conflict: false, usage_observation_source: 'normalized-provider-stream', provider_stream_exhausted: true })
})

it.each([
  ['total', { inputTokens: 102, cacheReadTokens: 7, outputTokens: 53, totalTokens: 162 }],
  ['cache distribution', { inputTokens: 102, cacheReadTokens: 6, outputTokens: 53, totalTokens: 161 }],
] as const)('publishes conflicting normalized %s samples with unavailable exact totals', async (_kind, sample) => {
  const value = await observe([usage, { type: 'usage', usage: sample }, stop], true)
  expect(value).toMatchObject({ provider_usage: { state: 'USAGE_UNPARSEABLE', code: 'PROVIDER_USAGE_CONFLICT', total_tokens: null, source: 'unavailable' },
    usage_conflict: true, usage_samples: 2, usage_observation_source: 'normalized-provider-stream', model_response_complete: true })
})

it('does not erase malformed accounting with a later legal sample or semantic success', async () => {
  const value = await observe([{ type: 'usage', usage: { inputTokens: 1, outputTokens: 2, totalTokens: 9 } }, usage, stop], true)
  expect(value).toMatchObject({ provider_usage: { state: 'USAGE_UNPARSEABLE', code: 'PROVIDER_USAGE_UNPARSEABLE', prompt_tokens: null, completion_tokens: null, total_tokens: null },
    usage_received: true, usage_samples: 2, usage_conflict: false, provider_stream_exhausted: true, model_response_complete: true })
})
