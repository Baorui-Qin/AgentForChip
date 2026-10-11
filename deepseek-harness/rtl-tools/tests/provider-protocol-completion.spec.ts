import { expect, it } from 'vitest'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'
import { ModelTelemetry } from '../src/phase1/model-observation.ts'
import { normalizeChunk, StreamAudit } from '../src/phase1/stream-audit.ts'
import { protocolBody, withOfflineProtocolProvider } from './helpers/provider-protocol-fixture.ts'

async function observe(body: string | null, closeAndCancel = false) {
  return withOfflineProtocolProvider(body, async runtime => {
    const telemetry = new ModelTelemetry(), controller = new AbortController(), chunks: StreamChunk[] = [], audit = new StreamAudit(8192)
    const prepared = await runtime.prepareCall({ provider: 'deepseek-official', model: 'offline-model', maxTokens: 32, temperature: 0 }, controller.signal)
    for await (const chunk of telemetry.stream(() => prepared.stream({ ...prepared.config, messages: [], tools: [], signal: controller.signal }))) {
      chunks.push(chunk); audit.append(chunk)
      if (closeAndCancel && chunk.type === 'finish') { controller.abort(); break }
    }
    telemetry.value.caller_cancelled = controller.signal.aborted
    telemetry.finish(0, false)
    return { value: telemetry.value, chunks, audit, projected: chunks.map(normalizeChunk) }
  })
}

it('classifies a DONE-terminated empty provider response as missing usage', async () => {
  const result = await observe(protocolBody({}, '[DONE]'))
  expect(result.value.provider_usage?.state).toBe('USAGE_MISSING_PROVIDER')
  expect(result.chunks).toEqual([{ type: 'finish', providerProtocolComplete: true,
    reason: { kind: 'error', failure: { code: 'EMPTY_RESPONSE', message: 'model returned a completed response with no content' } } }])
  expect(result.value).toMatchObject({ provider_protocol_complete: true,
    provider_protocol_completion_source: 'normalized-provider-stream-marker', provider_stream_exhausted: true,
    provider_usage: { state: 'USAGE_MISSING_PROVIDER', total_tokens: null }, model_response_complete: false, provider_activity_observed: true })
})

it('classifies a DONE-terminated provider resource error as missing usage', async () => {
  const result = await observe(protocolBody({ choices: [{ delta: {}, finish_reason: 'insufficient_system_resource' }] }, '[DONE]'))
  expect(result.value.provider_usage?.state).toBe('USAGE_MISSING_PROVIDER')
  expect(result.chunks.at(-1)).toMatchObject({ type: 'finish', providerProtocolComplete: true,
    reason: { kind: 'error', failure: { code: 'INSUFFICIENT_SYSTEM_RESOURCE' } } })
  expect(result.value).toMatchObject({ provider_protocol_complete: true, provider_stream_exhausted: true,
    provider_usage: { state: 'USAGE_MISSING_PROVIDER', total_tokens: null }, model_response_complete: false })
})

it('keeps a same-code no-body adapter failure distinct from a complete provider empty response', async () => {
  const result = await observe(null)
  expect(result.chunks.at(-1)).toMatchObject({ type: 'finish', reason: { kind: 'error', failure: { code: 'EMPTY_RESPONSE' } } })
  expect(result.chunks.at(-1)).not.toHaveProperty('providerProtocolComplete')
  expect(result.value).toMatchObject({ provider_protocol_complete: false, provider_protocol_completion_source: null,
    provider_stream_exhausted: true, provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null }, provider_activity_observed: false })
})

it.each([
  ['malformed payload', protocolBody('{invalid'), 'MALFORMED_RESPONSE'],
  ['missing DONE', protocolBody({ choices: [{ delta: { content: 'public' } }] }), 'STREAM_CLOSED'],
] as const)('keeps %s incomplete after Runtime normalizes the real adapter throw', async (_name, body, code) => {
  const result = await observe(body)
  expect(result.chunks.at(-1)).toMatchObject({ type: 'finish', reason: { kind: 'error', failure: { code } } })
  expect(result.chunks.at(-1)).not.toHaveProperty('providerProtocolComplete')
  expect(result.value).toMatchObject({ provider_protocol_complete: false, provider_protocol_completion_source: null,
    provider_stream_exhausted: true, provider_usage: { state: 'USAGE_LOST_HOST', total_tokens: null } })
})

it('retains actually returned usage from a DONE-terminated semantic error', async () => {
  const result = await observe(protocolBody({ choices: [{ delta: {}, finish_reason: 'stop' }],
    usage: { prompt_tokens: 7, completion_tokens: 0, total_tokens: 7 } }, '[DONE]'))
  expect(result.value).toMatchObject({ provider_protocol_complete: true, provider_usage: {
    state: 'USAGE_RETURNED', prompt_tokens: 7, completion_tokens: 0, total_tokens: 7 }, model_response_complete: false })
})

it('preserves observed protocol completion when a later caller cancellation closes the iterator', async () => {
  const result = await observe(protocolBody({ choices: [{ delta: {}, finish_reason: 'content_filter' }] }, '[DONE]'), true)
  expect(result.value).toMatchObject({ caller_cancelled: true, provider_stream_exhausted: false,
    provider_protocol_complete: true, provider_usage: { state: 'USAGE_MISSING_PROVIDER', total_tokens: null }, model_response_complete: false })
})

it('retains only the public completion marker beside the existing sanitized error projection', async () => {
  const result = await observe(protocolBody({}, '[DONE]'))
  expect(result.projected).toEqual([{ type: 'finish', reason: { kind: 'error', code: 'EMPTY_RESPONSE', status: null }, providerProtocolComplete: true }])
  expect(result.audit.chunks).toEqual(result.projected)
  expect(result.audit.finish()).toMatchObject({ terminal_metadata_preserved: true, omitted_critical_chunks: 0, audit_error: null })
  expect(JSON.stringify(result.projected)).not.toMatch(/offline-fixture-key|offline\.invalid|model returned/)
})
