import { channel } from 'node:diagnostics_channel'
import { createServer } from 'node:http'
import { expect, it } from 'vitest'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'
import { ModelTelemetry } from '../src/phase1/model-observation.ts'
import { evidenceHash } from '../src/phase1/p10-trace.ts'

it('does not mistake a locally normalized transport finish for server activity', async () => {
  const telemetry = new ModelTelemetry()
  for await (const _chunk of telemetry.stream(async function* () {
    const request = {}
    channel('undici:request:create').publish({ request })
    channel('undici:request:error').publish({ request, error: new Error('secret-url', { cause: Object.assign(new Error('secret-key'), { code: 'ECONNRESET' }) }) })
    yield { type: 'finish', reason: { kind: 'error', failure: { code: 'TRANSPORT', message: 'SECRET' } } } as StreamChunk
  })) { /* Consume the unchanged provider stream. */ }
  telemetry.finish(0, false)
  expect(telemetry.value).toMatchObject({ provider_stream_invoked: true, provider_activity_observed: false, model_output_observed: false,
    http_response_observed: false, model_response_complete: false, network_code: 'ECONNRESET', failure_phase: 'before_observable_response' })
  expect(JSON.stringify(telemetry.value)).not.toMatch(/SECRET|secret/)
})

it('captures actual HTTP status using Node fetch without retaining request headers or URLs', async () => {
  const server = createServer((_request, response) => { response.writeHead(503); response.end('unavailable') })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address() as { port: number }
  const telemetry = new ModelTelemetry()
  try {
    for await (const _chunk of telemetry.stream(async function* () {
      const response = await fetch(`http://127.0.0.1:${address.port}/private`, { headers: { authorization: 'SECRET' } })
      await response.text()
      yield { type: 'finish', reason: { kind: 'error', failure: { code: 'SERVER', status: response.status, message: 'SECRET' } } } as StreamChunk
    })) { /* The provider translates the HTTP response into terminal failure facts. */ }
    telemetry.finish(0, false)
    expect(telemetry.value).toMatchObject({ http_status: 503, http_response_observed: true, provider_activity_observed: true,
      model_output_observed: false, network_observation_source: 'node-undici', failure_phase: 'before_model_output' })
    expect(JSON.stringify(telemetry.value)).not.toMatch(/private|SECRET|127\.0\.0\.1/)
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())) }
})

it('isolates simultaneous call diagnostics and removes subscribers after consumer failure', async () => {
  const a = new ModelTelemetry(), b = new ModelTelemetry()
  async function run(telemetry: ModelTelemetry, status: number) {
    for await (const _chunk of telemetry.stream(async function* () {
      const request = {}; channel('undici:request:create').publish({ request })
      await new Promise(resolve => setTimeout(resolve, 5))
      channel('undici:request:headers').publish({ request, response: { statusCode: status } })
      yield { type: 'text-delta', index: 0, text: 'OK' } as StreamChunk
    })) { throw new Error('consumer') }
  }
  const results = await Promise.allSettled([run(a, 200), run(b, 502)])
  expect(results.every(result => result.status === 'rejected')).toBe(true)
  expect(a.value.http_status).toBe(200); expect(b.value.http_status).toBe(502)
  expect(a.value.model_output_observed).toBe(true)
  const before = JSON.stringify(a.value)
  channel('undici:request:error').publish({ request: {}, error: { code: 'ENOTFOUND' } })
  expect(JSON.stringify(a.value)).toBe(before)
})

it('canonicalizes feedback objects without erasing ordered evidence', () => {
  expect(evidenceHash({ a: 1, b: { c: 2, d: 3 } })).toBe(evidenceHash({ b: { d: 3, c: 2 }, a: 1 }))
  expect(evidenceHash([1, 2])).not.toBe(evidenceHash([2, 1]))
})
