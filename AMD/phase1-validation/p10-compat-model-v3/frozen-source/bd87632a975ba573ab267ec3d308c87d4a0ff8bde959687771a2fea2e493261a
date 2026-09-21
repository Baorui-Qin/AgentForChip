/** Public generation and experiment accounting. No Agent or EDA service is loaded here. @module rtl-tools/phase1/experiment */
import { mkdir, readFile, realpath, open } from 'node:fs/promises'
import { join, basename, dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { recordValidator, uuidSchema, checkId } from './record-validation.ts'
import type { PhaseId } from './contracts.ts'
import { callText, type ModelRuntime } from './model.ts'
import { EventRecorder } from './recorder.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { publish, saveCandidate, OutputError } from './candidates.ts'
import { generationPrompt, loadProtocol, scoringIdentity, taskId, variants, type Variant } from './protocol.ts'

/** Trusted application locations. */
export interface ExperimentSettings { outputRoot: string; datasetRoot: string; settingsFile: string }
/** Development model configuration, frozen for all variants. */
export const modelSettings = { model: 'deepseek-flash', maxTokens: 2048, temperature: 0, timeoutMs: 60000, maxResponseBytes: 65536 }
const manifestSchema = recordValidator<Experiment>({ schema_version: { const: '1.2' }, experiment_id: uuidSchema, task_id: { const: taskId }, created_at: { type: 'string' }, protocol_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' }, evaluation_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' }, config_sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' }, model: { const: 'deepseek-flash' }, variants: { const: [...variants] } })
/** A validated comparison manifest. */
export interface Experiment { schema_version: '1.2'; experiment_id: string; task_id: typeof taskId; created_at: string; protocol_sha256: string; evaluation_sha256: string; config_sha256: string; model: 'deepseek-flash'; variants: Variant[] }
/** Hash trusted execution settings and evaluator assets. @param config - host locations. @returns digest and source configuration hash. */
export async function evaluationHash(config: ExperimentSettings) {
  const configHash = sha256(await readFile(config.settingsFile))
  return { hash: sha256(JSON.stringify({ scoringIdentity, configHash, limits })), configHash }
}
/** Execution budgets are development defaults, not contest limits. */
export const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 30000, totalMs: 300000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
/** Allocate one experiment; this never dispatches a model request. @param config - host locations. @returns id and artifact directory. */
export async function initializeExperiment(config: ExperimentSettings) {
  const protocol = await loadProtocol(config.datasetRoot), score = await evaluationHash(config)
  const experiment_id = randomUUID(), directory = join(config.outputRoot, 'comparison-' + experiment_id)
  await mkdir(directory, { recursive: true })
  const manifest: Experiment = { schema_version: '1.2', experiment_id, task_id: taskId, created_at: new Date().toISOString(), protocol_sha256: protocol.sha256, evaluation_sha256: score.hash, config_sha256: score.configHash, model: 'deepseek-flash', variants: [...variants] }
  await publish(directory, 'experiment.json', JSON.stringify(manifest, null, 2) + '\n')
  await publish(directory, 'protocol.json', JSON.stringify({ schema_version: '1.2', ...protocol, model: modelSettings, top_p: { sent: false, effective: null }, source: 'NVlabs/verilog-eval/scripts/sv-generate', license: 'MIT', domain_rule_placement: 'system append instead of upstream user append' }, null, 2) + '\n')
  for (const variant of variants) await mkdir(join(directory, variant))
  return { experiment_id, directory }
}
/** Load only a host-issued experiment id and recheck frozen public/config inputs. @param config - host config. @param id - uuid, never a path. @returns manifest and private path. */
export async function loadExperiment(config: ExperimentSettings, id: string) {
  checkId(id)
  const directory = await realpath(join(config.outputRoot, 'comparison-' + id))
  if (directory !== join(await realpath(config.outputRoot), 'comparison-' + id)) throw new Error('Experiment redirected')
  const manifest = manifestSchema.parse(JSON.parse(await readFile(await checkedFile(directory, 'experiment.json'), 'utf8')))
  const protocol = await loadProtocol(config.datasetRoot), score = await evaluationHash(config)
  if (manifest.experiment_id !== id || manifest.protocol_sha256 !== protocol.sha256 || manifest.evaluation_sha256 !== score.hash) throw new Error('Experiment inputs changed')
  return { manifest, protocol, directory }
}
/** Append bounded variant evidence without credentials or raw provider errors. @param dir - private route. @param variant - route. @param purpose - action. @param value - bounded facts. */
export async function event(dir: string, variant: Variant, purpose: string, value: unknown): Promise<void> {
  const experiment_id = basename(dirname(dir)).replace(/^comparison-/, '')
  checkId(experiment_id)
  const record = JSON.stringify({ schema_version: '1.2', experiment_id, task_id: taskId, variant_id: variant, purpose, timestamp: new Date().toISOString(), value }) + '\n'
  if (Buffer.byteLength(record) > 1048576) throw new Error('Experiment event too large')
  const handle = await open(join(dir, 'events.jsonl'), 'a', 0o600)
  try {
    if ((await handle.stat()).size + Buffer.byteLength(record) > 1048576) throw new Error('Experiment event budget exceeded')
    await handle.writeFile(record); await handle.sync()
  } finally { await handle.close() }
}
/** Make one auditable model call. Its stream is handled by the existing provider wrapper. @param runtime - LLM service. @param directory - route. @param experiment - id. @param variant - route. @param purpose - generation or interpretation. @param prompt - explicit public system/user text. @param signal - cancellation. @returns bounded model facts and run path. */
export async function modelCall(runtime: ModelRuntime, directory: string, experiment: string, variant: Variant, purpose: 'generation' | 'interpretation', prompt: { system: string; user: string }, signal: AbortSignal) {
  const identity = { experiment_id: experiment as PhaseId, task_id: taskId as PhaseId, sample_id: 0, mode: variant === 'baseline' ? 'baseline' as const : 'agent' as const }
  const recorder = await EventRecorder.create(directory, identity, 1048576, '1.1')
  try {
    await event(directory, variant, purpose + '_request', { ...prompt, settings: modelSettings, tools: [], top_p: null, run: recorder.directory })
    const frozenRuntime: ModelRuntime = { async prepareCall(settings, caller) {
      const prepared = await runtime.prepareCall(settings, caller)
      const actual = { provider: prepared.config.provider, model: prepared.config.model, temperature: prepared.config.temperature, maxTokens: prepared.config.maxTokens, reasoningEffort: prepared.config.reasoningEffort ?? null, top_p_sent: false }
      if (actual.provider !== 'deepseek-official' || actual.model !== modelSettings.model || actual.temperature !== modelSettings.temperature || actual.maxTokens !== modelSettings.maxTokens) throw Object.assign(new Error('Resolved configuration drift'), { code: 'INVALID_REQUEST' })
      const parent = join(directory, '..'), frozen = JSON.stringify(actual)
      try { await publish(parent, 'request-config.json', frozen) }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
        if (await readFile(await checkedFile(await realpath(parent), 'request-config.json'), 'utf8') !== frozen) throw Object.assign(new Error('Frozen configuration drift'), { code: 'INVALID_REQUEST' })
      }
      await event(directory, variant, purpose + '_resolved', actual)
      return prepared
    } }
    const value = await callText(frozenRuntime, { ...modelSettings, system: prompt.system }, prompt.user, recorder, { revision_id: purpose as PhaseId, call_id: randomUUID() as PhaseId }, signal)
    await publish(recorder.directory, 'model.json', JSON.stringify(value, null, 2) + '\n')
    await publish(recorder.directory, 'response.txt', value.content)
    await recorder.finish({ schema_version: '1.1', ...identity, final_status: signal.aborted ? 'ABORTED' : 'INCONCLUSIVE', final_revision_id: null, final_source_sha256: null, verification_key: null, final_verified: false,
      stages: { compile: null, elaborate: null, simulation: null, synthesis: null }, semantic_repairs: 0, model_requests_total: 1, transport_retries: 0, stop_reason: value.error ? value.error.category : 'Text only; no verification claim', artifact_manifest: ['model.json', 'response.txt', 'events.jsonl'] })
    await event(directory, variant, purpose + '_finished', { value, run: recorder.directory })
    return { value, run: recorder.directory }
  } finally { await recorder.close() }
}
/** Generate exactly once; Baseline calls this without importing the evaluator. @param runtime - provider. @param config - trusted config. @param id - experiment. @param variant - route. @param signal - cancellation. @returns terminal generation evidence. */
export async function generate(runtime: ModelRuntime, config: ExperimentSettings, id: string, variant: Variant, signal: AbortSignal) {
  const experiment = await loadExperiment(config, id), directory = join(experiment.directory, variant)
  const preflight = JSON.parse(await readFile(await checkedFile(await realpath(config.outputRoot), 'dataset-preflight.json'), 'utf8'))
  if (preflight.status !== 'PASS' || preflight.evaluation_sha256 !== experiment.manifest.evaluation_sha256) throw new Error('Matching real evaluator preflight required')
  await publish(directory, 'generation-claimed.json', JSON.stringify({ at: new Date().toISOString(), variant }))
  const started = performance.now()
  const model = await modelCall(runtime, directory, id, variant, 'generation', generationPrompt(experiment.protocol, variant), signal)
  let candidate: Awaited<ReturnType<typeof saveCandidate>> | null = null, error: string | null = model.value.error?.category ?? null
  if (!error) {
    try { candidate = await saveCandidate(directory, id, variant, model.value.content, experiment.manifest.evaluation_sha256) }
    catch (failure) { error = failure instanceof OutputError ? failure.category : 'publication_error' }
  }
  const result = { schema_version: '1.2', variant_id: variant, status: error ? 'FAILED' : 'AWAITING_REVIEW', error, candidate, model, duration_ms: Math.round(performance.now() - started), completed_at: new Date().toISOString() }
  await publish(directory, 'generation.json', JSON.stringify(result, null, 2) + '\n')
  await event(directory, variant, 'generation_terminal', result)
  return result
}
