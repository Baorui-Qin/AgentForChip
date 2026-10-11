/** One text call through the registered provider, with no agent tools or retries. @module rtl-tools/phase1/model */
import { createUserMessage, type PreparedLlmCall, type LlmCallConfig, type StreamChunk, type FinishReason, type TokenUsage } from '@deepseek-ai/dsh-llm'
import { parseRecord, type ModelRecord } from './records.ts'
import type { EventLink, EventRecorder } from './recorder.ts'
import type { ContextAudit } from './p09-context.ts'
import { ModelTelemetry, type ModelObservation } from './model-observation.ts'
import { ModelTranscript } from './model-transcript.ts'
export type { ModelObservation } from './model-observation.ts'

/** Provider-owned preparation also resolves the existing credential service. */
export interface ModelRuntime { prepareCall(config: LlmCallConfig, signal?: AbortSignal): Promise<PreparedLlmCall> }
/** Explicit development limits; no model id or sampling settings are inferred. */
export interface ModelSettings { model: string; maxTokens: number; temperature: number; timeoutMs: number; maxResponseBytes: number; system?: string; reasoningEffort?: LlmCallConfig['reasoningEffort'] }

/** Optional host construction after configuration resolution, before a single dispatch. */
export type BuildText = (prepared: PreparedLlmCall, signal: AbortSignal) => Promise<{ prompt: string; system: string; audit: ContextAudit }>

function failure(code: string): NonNullable<ModelRecord['error']> {
  const category = /AUTH|CREDENTIAL/.test(code) ? 'authentication' : /RATE_LIMIT|QUOTA/.test(code) ? 'rate_limit'
    : /TIMEOUT/.test(code) ? 'timeout' : /ABORT/.test(code) ? 'cancelled' : /TRANSPORT|CONNECT/.test(code) ? 'connection'
      : /SERVER|HTTP_5/.test(code) ? 'service' : /EMPTY/.test(code) ? 'empty_output'
        : /MALFORMED|STREAM_CLOSED|PROTOCOL/.test(code) ? 'parse' : /INVALID|CONFIG|REQUEST_EXTENSION/.test(code) ? 'configuration' : 'unknown'
  // Provider exception messages can contain URLs or credentials; only our vocabulary is persisted.
  return { category, message: `Official API call failed (${category}).` }
}

/**
 * Assemble a single provider stream and persist both request and terminal facts.
 * @param runtime - existing Harness LLM service, not an HTTP client.
 * @param settings - trusted explicit model and budgets.
 * @param prompt - approved public or development text only.
 * @param recorder - bounded project event writer.
 * @param link - host call/sample correlation.
 * @param caller - caller and plugin cancellation; provider must honor AbortSignal.
 * @param observe - optional collector of whitelisted transport facts; never receives exception text or headers.
 * @param build - optional audited text builder after resolution and before dispatch.
 * @returns full text with bounded response bytes and classified terminal state.
 */
export async function callText(runtime: ModelRuntime, settings: ModelSettings, prompt: string, recorder: EventRecorder, link: EventLink, caller: AbortSignal, observe?: (value: ModelObservation) => void, build?: BuildText): Promise<ModelRecord> {
  const transcript = await ModelTranscript.create(recorder.directory)
  const started = performance.now()
  const control = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; control.abort() }, settings.timeoutMs)
  const signal = AbortSignal.any([caller, control.signal])
  const result: ModelRecord = { schema_version: '1.1', call_id: link.call_id, provider: 'deepseek-official', model_id: settings.model,
    dispatched: false, content: '', finish_reason: 'unknown', truncated: false, tool_calls: [],
    usage: { prompt_tokens: null, completion_tokens: null, source: 'unavailable' },
    timing: { request_wall_ms: 0, ttft_ms: null, ttft_source: 'not_collected', transport: 'stream' }, server_cancellation: 'not_requested', error: null }
  let reason: FinishReason | undefined
  let bytes = 0
  const telemetry = new ModelTelemetry()
  const blocks = new Map<number, { type: string; text: string; closed: boolean }>()
  function protocol(): never { throw Object.assign(new Error('Invalid provider stream'), { code: 'PROTOCOL' }) }
  function account(text: string): void {
    bytes += Buffer.byteLength(text)
    if (bytes > settings.maxResponseBytes) { result.truncated = true; control.abort(); throw new Error('Response byte limit') }
  }
  function usage(value: TokenUsage): void {
    const input = value.inputTokens + (value.cacheReadTokens ?? 0) + (value.cacheWriteTokens ?? 0)
    if (![input, value.outputTokens].every(n => Number.isSafeInteger(n) && n >= 0)) protocol()
    result.usage = { prompt_tokens: input, completion_tokens: value.outputTokens, source: 'provider' }
  }
  function accept(chunk: StreamChunk): void {
    if (reason) protocol()
    switch (chunk.type) {
      case 'block-start':
        if (blocks.has(chunk.index) || !['text', 'reasoning'].includes(chunk.blockType)) protocol()
        blocks.set(chunk.index, { type: chunk.blockType, text: '', closed: false }); break
      case 'text-delta': case 'reasoning-delta': {
        const block = blocks.get(chunk.index)
        if (!block || block.closed || block.type !== (chunk.type === 'text-delta' ? 'text' : 'reasoning')) protocol()
        account(chunk.text); block.text += chunk.text; break
      }
      case 'block-end': {
        const block = blocks.get(chunk.index)
        if (!block || block.closed || chunk.block.type !== block.type || (chunk.block.type !== 'text' && chunk.block.type !== 'reasoning')) protocol()
        if (block.text && block.text !== chunk.block.text) protocol()
        if (!block.text) { account(chunk.block.text); block.text = chunk.block.text }
        block.closed = true; break
      }
      case 'usage': usage(chunk.usage); break
      case 'finish': reason = chunk.reason; break
      default: protocol()
    }
  }
  try {
    await recorder.append({ type: 'model_started', link, value: { prompt, ...(settings.system === undefined ? {} : { system: settings.system }) } })
    signal.throwIfAborted()
    const prepared = await runtime.prepareCall({ provider: 'deepseek-official', model: settings.model, maxTokens: settings.maxTokens, temperature: settings.temperature,
      ...(settings.reasoningEffort === undefined ? {} : { reasoningEffort: settings.reasoningEffort }) }, signal)
    signal.throwIfAborted()
    let system = settings.system
    if (build) {
      const built = await build(prepared, signal)
      prompt = built.prompt; system = built.system
      await recorder.append({ type: 'model_context', link, value: built.audit })
      signal.throwIfAborted()
    }
    await recorder.append({ type: 'model_request', link, value: { prompt, provider: prepared.config.provider, model: prepared.config.model,
      maxTokens: prepared.config.maxTokens!, temperature: prepared.config.temperature!, reasoningEffort: prepared.config.reasoningEffort ?? null, transport: 'stream', tools: [], ...(system === undefined ? {} : { system }) } })
    result.dispatched = true
    telemetry.value.request_prepared = true
    for await (const chunk of telemetry.stream(() => prepared.stream({ ...prepared.config, ...(system === undefined ? {} : { system }), messages: [createUserMessage({ content: [{ type: 'text', text: prompt }], source: { kind: 'user' } })], tools: [], signal }))) {
      await transcript.append(chunk)
      signal.throwIfAborted(); accept(chunk)
    }
    if (!reason) protocol()
    switch (reason.kind) {
      case 'stop':
        if ([...blocks.values()].some(block => !block.closed)) protocol()
        result.finish_reason = 'stop'; break
      case 'max-tokens': result.finish_reason = 'length'; result.truncated = true; break
      case 'error': case 'aborted': telemetry.failure(reason.failure); result.error = failure(reason.failure.code); result.finish_reason = reason.kind === 'aborted' ? 'cancelled' : 'error'; break
      default: protocol()
    }
  } catch (error) {
    telemetry.failure(error)
    const code = error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' ? error.code : 'UNKNOWN'
    result.error = failure(code); result.finish_reason = 'error'
  } finally { clearTimeout(timer) }
  result.content = [...blocks.values()].filter(block => block.type === 'text').map(block => block.text).join('')
  if (result.truncated) { result.error = { category: 'truncated', message: 'Output token or response byte limit reached.' }; result.finish_reason = 'length' }
  if (caller.aborted || timedOut) { result.error = failure(timedOut ? 'TIMEOUT' : 'ABORTED'); result.finish_reason = caller.aborted ? 'cancelled' : 'error' }
  if (result.dispatched && (signal.aborted || result.finish_reason === 'cancelled')) result.server_cancellation = 'unconfirmed'
  if (!result.error && !result.content.trim()) { result.error = failure('EMPTY_RESPONSE'); result.finish_reason = 'error' }
  result.timing.request_wall_ms = Math.round(performance.now() - started)
  await transcript.finish({ complete: !result.error && result.finish_reason === 'stop', error: result.error?.category ?? null })
  parseRecord('ModelResult', result)
  await recorder.append({ type: 'model_finished', link, value: result })
  telemetry.value.caller_cancelled = caller.aborted
  telemetry.value.deadline_expired = timedOut
  telemetry.finish(bytes, !result.error && result.finish_reason === 'stop')
  observe?.(telemetry.value)
  return result
}
