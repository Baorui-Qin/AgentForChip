/** Audited tool calls through the existing provider and official tokenizer. @module rtl-tools/phase1/p09-action-call */
import { mkdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { BlockAssembler, createUserMessage, type Message, type GenerateOptions, type PreparedLlmCall } from '@deepseek-ai/dsh-llm'
import { serializeRequest } from '@deepseek-ai/dsh-llm-deepseek/src/serialize.ts'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { runCommand } from '../process.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { publish } from './candidates.ts'
import { EventRecorder } from './recorder.ts'
import { finalArtifactManifest } from './artifact-manifest.ts'
import { buildContext, type ContextInput, type SkillEntry, type TextView } from './p09-context.ts'
import { autoTools } from './p09-auto-policy.ts'
import { reserveDispatch } from './p09-claims.ts'
import type { ModelRuntime, ModelSettings } from './model.ts'
import type { P09Settings } from './p09-proposal.ts'
import type { PhaseId } from './contracts.ts'

/** Opt-in settings are frozen as part of the experiment configuration. */
export interface AutoSettings {
  registry: 'minimal' | 'full'; campaignRoot: string; bucket: 'preflight' | 'ablation'; sampleId: string
  runtimeRoot: string; runtimeManifestSha256: string; maxToolSteps: number
  validationSkillId?: string
}
/** One actual response, never treated as verification evidence. */
export interface ActionResponse {
  schema_version: '1.7'; dispatched: boolean; message: Message | null; finish_kind: string; error_code: string | null
  retryable: boolean; response_bytes: number; prompt_sha256: string | null; request_wall_ms: number
  prompt_tokens: number | null; completion_tokens: number | null; local_tokens: number | null
}
/** Official runtime identity with every selected executable/data dependency hashed. */
export interface CounterManifest { revision: string; executable: string; tokenizer: string; files: Record<string, string>; compiler: string }
/** Load and check frozen runtime files before any model dispatch. @param settings - trusted runtime location. @returns checked identity. */
export async function checkCounterRuntime(settings: AutoSettings): Promise<CounterManifest> {
  const root = resolve(settings.runtimeRoot)
  const bytes = await readFile(await checkedFile(root, 'manifest.json'))
  if (sha256(bytes) !== settings.runtimeManifestSha256) throw new Error('TOKENIZER_UNAVAILABLE')
  const manifest = JSON.parse(bytes.toString('utf8')) as CounterManifest
  if (!/^[a-f0-9]{40}$/.test(manifest.revision) || !manifest.files[manifest.executable] || !manifest.files[manifest.tokenizer]) throw new Error('TOKENIZER_UNAVAILABLE')
  for (const [path, hash] of Object.entries(manifest.files)) if (sha256(await readFile(await checkedFile(root, path))) !== hash) throw new Error('TOKENIZER_UNAVAILABLE')
  return manifest
}
/** Count precisely the serialized wire using pinned official code. @param runtime - verified runtime identity. @param settings - location. @param subprocess - managed child owner. @param directory - unique count directory. @param wire - exact provider body. @param signal - cancellation. @returns local token count. */
export async function countActionWire(runtime: CounterManifest, settings: AutoSettings, subprocess: SubprocessRuntime, directory: string, wire: unknown, signal: AbortSignal): Promise<number> {
  await mkdir(directory)
  await publish(directory, 'input.json', JSON.stringify(wire))
  const result = await runCommand(subprocess, { timeoutMs: 10000, graceMs: 1000, maxLogBytes: 8192, maxLineChars: 8192, stopOnLogLimit: true },
    [await checkedFile(resolve(settings.runtimeRoot), runtime.executable), join(directory, 'input.json'), await checkedFile(resolve(settings.runtimeRoot), runtime.tokenizer)], directory, 'counter', signal, { accept() {} })
  if (result.exitCode !== 0 || result.timedOut || result.aborted || result.logTruncated) throw new Error('TOKENIZER_UNAVAILABLE')
  const output = JSON.parse(await readFile(result.stdoutLog, 'utf8')) as { tokens: number }
  if (!Number.isSafeInteger(output.tokens) || output.tokens < 0) throw new Error('TOKENIZER_UNAVAILABLE')
  return output.tokens
}
/** One bounded request; all retries belong to the workflow. @param args - immutable input plus persistence callbacks. @returns audited complete or failed response. */
export async function callAction(args: {
  root: string; experiment: string; sequence: number; input: ContextInput; history: Message[]; auto: AutoSettings; p09: P09Settings
  model: ModelSettings; runtime: ModelRuntime; subprocess: SubprocessRuntime; maxEventBytes: number; signal: AbortSignal
  loadSkills: () => Promise<SkillEntry[]>; claim: (directory: string) => Promise<void>
  expectedRequestHash: string | null
}): Promise<ActionResponse> {
  const recorder = await EventRecorder.create(join(args.root, 'models'), { experiment_id: args.experiment as PhaseId, task_id: args.input.task.id as PhaseId, sample_id: args.sequence, mode: 'agent' }, args.maxEventBytes, '1.3')
  await args.claim(recorder.directory)
  const result: ActionResponse = { schema_version: '1.7', dispatched: false, message: null, finish_kind: 'error', error_code: null, retryable: false,
    response_bytes: 0, prompt_sha256: null, request_wall_ms: 0, prompt_tokens: null, completion_tokens: null, local_tokens: null }
  const start = performance.now(), control = new AbortController()
  const timer = setTimeout(() => control.abort(), args.model.timeoutMs)
  const signal = AbortSignal.any([args.signal, control.signal])
  const assembler = new BlockAssembler()
  let prepared: PreparedLlmCall | undefined, finished = false, failureStatus: number | null = null
  const chunks: unknown[] = []
  const link = { revision_id: args.input.current!.revision_id as PhaseId, call_id: randomUUID() as PhaseId }
  try {
    prepared = await args.runtime.prepareCall({ provider: 'deepseek-official', model: args.model.model, temperature: args.model.temperature, maxTokens: args.model.maxTokens }, signal)
    if (prepared.retryPolicy.mode !== 'normal' || prepared.retryPolicy.maxRetries !== 0) throw new Error('LOWER_LEVEL_RETRY_ENABLED')
    if (!prepared.context?.contextWindow || prepared.config.maxTokens !== args.p09.limits.output) throw new Error('CONTEXT_CONFIGURATION_ERROR')
    const resolved = JSON.stringify({ config: prepared.config, defaults: prepared.adapterDefaults, context: prepared.context })
    try { await publish(args.root, 'resolved-model.json', resolved) }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST' || await readFile(await checkedFile(args.root, 'resolved-model.json'), 'utf8') !== resolved) throw new Error('CONFIG_CHANGED') }
    const runtime = await checkCounterRuntime(args.auto)
    const tools = autoTools(args.auto.registry)
    const options = (view: TextView): GenerateOptions => ({ ...prepared!.config, system: view.system, tools,
      messages: [createUserMessage({ content: [{ type: 'text', text: view.prompt }], source: { kind: 'user' } }), ...args.history] })
    const wire = (view: TextView) => serializeRequest(options(view))
    let seq = 0
    const cache = new Map<string, number>()
    const counter = { quality: 'exact_local' as const, identity: { implementation: 'official-rust-deepseek-recipe', revision: runtime.revision, manifest_sha256: args.auto.runtimeManifestSha256, cloud_equivalence: 'unconfirmed' },
      async count(view: TextView, signal: AbortSignal) {
        const body = wire(view), key = sha256(JSON.stringify(body))
        const found = cache.get(key); if (found !== undefined) return found
        const count = await countActionWire(runtime, args.auto, args.subprocess, join(recorder.directory, 'token-' + ++seq), body, signal)
        cache.set(key, count); return count
      } }
    const built = await buildContext(args.input, { ...args.p09.limits, window: Math.min(args.p09.limits.window, prepared.context.contextWindow) }, counter, signal, args.loadSkills)
    const request = options(built), body = serializeRequest(request)
    result.prompt_sha256 = sha256(JSON.stringify(body)); result.local_tokens = built.audit.tokens
    if (args.expectedRequestHash && args.expectedRequestHash !== result.prompt_sha256) throw new Error('RETRY_REQUEST_CHANGED')
    const audit = { ...built.audit, schema_version: '1.7', template_version: 'p09-tools-1', revision_id: args.input.current!.revision_id,
      source_sha256: args.input.current!.source_sha256, verification_key: args.input.binding?.verification_key ?? null,
      failed_stage: args.input.feedback?.stages.find(s => s.status !== 'PASS')?.stage ?? null, pending_verification: args.input.pending_verification,
      output_reserve: args.p09.limits.output, safety_margin: args.p09.limits.margin, final_prompt_sha256: result.prompt_sha256,
      ledger_entry_ids: (JSON.parse(built.prompt) as { history: { revision_id: string }[] }).history.map(e => e.revision_id), full_request_counted: true,
      skill_validation_id: args.input.skill_validation?.id ?? null, skill_validation_status: args.input.skill_validation ? 'draft_under_test' : null }
    await publish(recorder.directory, 'context.json', JSON.stringify(args.input, null, 2))
    await publish(recorder.directory, 'context-audit.json', JSON.stringify(audit, null, 2))
    await publish(recorder.directory, 'prompt-final.txt', JSON.stringify(body, null, 2))
    await recorder.append({ type: 'agent_request', link, value: { wire: body, audit } })
    const ticket = await reserveDispatch(args.auto.campaignRoot, args.auto.bucket, { experiment: args.experiment, sequence: args.sequence, request_sha256: result.prompt_sha256 }, signal)
    await publish(recorder.directory, 'dispatch.json', JSON.stringify({ ticket, request_sha256: result.prompt_sha256 }))
    result.dispatched = true
    for await (const chunk of prepared.stream({ ...request, signal })) {
      signal.throwIfAborted()
      if (finished) throw new Error('MODEL_PROTOCOL_ERROR')
      if (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta') result.response_bytes += Buffer.byteLength(chunk.text)
      if (chunk.type === 'tool-call-delta') result.response_bytes += Buffer.byteLength(chunk.argumentsDelta) + Buffer.byteLength(chunk.name ?? '')
      if (chunk.type === 'block-end') result.response_bytes += Buffer.byteLength(JSON.stringify(chunk.block))
      if (result.response_bytes > args.model.maxResponseBytes) throw new Error('OUTPUT_TRUNCATED')
      if (chunk.type === 'finish') {
        finished = true; result.finish_kind = chunk.reason.kind
        if (chunk.reason.kind === 'error' || chunk.reason.kind === 'aborted') {
          result.error_code = chunk.reason.failure.code
          const failure = chunk.reason.failure as { status?: number }; failureStatus = failure.status ?? null
          chunks.push({ type: 'finish', reason: { kind: chunk.reason.kind, code: result.error_code, status: failureStatus } })
          continue
        }
      }
      chunks.push(chunk); assembler.push(chunk)
      if (Buffer.byteLength(JSON.stringify(chunks)) > args.maxEventBytes / 2) throw new Error('OUTPUT_TRUNCATED')
    }
    if (!finished) throw new Error('MODEL_PROTOCOL_ERROR')
    if (result.finish_kind === 'max-tokens') result.error_code = 'OUTPUT_TRUNCATED'
    if (!result.error_code) result.message = assembler.message({ kind: 'model', provider: prepared.config.provider, model: prepared.config.model,
      ...(assembler.replayState === undefined ? {} : { replayState: assembler.replayState }) })
  } catch (error) {
    const code = error instanceof Error ? error.message : ''
    result.error_code = args.signal.aborted ? 'CANCELLED' : control.signal.aborted ? 'TIMEOUT' : /^[A-Z_]+$/.test(code) ? code : 'HOST_OR_MODEL_FAILURE'
  } finally { clearTimeout(timer) }
  if (assembler.usage) { const u = assembler.usage; result.prompt_tokens = u.inputTokens + (u.cacheReadTokens ?? 0) + (u.cacheWriteTokens ?? 0); result.completion_tokens = u.outputTokens }
  result.retryable = result.dispatched && result.response_bytes === 0 && !args.signal.aborted &&
    (['TRANSPORT', 'TIMEOUT', 'CONNECTION', 'CONNECT'].includes(result.error_code ?? '') || result.error_code === 'SERVER' && [502, 503, 504].includes(failureStatus ?? 0))
  result.request_wall_ms = Math.round(performance.now() - start)
  try {
    await publish(recorder.directory, 'model.json', JSON.stringify(result, null, 2))
    await publish(recorder.directory, 'response.txt', JSON.stringify(result.message, null, 2))
    await publish(recorder.directory, 'stream.json', JSON.stringify(chunks))
    await recorder.append({ type: 'agent_response', link, value: { ...result } })
    await recorder.finish({ schema_version: '1.3', experiment_id: args.experiment as PhaseId, task_id: args.input.task.id as PhaseId, sample_id: args.sequence, mode: 'agent',
      final_status: args.signal.aborted ? 'ABORTED' : 'INCONCLUSIVE', final_revision_id: args.input.current!.revision_id as PhaseId,
      final_source_sha256: args.input.current!.source_sha256, verification_key: args.input.binding?.verification_key ?? null,
      final_verified: false, stages: { compile: null, elaborate: null, simulation: null, synthesis: null }, semantic_repairs: 0,
      model_requests_total: result.dispatched ? 1 : 0, transport_retries: 0, stop_reason: result.error_code ?? 'Model action is not a design verdict.', artifact_manifest: ['events.jsonl', 'model.json', 'response.txt', 'stream.json'] })
  } finally { await recorder.close(); await finalArtifactManifest(recorder.directory) }
  return result
}
