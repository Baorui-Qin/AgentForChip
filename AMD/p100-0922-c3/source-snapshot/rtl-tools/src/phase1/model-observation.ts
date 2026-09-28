/** Safe per-call transport evidence; never records URLs, headers or exception messages. @module rtl-tools/phase1/model-observation */
import { AsyncLocalStorage } from 'node:async_hooks'
import { channel } from 'node:diagnostics_channel'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'

/** Additive sidecar facts; null means unavailable, not a negative server acknowledgement. */
export interface ModelObservation {
  code: string | null; http_status: number | null; network_code: string | null; response_bytes: number; phase: 'prepare' | 'stream'
  request_prepared?: boolean; provider_stream_invoked?: boolean; provider_activity_observed?: boolean
  model_output_observed?: boolean; model_response_complete?: boolean; finish_received?: boolean; usage_received?: boolean
  http_response_observed?: boolean; first_server_event_ms?: number | null; first_model_token_ms?: number | null
  failure_phase?: string | null; network_observation_source?: string | null
}

const active = new AsyncLocalStorage<ModelTelemetry>()
const networkCodes = /^(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|UND_ERR_SOCKET|CERT_HAS_EXPIRED|UNABLE_TO_VERIFY_LEAF_SIGNATURE|SELF_SIGNED_CERT_IN_CHAIN|DEPTH_ZERO_SELF_SIGNED_CERT)$/

/** One call owns its diagnostic subscriptions and only observes requests created in its async context. */
export class ModelTelemetry {
  readonly value: ModelObservation = { code: null, http_status: null, network_code: null, response_bytes: 0, phase: 'prepare',
    request_prepared: false, provider_stream_invoked: false, provider_activity_observed: false, model_output_observed: false,
    model_response_complete: false, finish_received: false, usage_received: false, http_response_observed: false,
    first_server_event_ms: null, first_model_token_ms: null, failure_phase: null, network_observation_source: null }
  private readonly started = performance.now()

  /** Extract only allowlisted codes, including causes discarded by the provider normalizer. @param error - thrown value or failure facts. */
  failure(error: unknown): void {
    const visit = (value: unknown, depth: number): void => {
      if (!value || typeof value !== 'object' || depth > 5) return
      const data = value as { code?: unknown; status?: unknown; cause?: unknown; failure?: unknown; errors?: unknown }
      if (typeof data.code === 'string') {
        if (networkCodes.test(data.code)) this.value.network_code = data.code
        else if (depth === 0) this.value.code = /^(?:AUTH|MISSING_CREDENTIAL|TRANSPORT|CONNECT|CONNECTION|TIMEOUT|ABORTED|SERVER|RATE_LIMIT|PROTOCOL|CONFIG_CHANGED|INVALID_REQUEST|CONTEXT_WINDOW_EXCEEDED|CONTEXT_CONFIGURATION_ERROR|CONTEXT_BINDING_ERROR|CONTEXT_UNSATISFIABLE|TOKENIZER_UNAVAILABLE|SKILL_EVIDENCE_INVALID|HTTP_\d{3})$/.test(data.code) ? data.code : 'OTHER'
      }
      if (typeof data.status === 'number' && Number.isInteger(data.status) && data.status >= 100 && data.status <= 599) this.value.http_status = data.status
      visit(data.cause, depth + 1); visit(data.failure, depth + 1)
      if (Array.isArray(data.errors)) for (const item of data.errors.slice(0, 8)) visit(item, depth + 1)
    }
    visit(error, 0)
  }

  private activity(): void {
    this.value.provider_activity_observed = true
    this.value.first_server_event_ms ??= Math.round(performance.now() - this.started)
  }

  /** Observe normalized chunks without treating a locally synthesized error finish as a server response. @param chunk - provider stream item. */
  chunk(chunk: StreamChunk): void {
    if (chunk.type === 'finish') {
      this.value.finish_received = true
      if (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted') this.failure(chunk.reason.failure)
      else this.activity()
    } else this.activity()
    if (chunk.type === 'usage') this.value.usage_received = true
    const output = (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta') ? chunk.text
      : chunk.type === 'tool-call-delta' ? chunk.argumentsDelta + (chunk.name ?? '')
        : chunk.type === 'block-end' ? JSON.stringify(chunk.block) : ''
    if (output.length) {
      this.value.model_output_observed = true
      this.value.first_model_token_ms ??= Math.round(performance.now() - this.started)
    }
  }

  /** Attribute Node fetch diagnostics while advancing this provider's iterator. @param source - lazy provider stream. @returns unchanged chunks. */
  async *stream(source: () => AsyncIterable<StreamChunk>): AsyncGenerator<StreamChunk> {
    const requests = new WeakSet<object>()
    const create = (message: unknown) => {
      const { request } = message as { request: object }
      if (active.getStore() === this) requests.add(request)
    }
    const headers = (message: unknown) => {
      const { request, response } = message as { request: object; response: { statusCode: number } }
      if (!requests.has(request)) return
      this.value.http_response_observed = true; this.value.http_status = response.statusCode
      this.value.network_observation_source = 'node-undici'; this.activity()
    }
    const error = (message: unknown) => {
      const data = message as { request: object; error: unknown }
      if (!requests.has(data.request)) return
      this.value.network_observation_source = 'node-undici'; this.failure(data.error)
    }
    const subscriptions = [['undici:request:create', create], ['undici:request:headers', headers], ['undici:request:error', error]] as const
    for (const [name, listener] of subscriptions) channel(name).subscribe(listener)
    this.value.phase = 'stream'; this.value.provider_stream_invoked = true
    let iterator: AsyncIterator<StreamChunk> | undefined
    try {
      iterator = active.run(this, () => source()[Symbol.asyncIterator]())
      while (true) {
        const next = await active.run(this, () => iterator!.next())
        if (next.done) break
        this.chunk(next.value); yield next.value
      }
    } finally {
      try { await active.run(this, () => iterator?.return?.()) }
      finally { for (const [name, listener] of subscriptions) channel(name).unsubscribe(listener) }
    }
  }

  /** Finalize independent terminal facts after assembly and cancellation checks. @param bytes - observed output size. @param complete - validated non-truncated successful response. */
  finish(bytes: number, complete: boolean): void {
    this.value.response_bytes = bytes; this.value.model_response_complete = complete
    this.value.failure_phase = complete ? null : !this.value.provider_stream_invoked ? 'prepare'
      : this.value.model_output_observed ? 'stream_output' : this.value.provider_activity_observed ? 'before_model_output' : 'before_observable_response'
  }
}
