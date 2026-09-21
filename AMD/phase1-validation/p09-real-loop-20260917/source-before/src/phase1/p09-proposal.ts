/** Bounded request recovery inside the existing repair workflow, never an EDA loop. @module rtl-tools/phase1/p09-proposal */
import { readFile } from 'node:fs/promises'
import { join, dirname, basename, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { setTimeout as sleep } from 'node:timers/promises'
import type { PreparedLlmCall } from '@deepseek-ai/dsh-llm'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { callText, type ModelRuntime, type ModelSettings, type ModelObservation } from './model.ts'
import { EventRecorder } from './recorder.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { publish, extractSource, OutputError } from './candidates.ts'
import { retryableTransport } from './repair-loop.ts'
import { buildContext, ContextError, type ContextInput, type ContextLimits, type ContextVariant, type RepairLedgerEntry, type TokenCounter, type SkillEntry } from './p09-context.ts'
import { officialCounter, textWire, type TokenizerSettings } from './p09-tokenizer.ts'
import type { PhaseId } from './contracts.ts'
import type { ModelRecord } from './records.ts'

/** Trusted configuration, included in experiment configuration identity. */
export interface P09Settings { variant: ContextVariant; limits: ContextLimits; tokenizer: TokenizerSettings; skillsFile: string | null; skillsSha256: string | null; maxRequests: number }
/** Parse host JSON before any model or tool dispatch. @param file - explicit config path. @returns bounded settings. */
export async function readP09Settings(file: string): Promise<P09Settings> {
  const bytes = await readFile(await checkedFile(resolve(dirname(file)), basename(file)))
  if (bytes.length > 65536) throw new Error('P09 config exceeds limit')
  const value = JSON.parse(bytes.toString('utf8')) as P09Settings
  if (!value || !['A', 'B', 'C'].includes(value.variant) || !value.limits || !value.tokenizer ||
    Object.keys(value.limits).sort().join(',') !== 'feedback,ledger,margin,output,skills,sourceWarning,window' || Object.values(value.limits).some(n => !Number.isSafeInteger(n) || n <= 0) ||
    value.limits.output + value.limits.margin >= value.limits.window || !Number.isSafeInteger(value.maxRequests) || value.maxRequests < 1 || value.maxRequests > 15 ||
    typeof value.tokenizer.python !== 'string' || typeof value.tokenizer.root !== 'string' ||
    !/^[a-f0-9]{64}$/.test(value.tokenizer.manifestSha256) || !Number.isSafeInteger(value.tokenizer.timeoutMs) || value.tokenizer.timeoutMs < 1 ||
    !(value.skillsFile === null && value.skillsSha256 === null || typeof value.skillsFile === 'string' && /^[a-f0-9]{64}$/.test(value.skillsSha256 ?? ''))) throw new Error('Invalid P09 config')
  return value
}
/** Durable counters count attempts, not presumed HTTP deliveries. */
export interface P09State {
  calibration_only?: boolean
  variant_id: ContextVariant; model_requests_total: number; initial_generation_requests: number
  context_recovery_requests: number; format_recovery_requests: number; transport_retries: number
  source_history: string[]; ledger: RepairLedgerEntry[]; negative_calibration_run: string | null
}
/** Matched counter factory permits explicit Mock counting in tests, not profiles. */
export type CounterFactory = (settings: TokenizerSettings, subprocess: SubprocessRuntime, directory: string, prepared: PreparedLlmCall) => Promise<TokenCounter>
/** Initialize counters once, never at each retry. @param variant - independent group. @returns new state. */
export function newP09State(variant: ContextVariant): P09State {
  return { calibration_only: false, variant_id: variant, model_requests_total: 0, initial_generation_requests: 0, context_recovery_requests: 0, format_recovery_requests: 0,
    transport_retries: 0, source_history: [], ledger: [], negative_calibration_run: null }
}
async function skills(settings: P09Settings): Promise<SkillEntry[]> {
  if (!settings.skillsFile) return []
  const bytes = await readFile(await checkedFile(resolve(dirname(settings.skillsFile)), basename(settings.skillsFile)))
  if (sha256(bytes) !== settings.skillsSha256) throw new ContextError('SKILL_EVIDENCE_INVALID')
  const entries = JSON.parse(bytes.toString('utf8')) as SkillEntry[]
  for (const entry of entries.filter(e => e.status === 'validated')) {
    for (const record of entry.validation_records) {
      const evidence = await readFile(await checkedFile(resolve(dirname(settings.skillsFile)), record.path))
      if (sha256(evidence) !== record.sha256) throw new ContextError('SKILL_EVIDENCE_INVALID')
    }
  }
  return entries
}
/** One initial/semantic request with shared recovery budgets; caller owns operation locking and active time. @param args - current state and durable save callback. @returns a complete immutable candidate or explicit failure. */
export async function p09Proposal(args: {
  root: string; experiment: string; input: ContextInput; settings: P09Settings; state: P09State
  modelSettings: ModelSettings; runtime: ModelRuntime; subprocess: SubprocessRuntime; maxEventBytes: number
  maxTransportRetries: number; backoffMs: number[]; signal: AbortSignal
  claim: (directory: string) => Promise<void>; save: () => Promise<void>; counterFactory?: CounterFactory
}): Promise<{ model: ModelRecord | null; source: string | null; outcome: string | null }> {
  const { state, settings, signal } = args
  let input = structuredClone(args.input), transportRetries = 0
  let previous: { key: string; request: string } | null = null
  let delay = 0
  while (state.model_requests_total < settings.maxRequests) {
    signal.throwIfAborted()
    if (delay) await sleep(delay, undefined, { signal })
    const sequence = state.model_requests_total + 1
    const recorder = await EventRecorder.create(join(args.root, 'models'), { experiment_id: args.experiment as PhaseId, task_id: input.task.id as PhaseId, sample_id: sequence, mode: 'agent' }, args.maxEventBytes, '1.1')
    state.model_requests_total++
    await args.claim(recorder.directory)
    let observation: ModelObservation | null = null
    let built: Awaited<ReturnType<typeof buildContext>> | undefined
    let requestHash: string | null = null
    try {
      const model = await callText(args.runtime, args.modelSettings, '', recorder, { call_id: randomUUID() as PhaseId, revision_id: input.current?.revision_id as PhaseId ?? null }, signal,
        value => { observation = value }, async (prepared, signal) => {
          const resolved = JSON.stringify({ config: prepared.config, defaults: prepared.adapterDefaults, context: prepared.context ?? null })
          let frozen: string | null = null
          try { frozen = await readFile(await checkedFile(args.root, 'resolved-model.json'), 'utf8') } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
          if (frozen === null) await publish(args.root, 'resolved-model.json', resolved)
          else if (frozen !== resolved) throw new ContextError('CONFIG_CHANGED')
          if (!prepared.context?.contextWindow || prepared.config.maxTokens !== settings.limits.output) throw new ContextError('CONTEXT_CONFIGURATION_ERROR')
          await publish(recorder.directory, 'context.input.json', JSON.stringify(input, null, 2))
          let counter: TokenCounter
          try { counter = await (args.counterFactory ?? officialCounter)(settings.tokenizer, args.subprocess, recorder.directory, prepared) }
          catch { throw new ContextError('TOKENIZER_UNAVAILABLE') }
          const limits = { ...settings.limits, window: Math.min(settings.limits.window, prepared.context.contextWindow) }
          built = await buildContext(input, limits, counter, signal, () => skills(settings))
          const wire = textWire(prepared, built), key = sha256(JSON.stringify(input))
          requestHash = sha256(JSON.stringify(wire))
          if (previous?.key === key && previous.request !== requestHash) throw new ContextError('CONFIG_CHANGED')
          previous = { key, request: requestHash }
          await publish(recorder.directory, 'context.audit.json', JSON.stringify(built.audit, null, 2))
          await publish(recorder.directory, 'context.messages.json', JSON.stringify(wire, null, 2))
          await args.save()
          return built
        })
      await publish(recorder.directory, 'model.json', JSON.stringify(model, null, 2))
      await publish(recorder.directory, 'response.txt', model.content)
      await publish(recorder.directory, 'p09-call.json', JSON.stringify({ schema_version: '1.0', purpose: input.purpose, context_recovery: input.core_only ?? false,
        attempt: sequence, request_sha256: requestHash, observation, count_quality: built?.audit.count_quality ?? null,
        local_tokens: built?.audit.tokens ?? null, provider_tokens: model.usage.prompt_tokens,
        token_delta: built && model.usage.prompt_tokens !== null ? model.usage.prompt_tokens - built.audit.tokens : null,
        server_execution_count: null, state }, null, 2))
      await recorder.finish({ schema_version: '1.1', experiment_id: args.experiment as PhaseId, task_id: input.task.id as PhaseId, sample_id: sequence, mode: 'agent',
        final_status: signal.aborted ? 'ABORTED' : 'INCONCLUSIVE', final_revision_id: input.current?.revision_id as PhaseId ?? null, final_source_sha256: input.current?.source_sha256 ?? null,
        verification_key: null, final_verified: false, stages: { compile: null, elaborate: null, simulation: null, synthesis: null },
        semantic_repairs: 0, model_requests_total: 1, transport_retries: 0, stop_reason: model.error ? model.error.message : 'Proposal only; review required.',
        artifact_manifest: ['events.jsonl', 'model.json', 'response.txt', 'p09-call.json', ...(built ? ['context.input.json', 'context.audit.json', 'context.messages.json'] : [])] })
      await args.save()
      if (signal.aborted) return { model, source: null, outcome: 'CANCELLED' }
      const code = (observation as ModelObservation | null)?.code
      if (model.error) {
        if (code === 'CONTEXT_WINDOW_EXCEEDED' && built && !built.audit.core_only && state.context_recovery_requests < 1 && state.model_requests_total < settings.maxRequests) {
          state.context_recovery_requests++; input = { ...input, core_only: true }; delay = 0; await args.save(); continue
        }
        if (retryableTransport(model, observation) && transportRetries < args.maxTransportRetries) {
          if (state.model_requests_total >= settings.maxRequests) return { model, source: null, outcome: 'MODEL_REQUEST_BUDGET_EXHAUSTED' }
          delay = args.backoffMs[transportRetries]!; transportRetries++; state.transport_retries++; await args.save(); continue
        }
        return { model, source: null, outcome: code && /^(CONTEXT_|TOKENIZER_|CONFIG_)/.test(code) ? code : model.truncated ? 'OUTPUT_TRUNCATED' : 'MODEL_RESPONSE_ERROR' }
      }
      try {
        const extracted = extractSource(model.content, model.truncated, args.modelSettings.maxResponseBytes, input.task.interface)
        return { model, source: extracted.source, outcome: null }
      } catch (error) {
        const formatOnly = error instanceof OutputError && error.category === 'INVALID_OUTPUT' &&
          /protocol markers|code fences|HDL block|outside/.test(error.message) && /\bmodule\b[\s\S]*\bendmodule\b/.test(model.content)
        if (formatOnly && state.format_recovery_requests < 1) {
          state.format_recovery_requests++; input = { ...input, purpose: 'format_recovery', format_response: model.content }; delay = 0; await args.save(); continue
        }
        return { model, source: null, outcome: 'INVALID_MODEL_OUTPUT' }
      }
    } finally { await recorder.close() }
  }
  return { model: null, source: null, outcome: 'MODEL_REQUEST_BUDGET_EXHAUSTED' }
}
