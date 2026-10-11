/** Safe per-call transport evidence; never records URLs, headers or exception messages. @module rtl-tools/phase1/model-observation */
import { AsyncLocalStorage } from 'node:async_hooks'
import { channel } from 'node:diagnostics_channel'
import type { StreamChunk } from '@deepseek-ai/dsh-llm'
import { providerUsage, type ProviderUsage } from './provider-usage.ts'

/** Additive sidecar facts; null means unavailable, not a negative server acknowledgement. */
export interface ModelObservation {
  code: string | null; http_status: number | null; network_code: string | null; response_bytes: number; phase: 'prepare' | 'stream'
  request_prepared?: boolean; provider_stream_invoked?: boolean; provider_activity_observed?: boolean
  model_output_observed?: boolean; model_response_complete?: boolean; finish_received?: boolean; usage_received?: boolean
  http_response_observed?: boolean; first_server_event_ms?: number | null; first_model_token_ms?: number | null
  failure_phase?: string | null; network_observation_source?: string | null
  provider_usage?: ProviderUsage; usage_observation_source?: 'normalized-provider-stream' | null
  usage_samples?: number; usage_conflict?: boolean; provider_stream_exhausted?: boolean
  provider_protocol_complete?: boolean; provider_protocol_completion_source?: 'normalized-provider-stream-marker' | null
  terminal_read_error_code?: string | null; caller_cancelled?: boolean; deadline_expired?: boolean
}

const active = new AsyncLocalStorage<ModelTelemetry>()
const networkCodes = /^(?:ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|ENETUNREACH|EHOSTUNREACH|UND_ERR_CONNECT_TIMEOUT|UND_ERR_HEADERS_TIMEOUT|UND_ERR_BODY_TIMEOUT|UND_ERR_SOCKET|CERT_HAS_EXPIRED|UNABLE_TO_VERIFY_LEAF_SIGNATURE|SELF_SIGNED_CERT_IN_CHAIN|DEPTH_ZERO_SELF_SIGNED_CERT)$/

/** One call owns its diagnostic subscriptions and only observes requests created in its async context. */
export class ModelTelemetry {
  readonly value: ModelObservation = { code: null, http_status: null, network_code: null, response_bytes: 0, phase: 'prepare',
    request_prepared: false, provider_stream_invoked: false, provider_activity_observed: false, model_output_observed: false,
    model_response_complete: false, finish_received: false, usage_received: false, http_response_observed: false,
    first_server_event_ms: null, first_model_token_ms: null, failure_phase: null, network_observation_source: null,
    provider_usage: providerUsage(undefined, false), usage_observation_source: null, usage_samples: 0, usage_conflict: false,
    provider_stream_exhausted: false, provider_protocol_complete: false, provider_protocol_completion_source: null,
    terminal_read_error_code: null, caller_cancelled: false, deadline_expired: false }
  private readonly started = performance.now()
  private usageKey: string | undefined
  private usageInvalid = false
  private streamFailed = false

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

  private usage(chunk: Extract<StreamChunk, { type: 'usage' }>): void {
    this.value.usage_received = true
    this.value.usage_observation_source = 'normalized-provider-stream'
    this.value.usage_samples = (this.value.usage_samples ?? 0) + 1
    const sample = providerUsage(chunk.usage, false)
    if (sample.state !== 'USAGE_RETURNED') {
      if (!this.usageInvalid) this.value.provider_usage = sample
      this.usageInvalid = true
      return
    }
    const value = chunk.usage
    const key = JSON.stringify([value.inputTokens, value.cacheReadTokens ?? 0, value.cacheWriteTokens ?? 0,
      value.outputTokens, value.totalTokens, value.reasoningTokens ?? null])
    if (this.usageKey !== undefined && key !== this.usageKey) {
      this.value.usage_conflict = true
      if (!this.usageInvalid) this.value.provider_usage = { ...providerUsage(undefined, false),
        state: 'USAGE_UNPARSEABLE', code: 'PROVIDER_USAGE_CONFLICT' }
      this.usageInvalid = true
    } else {
      this.usageKey ??= key
      if (!this.usageInvalid) this.value.provider_usage = sample
    }
  }

  private accounting(): void {
    if (!this.value.usage_received) this.value.provider_usage = providerUsage(undefined,
      this.value.provider_protocol_complete === true || (this.value.provider_stream_exhausted === true &&
        !this.streamFailed && !this.value.caller_cancelled && !this.value.deadline_expired))
  }

  /** Observe normalized chunks without treating a locally synthesized error finish as a server response. @param chunk - provider stream item. */
  chunk(chunk: StreamChunk): void {
    if (chunk.type === 'finish') {
      this.value.finish_received = true
      if (chunk.providerProtocolComplete === true) {
        this.value.provider_protocol_complete = true
        this.value.provider_protocol_completion_source = 'normalized-provider-stream-marker'
      }
      if (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted') {
        this.streamFailed = true; this.failure(chunk.reason.failure)
        if (chunk.providerProtocolComplete === true) this.activity()
      }
      else this.activity()
    } else this.activity()
    if (chunk.type === 'usage') this.usage(chunk)
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
        if (next.done) { this.value.provider_stream_exhausted = true; break }
        this.chunk(next.value); yield next.value
      }
    } catch (error) {
      this.streamFailed = true; this.failure(error)
      throw error
    } finally {
      try { await active.run(this, () => iterator?.return?.()) }
      finally { this.accounting(); for (const [name, listener] of subscriptions) channel(name).unsubscribe(listener) }
    }
  }

  /** Finalize independent terminal facts after assembly and cancellation checks. @param bytes - observed output size. @param complete - validated non-truncated successful response. */
  finish(bytes: number, complete: boolean): void {
    this.accounting()
    this.value.response_bytes = bytes; this.value.model_response_complete = complete
    this.value.failure_phase = complete ? null : !this.value.provider_stream_invoked ? 'prepare'
      : this.value.model_output_observed ? 'stream_output' : this.value.provider_activity_observed ? 'before_model_output' : 'before_observable_response'
  }
}
