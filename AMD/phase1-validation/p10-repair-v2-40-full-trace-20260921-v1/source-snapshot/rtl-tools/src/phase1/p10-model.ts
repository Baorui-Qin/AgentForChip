/** P10 shared-seed comparison and separate repair calibration through existing P09 services. @module rtl-tools/phase1/p10-model */
import { mkdir, readFile, realpath, access, open, unlink, rename } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { setTimeout as sleep } from 'node:timers/promises'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { createToolResultMessage, type Message } from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-subprocess'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { publish, extractSource, OutputError } from './candidates.ts'
import { sha256 } from './snapshots.ts'
import { loadCompatAssets, negativeControl } from './p10-compat.ts'
import type { P10Task } from './p10-dataset.ts'
import { callText, type ModelObservation, type ModelSettings } from './model.ts'
import { EventRecorder } from './recorder.ts'
import { buildContext, ledgerEntry, type ContextInput, type RepairLedgerEntry } from './p09-context.ts'
import { textWire } from './p09-tokenizer.ts'
import { callAction, checkCounterRuntime, countActionWire, type AutoSettings } from './p09-action-call.ts'
import { loadP09Skills, readP09Settings, retrieveP09Skills } from './p09-proposal.ts'
import { reserveDispatch } from './p09-claims.ts'
import { autoTools, checkAutoSource, parseAutoAction } from './p09-auto-policy.ts'
import { readDiagnostics } from './repair-diagnostics.ts'
import { decideRepair } from './repair-policy.ts'
import { retryableTransport } from './repair-loop.ts'
import { readDoctorConfig } from './doctor.ts'
import { VerificationRunner, type VerificationLimits } from './verification.ts'
import type { PhaseId } from './contracts.ts'
import { appendToolTrace, verificationEvidence } from './p10-trace.ts'
import { compareRevision, revisionScore } from './p10-revision.ts'

export const name = 'rtl-p10-model'
export const inject = ['cmdlineArgs', 'appReady', 'llm', 'subprocess', 'sandboxPolicy']
export const Config = z.object({ campaignRoot: z.string().required(), preflightRoot: z.string().required(), datasetRoot: z.string().required(),
  settingsFile: z.string().required(), p09File: z.string().required(), autoFile: z.string().required(), freezeFile: z.string().required(),
  allowUnisolatedAutomatic: z.boolean().default(false), model: z.string().required(), maxTokens: z.natural().required(), temperature: z.number().required(),
  timeoutMs: z.natural().min(1).required(), activeMs: z.natural().min(1).max(1200000).required(), maxResponseBytes: z.natural().required(),
  maxTransportRetries: z.natural().max(2).default(2), transportBackoffMs: z.array(z.natural().max(60000)).default([1000, 2000]),
  maxOutputRecoveryAttempts: z.natural().max(1).default(1),
  repairMaxTokens: z.natural().min(1).default(16384), forcedActionMaxTokens: z.natural().min(1).default(4096),
  repairMaxResponseBytes: z.natural().min(1).default(262144), compactThreshold: z.number().min(0.1).max(1).default(0.8),
  maxRepairRounds: z.natural().min(1).max(3).default(3),
  maxGenerationResumes: z.natural().max(2).default(1),
  selectedTaskCount: z.natural().min(1).max(40).default(10),
  compileMs: z.natural().min(1).required(), elaborateMs: z.natural().min(1).required(), simulationMs: z.natural().min(1).required(),
  totalMs: z.natural().min(1).required(), maxArtifactBytes: z.natural().min(1).required(), artifactPollMs: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required() })

interface RepairAttemptAudit {
  semantic_round: number; baseline_failed: boolean
  feedback: { revision_id: string; source_sha256: string; verification_key: string; evidence_kind: string; model_run: string }
  edit: { accepted: true; previous_source_sha256: string; revision_id: string; source_sha256: string; source_sha_changed: boolean }
  verification: null | { accepted: true; revision_id: string; verification_run: string; result_sha256: string; status: string; persisted: true }
  valid: boolean; missing_steps: string[]
}

/** Explicit commands separate one-shot generation, scored comparison, and faulty-seed repair calibration. @param ctx - provider and Host services. @param config - frozen deployment. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const args = ctx.cmdlineArgs!.get()
  if (!['generate', 'resume-generate', 'probe', 'compare', 'repair-control'].includes(args[0] ?? '') || args.length !== 2) throw new Error('Use generate|resume-generate|probe|compare|repair-control <task-id>')
  const controller = new AbortController(); let pending: Promise<void> | undefined
  ctx.effect(() => async () => { controller.abort(); await pending })
  ctx.effect(() => ctx.get('appReady')!.onReady(() => {
    pending = run(ctx, config, args[0]!, args[1]!, controller.signal).then(() => ctx.get('appExit')!(0)).catch(error => {
      process.stderr.write((error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'P10_MODEL_HOST_FAILURE') + '\n'); ctx.get('appExit')!(1)
    })
  }))
}

async function run(ctx: Context, config: ReturnType<typeof Config>, command: string, taskId: string, caller: AbortSignal) {
  const resuming = command === 'resume-generate'
  if (resuming) command = 'generate'
  if (!config.allowUnisolatedAutomatic || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('P10_EXPLICIT_MODEL_AUTHORITY_REQUIRED')
  if (config.transportBackoffMs.length !== config.maxTransportRetries) throw new Error('P10_RECOVERY_CONFIGURATION_INVALID')
  const root = await realpath(config.campaignRoot), preflight = await realpath(config.preflightRoot)
  const freezeBytes = await readFile(config.freezeFile), freeze = JSON.parse(freezeBytes.toString()) as { files: Record<string, string> }
  const assertFreeze = async () => {
    if (sha256(await readFile(config.freezeFile)) !== sha256(freezeBytes)) throw new Error('CAMPAIGN_FREEZE_CHANGED')
    for (const [file, hash] of Object.entries(freeze.files)) if (sha256(await readFile(file)) !== hash) throw new Error('CAMPAIGN_SOURCE_CHANGED')
  }
  await assertFreeze()
  const catalog = JSON.parse(await readFile(join(preflight, 'catalog.json'), 'utf8')) as P10Task[]
  const order = JSON.parse(await readFile(join(preflight, 'selection-order.json'), 'utf8')) as string[]
  const calibrations = JSON.parse(await readFile(join(preflight, 'compat-positive-negative-results.json'), 'utf8')) as { task_id: string; evaluable: boolean }[]
  const task = catalog.find(t => t.task_id === taskId)
  if (!task?.interface || !(command === 'repair-control' ? taskId === 'Prob038_count15' || order.slice(0, config.selectedTaskCount).includes(taskId) : order.slice(0, config.selectedTaskCount).includes(taskId))) throw new Error('TASK_NOT_FROZEN')
  if (!calibrations.find(r => r.task_id === taskId)?.evaluable) throw new Error('EVALUATOR_NOT_CALIBRATED')
  const policy = JSON.parse(await readFile(join(preflight, 'evaluator-policy.json'), 'utf8'))
  const p09 = await readP09Settings(config.p09File), auto = JSON.parse(await readFile(config.autoFile, 'utf8')) as AutoSettings
  if (auto.campaignRoot !== root.replace(/\\/g, '/') && auto.campaignRoot !== root) throw new Error('CAMPAIGN_ROOT_MISMATCH')
  const counterRuntime = await checkCounterRuntime(auto)
  await loadP09Skills(p09)
  const target = join(root, command === 'probe' ? `probe-${taskId}-${randomUUID()}` : `${command}-${taskId}`)
  if (!resuming) {
    await mkdir(target)
    await mkdir(join(target, 'models')); await mkdir(join(target, 'eda')); await mkdir(join(target, 'revisions'))
  }
  const previous = resuming ? JSON.parse(await readFile(join(target, 'result.json'), 'utf8')) : null
  if (resuming && (previous.status !== 'INFRA_PAUSED' || !/^[a-f0-9]{64}$/.test(previous.resume_request_sha256 ?? '') ||
    !Number.isSafeInteger(previous.generation_resumes) || previous.generation_resumes < 0 || previous.generation_resumes >= config.maxGenerationResumes ||
    previous.output_recovery_attempts !== 0 || !Array.isArray(previous.generation_attempts) || !previous.generation_attempts.length ||
    !previous.generation_attempts.every((attempt: { response_complete: boolean; observation?: ModelObservation }) => !attempt.response_complete && attempt.observation?.response_bytes === 0) ||
    previous.freeze_sha256 !== sha256(freezeBytes) || await access(join(target, 'initial.sv')).then(() => true, () => false))) throw new Error('GENERATION_RESUME_REJECTED')
  if (previous && sha256(await readFile(join(target, `result-window-${previous.generation_resumes}.json`))) !== sha256(await readFile(join(target, 'result.json')))) throw new Error('GENERATION_CHECKPOINT_CHANGED')
  const experiment = (previous?.experiment_id ?? randomUUID()) as PhaseId
  const generationLock = command === 'generate' ? await open(join(target, 'generation.lock'), 'wx', 0o600) : null
  if (generationLock && previous) {
    try {
      if (JSON.stringify(JSON.parse(await readFile(join(target, 'result.json'), 'utf8'))) !== JSON.stringify(previous)) throw new Error('GENERATION_CHECKPOINT_CHANGED')
    } catch (error) {
      await generationLock.close(); await unlink(join(target, 'generation.lock')); throw error
    }
  }
  const model: ModelSettings = { model: config.model, maxTokens: config.maxTokens, temperature: config.temperature, timeoutMs: config.timeoutMs, maxResponseBytes: config.maxResponseBytes }
  const publicTask = { id: taskId, spec: task.spec, interface: task.interface, constraints: 'SystemVerilog, single self-contained TopModule DUT; xczu3eg-sbva484-1-e; 5 ns synthesis clock; simulator seed 1. No reference dependencies, hierarchy outside the DUT, file access, includes or DPI.' }
  const active = new AbortController(), timer = setTimeout(() => active.abort(), config.activeMs)
  const signal = AbortSignal.any([caller, active.signal])
  let runner: VerificationRunner | undefined
  const requests: string[] = previous?.model_runs ?? [], actions: unknown[] = [], revisions: unknown[] = [], runs: string[] = []
  const transportRetryRecords: Record<string, unknown>[] = previous?.transport_retry_records ?? [], outputRecoveryRecords: Record<string, unknown>[] = previous?.output_recovery_records ?? []
  const generationAttempts: Record<string, unknown>[] = previous?.generation_attempts ?? []
  const repairDecisions: Record<string, unknown>[] = [], repairAttempts: RepairAttemptAudit[] = []
  let dispatches = previous?.physical_dispatches ?? 0, logicalAgentRequests = 0, transportRetries = previous?.transport_retries ?? 0, outputRecoveryAttempts = 0, boundFeedbackDispatches = 0
  let promptTokens = previous?.prompt_tokens ?? 0, completionTokens = previous?.completion_tokens ?? 0, unknownUsageRequests = previous?.unknown_usage_requests ?? 0, modelWallMs = previous?.model_wall_ms ?? 0
  const accountModel = (value: { prompt_tokens: number | null; completion_tokens: number | null; request_wall_ms: number }) => {
    modelWallMs += value.request_wall_ms
    if (value.prompt_tokens === null || value.completion_tokens === null) unknownUsageRequests++
    else { promptTokens += value.prompt_tokens; completionTokens += value.completion_tokens }
  }
  let result: Record<string, unknown> = { task_id: taskId, command, experiment_id: experiment, status: 'INCONCLUSIVE', full_os_isolation_verified: false,
    shared_initial: command === 'compare', counted_in_model_score: command === 'compare', model_runs: requests, actions, revisions, verification_runs: runs,
    transport_retry_records: transportRetryRecords, output_recovery_records: outputRecoveryRecords, repair_decisions: repairDecisions, repair_attempts: repairAttempts,
    generation_attempts: generationAttempts, generation_resumes: previous ? previous.generation_resumes + 1 : 0, freeze_sha256: sha256(freezeBytes) }
  try {
    if (command === 'probe') {
      const recorder = await EventRecorder.create(join(target, 'models'), { experiment_id: experiment, task_id: taskId as PhaseId, sample_id: 0, mode: 'baseline' }, config.maxEventBytes, '1.3')
      requests.push(recorder.directory)
      try {
        let observation: ModelObservation | null = null
        const runtime = { prepareCall: async (...args: Parameters<typeof ctx.llm.prepareCall>) => {
            const prepared = await ctx.llm.prepareCall(...args)
            if (prepared.retryPolicy.mode !== 'normal' || prepared.retryPolicy.maxRetries !== 0) throw new Error('LOWER_LEVEL_RETRY_ENABLED')
            await reserveDispatch(root, auto.bucket, { experiment, purpose: 'provider_health_probe' }, signal, auto.maxDispatches)
            return prepared
          } }
        const response = await callText(runtime, model, 'Reply with OK only. This is a provider health check, not an RTL task.', recorder,
          { call_id: randomUUID() as PhaseId, revision_id: null }, signal, value => { observation = value })
        dispatches += response.dispatched ? 1 : 0
        accountModel({ prompt_tokens: response.usage.prompt_tokens, completion_tokens: response.usage.completion_tokens, request_wall_ms: response.timing.request_wall_ms })
        await publish(recorder.directory, 'model.json', JSON.stringify(response, null, 2))
        await publish(recorder.directory, 'transport.json', JSON.stringify(observation, null, 2))
        result.status = !response.error && response.content.trim() === 'OK' ? 'HEALTHY' : 'UNHEALTHY'
        result.observation = observation; result.counted_in_model_score = false
      } finally { await recorder.close() }
      return
    }
    if (command === 'generate') {
      result.logical_initial_requests = 1
      let input: ContextInput = { task: publicTask, sample_id: experiment, variant_id: 'A', current: null, binding: null, feedback: null, ledger: [], purpose: 'generation' }
      let expectedRequestHash: string | null = previous?.resume_request_sha256 ?? null, retriesForRequest = 0
      if (previous) {
        transportRetries++
        transportRetryRecords.push({ phase: 'initial_generation', request_sha256: expectedRequestHash, recovery: 'explicit_same_task_resume', previous_window: previous.generation_resumes })
      }
      let recoveryParent: { request_sha256: string; model_run: string } | null = null
      while (true) {
        const recorder = await EventRecorder.create(join(target, 'models'), { experiment_id: experiment, task_id: taskId as PhaseId, sample_id: requests.length, mode: 'baseline' }, config.maxEventBytes, '1.3')
        requests.push(recorder.directory)
        let observation: ModelObservation | null = null, requestHash: string | null = null
        try {
          const response = await callText(ctx.llm, model, '', recorder, { call_id: randomUUID() as PhaseId, revision_id: null }, signal, value => { observation = value }, async (prepared, callSignal) => {
            if (prepared.retryPolicy.mode !== 'normal' || prepared.retryPolicy.maxRetries !== 0) throw new Error('LOWER_LEVEL_RETRY_ENABLED')
            if (!prepared.context?.contextWindow || prepared.config.maxTokens !== p09.limits.output) throw new Error('CONTEXT_CONFIGURATION_ERROR')
            const resolved = JSON.stringify({ config: prepared.config, defaults: prepared.adapterDefaults, context: prepared.context })
            try { await publish(target, 'resolved-model.json', resolved) }
            catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST' || await readFile(join(target, 'resolved-model.json'), 'utf8') !== resolved) throw new Error('CONFIG_CHANGED') }
            let seq = 0
            const built = await buildContext(input, { ...p09.limits, window: Math.min(p09.limits.window, prepared.context.contextWindow) }, {
              quality: 'exact_local', identity: { implementation: 'official-rust-deepseek-recipe', revision: counterRuntime.revision, manifest_sha256: auto.runtimeManifestSha256, cloud_equivalence: 'unconfirmed' },
              count: (view, countSignal) => countActionWire(counterRuntime, auto, ctx.subprocess, join(recorder.directory, 'token-' + ++seq), textWire(prepared, view), countSignal),
            }, callSignal)
            const wire = textWire(prepared, built)
            requestHash = sha256(JSON.stringify(wire))
            if (expectedRequestHash && expectedRequestHash !== requestHash) throw new Error('RETRY_REQUEST_CHANGED')
            await publish(recorder.directory, 'context.json', JSON.stringify(input, null, 2))
            await publish(recorder.directory, 'context-audit.json', JSON.stringify(built.audit, null, 2))
            await publish(recorder.directory, 'prompt-final.json', JSON.stringify(wire, null, 2))
            const ticket = await reserveDispatch(root, auto.bucket, { experiment, purpose: input.purpose === 'format_recovery' ? 'shared_initial_output_recovery' : 'shared_initial', request_sha256: requestHash }, callSignal, auto.maxDispatches)
            await publish(recorder.directory, 'dispatch.json', JSON.stringify({ ticket, request_sha256: requestHash, parent_request_sha256: recoveryParent?.request_sha256 ?? null }))
            return built
          })
          dispatches += response.dispatched ? 1 : 0
          accountModel({ prompt_tokens: response.usage.prompt_tokens, completion_tokens: response.usage.completion_tokens, request_wall_ms: response.timing.request_wall_ms })
          await publish(recorder.directory, 'model.json', JSON.stringify(response, null, 2))
          await publish(recorder.directory, 'response.txt', response.content)
          await publish(recorder.directory, 'transport.json', JSON.stringify(observation, null, 2))
          const attempt: Record<string, unknown> = { model_run: recorder.directory, request_sha256: requestHash, observation,
            response_complete: !response.error && !response.truncated, candidate_extracted: false, candidate_valid: false }
          generationAttempts.push(attempt)
          if (recoveryParent && requestHash && !outputRecoveryRecords.some(item => item.parent_request_sha256 === recoveryParent!.request_sha256)) outputRecoveryRecords.push({
            phase: 'initial_generation', parent_model_run: recoveryParent.model_run, parent_request_sha256: recoveryParent.request_sha256,
            recovery_model_run: recorder.directory, recovery_request_sha256: requestHash })
          if (response.error) {
            if (retryableTransport(response, observation) && retriesForRequest < config.maxTransportRetries) {
              const backoffMs = config.transportBackoffMs[retriesForRequest]!
              transportRetries++; retriesForRequest++; expectedRequestHash = requestHash
              transportRetryRecords.push({ phase: 'initial_generation', failed_model_run: recorder.directory, request_sha256: requestHash, retry_number: retriesForRequest, backoff_ms: backoffMs, observation })
              await sleep(backoffMs, undefined, { signal }); continue
            }
            if (response.truncated && outputRecoveryAttempts < config.maxOutputRecoveryAttempts && requestHash) {
              outputRecoveryAttempts++; recoveryParent = { request_sha256: requestHash, model_run: recorder.directory }
              input = { ...input, purpose: 'format_recovery', format_response: response.content, source_log_truncated: true }
              expectedRequestHash = null; retriesForRequest = 0; continue
            }
            result.status = response.truncated ? 'OUTPUT_TRUNCATED' : response.error.category === 'timeout' ? 'TIMEOUT' : response.error.category === 'connection' || response.error.category === 'service' ? 'TRANSPORT' : 'MODEL_RESPONSE_ERROR'
            if (retryableTransport(response, observation) && !outputRecoveryAttempts && !signal.aborted && requestHash) {
              result.status = 'INFRA_PAUSED'; result.resume_request_sha256 = requestHash
            }
            result.transport_observation = observation
            result.error = response.error; return
          }
          const extracted = extractSource(response.content, response.truncated, config.maxResponseBytes, task.interface)
          attempt.candidate_extracted = true
          checkAutoSource(extracted.source, task.interface)
          await publish(target, 'initial.sv', extracted.source)
          attempt.candidate_valid = true
          result = { ...result, status: 'GENERATED_UNVERIFIED', source_sha256: extracted.source_sha256, logical_initial_requests: 1,
            initial_provider_dispatches: dispatches, model_requests: requests.length, feedback_exposed: false, tools_exposed: false, skills_exposed: false }
          return
        } finally { await recorder.close() }
      }
    }
    const { config: eda } = await readDoctorConfig(config.settingsFile)
    runner = new VerificationRunner(ctx.subprocess, { ...eda, outputRoot: join(target, 'eda') }, config as VerificationLimits)
    const sharedRoot = join(root, `generate-${taskId}`)
    let source: string
    if (command === 'compare') {
      const initial = JSON.parse(await readFile(join(sharedRoot, 'result.json'), 'utf8'))
      source = await readFile(join(sharedRoot, 'initial.sv'), 'utf8')
      if (initial.status !== 'GENERATED_UNVERIFIED' || sha256(source) !== initial.source_sha256) throw new Error('INITIAL_BINDING_INVALID')
      result.shared_initial_generation = sharedRoot; result.shared_initial_sha256 = sha256(source)
      result.initial_generation_logical_requests = 1
      result.initial_generation_physical_requests = initial.initial_provider_dispatches ?? initial.physical_dispatches
      result.initial_generation_charged_again = false
    } else { source = negativeControl(task); result.control_seed = 'reviewed_negative_copy_not_baseline'; result.shared_initial = false }
    let revision = randomUUID(), pending = false, repairs = 0, history: Message[] = [], ledger: RepairLedgerEntry[] = []
    let facts: Awaited<ReturnType<typeof readDiagnostics>> | null = null
    async function saveRevision() {
      const directory = join(target, 'revisions', revision); await mkdir(directory)
      await publish(directory, 'solution.sv', source)
      revisions.push({ revision, sha256: sha256(source), directory })
    }
    async function verify(trigger: 'HOST_INITIAL' | 'AGENT_TOOL') {
      await assertFreeze(); checkAutoSource(source, task!.interface!)
      const { assets, evaluation } = await loadCompatAssets(config.datasetRoot, task!, join(preflight, 'derived'), policy.defaultTimescale ?? undefined)
      assets['rtl/solution.sv'] = source
      const snapshot = await runner!.registerDataset(assets, evaluation, { experiment_id: experiment, task_id: taskId as PhaseId, sample_id: runs.length, mode: command === 'compare' && runs.length === 0 ? 'baseline' : 'agent' })
      const outcome = await runner!.verify(snapshot, signal, argv => argv); runs.push(outcome.artifacts)
      facts = await readDiagnostics(outcome.artifacts, 'live_verification')
      if (facts.record.final_source_sha256 !== sha256(source)) throw new Error('VERIFICATION_BINDING_INVALID')
      pending = false
      await publish(target, `feedback-${runs.length}.json`, JSON.stringify(facts.receipt, null, 2))
      await appendToolTrace(target, { event: 'verification', verification_trigger: trigger, revision_id: revision, source_sha256: sha256(source), ...verificationEvidence(facts) })
      process.stdout.write(JSON.stringify({ task_id: taskId, command, verification: outcome.status, revision, run: outcome.artifacts }) + '\n')
      return facts
    }
    await saveRevision()
    let observed = await verify('HOST_INITIAL')
    let currentRun = runs.at(-1)!
    let best = { revision, source, observed, run: currentRun, score: revisionScore(observed.receipt, observed.record.final_verified) }
    const rejectedRevisions: NonNullable<ContextInput['repair_control']>['rejected'] = []
    const revisionDecisions: Record<string, unknown>[] = []
    result.revision_decisions = revisionDecisions
    result.context_compactions = 0
    const repairModel = { ...model, maxTokens: config.repairMaxTokens, maxResponseBytes: config.repairMaxResponseBytes }
    result.initial_status = observed.record.final_status; result.baseline_run = command === 'compare' ? runs[0] : null
    const baselineFailed = !observed.record.final_verified
    let repairEligible = false, repairRequested = false
    if (command === 'repair-control' && !observed.receipt.stages.some(s => s.functional_failure)) throw new Error('NEGATIVE_CONTROL_NOT_OBSERVED')
    let status = 'MODEL_REQUEST_BUDGET_EXHAUSTED'
    const agentRequestLimit = p09.maxRequests - (command === 'compare' ? 1 : 0)
    while (requests.length < agentRequestLimit && actions.length < auto.maxToolSteps) {
      if (!pending) {
        const decision = decideRepair(observed.receipt, { calibrated: true, bound: true, attempts: repairs, maxAttempts: config.maxRepairRounds, top: 'TopModule' })
        repairDecisions.push({ ...decision, revision_id: revision, source_sha256: sha256(source), verification_key: observed.record.verification_key })
        if (decision.rule === 'VERIFIED' && observed.record.final_verified) { status = 'VERIFIED'; break }
        if (decision.action !== 'propose_repair') {
          status = decision.action === 'blocked' ? 'POLICY_BLOCKED' : decision.rule
          result.terminal_policy_rule = decision.rule; break
        }
        repairEligible = true
      }
      const input: ContextInput = { task: publicTask, sample_id: experiment, variant_id: p09.variant,
        current: { revision_id: revision, source_sha256: sha256(source), source },
        binding: pending ? null : { revision_id: revision, source_sha256: sha256(source), verification_key: observed.record.verification_key! },
        feedback: pending ? null : observed.receipt, ledger, purpose: 'repair', tool_mode: true, pending_verification: pending,
        repair_control: { mode: 'normal', compacted: false, best_revision_id: best.revision, best_source_sha256: sha256(best.source), rejected: rejectedRevisions } }
      await assertFreeze()
      logicalAgentRequests++
      let requestInput = input, requestHistory = history
      let response: Awaited<ReturnType<typeof callAction>> | undefined, expectedRequestHash: string | null = null
      let retriesForRequest = 0, recoveriesForRequest = 0, contextRecoveries = 0
      let recoveryParent: { request_sha256: string; model_run: string } | null = null
      while (true) {
        if (requests.length >= agentRequestLimit) { status = 'MODEL_REQUEST_BUDGET_EXHAUSTED'; break }
        const requestModel = requestInput.repair_control?.mode === 'forced_action' ? { ...repairModel, maxTokens: config.forcedActionMaxTokens } : repairModel
        response = await callAction({ root: target, experiment, sequence: requests.length + 1, input: requestInput, history: requestHistory, auto,
          p09: { ...p09, limits: { ...p09.limits, output: requestModel.maxTokens } }, model: requestModel, compactThreshold: config.compactThreshold,
          runtime: ctx.llm, subprocess: ctx.subprocess, maxEventBytes: config.maxEventBytes, signal, loadSkills: () => loadP09Skills(p09), expectedRequestHash,
          claim: async directory => { requests.push(directory) } })
        accountModel(response)
        if (response.context_compacted) result.context_compactions = Number(result.context_compactions) + 1
        const modelRun = requests.at(-1)!
        await appendToolTrace(target, { event: 'model_request', turn_id: logicalAgentRequests, model_run_id: modelRun,
          agent_state: pending ? 'PENDING_VERIFICATION' : 'VERIFIED_FAILURE', available_tools: autoTools(auto.registry, pending).filter(tool => requestInput.repair_control?.mode !== 'forced_action' || tool.name !== 'finish').map(tool => tool.name),
          repair_mode: requestInput.repair_control?.mode, output_budget: requestModel.maxTokens, context_compacted: response.context_compacted === true,
          request_sha256: response.prompt_sha256, observation: response.observation,
          feedback_in_request_sha256: response.feedback_in_request_sha256, feedback_projection_sha256: response.feedback_projection_sha256,
          consumed_feedback_sha256: response.consumed_feedback_sha256, error_code: response.error_code })
        if (response.dispatched) {
          dispatches++
          if (!requestInput.pending_verification && requestInput.binding && requestInput.feedback?.evidence_kind === 'live_verification') {
            boundFeedbackDispatches++; repairRequested = true
          }
        }
        if (recoveryParent && response.prompt_sha256 && !outputRecoveryRecords.some(item => item.parent_request_sha256 === recoveryParent!.request_sha256)) outputRecoveryRecords.push({
          phase: 'agent_repair', parent_model_run: recoveryParent.model_run, parent_request_sha256: recoveryParent.request_sha256,
          recovery_model_run: modelRun, recovery_request_sha256: response.prompt_sha256 })
        if (response.retryable && retriesForRequest < config.maxTransportRetries) {
          const backoffMs = config.transportBackoffMs[retriesForRequest]!
          retriesForRequest++; transportRetries++; expectedRequestHash = response.prompt_sha256
          transportRetryRecords.push({ phase: 'agent_repair', failed_model_run: modelRun, request_sha256: response.prompt_sha256, retry_number: retriesForRequest, backoff_ms: backoffMs })
          await sleep(backoffMs, undefined, { signal }); continue
        }
        if (['CONTEXT_LENGTH_EXCEEDED', 'CONTEXT_WINDOW_EXCEEDED'].includes(response.error_code ?? '') && contextRecoveries < 1) {
          contextRecoveries++
          requestInput = { ...requestInput, core_only: true }; requestHistory = []; expectedRequestHash = null; retriesForRequest = 0; continue
        }
        if (response.error_code === 'OUTPUT_TRUNCATED' && recoveriesForRequest < config.maxOutputRecoveryAttempts && response.prompt_sha256) {
          recoveriesForRequest++; outputRecoveryAttempts++
          recoveryParent = { request_sha256: response.prompt_sha256, model_run: modelRun }
          requestInput = { ...input, repair_control: { ...input.repair_control!, mode: 'forced_action', compacted: true }, core_only: true,
            action_error: 'OUTPUT_TRUNCATED_RETURN_EXACTLY_ONE_COMPLETE_TOOL_CALL_WITHOUT_REASONING' }
          requestHistory = []; expectedRequestHash = null; retriesForRequest = 0; continue
        }
        break
      }
      if (status === 'MODEL_REQUEST_BUDGET_EXHAUSTED' && !response) break
      if (!response) { status = 'MODEL_RESPONSE_ERROR'; break }
      if (response.error_code || !response.message) {
        status = response.error_code === 'OUTPUT_TRUNCATED' ? 'OUTPUT_TRUNCATED' : response.error_code === 'TIMEOUT' ? 'TIMEOUT'
          : response.retryable || ['TRANSPORT', 'CONNECTION', 'CONNECT', 'SERVER'].includes(response.error_code ?? '') ? 'TRANSPORT' : response.error_code ?? 'MODEL_RESPONSE_ERROR'
        break
      }
      const calls = response.message.content.filter(b => b.type === 'tool-call')
      if (calls.length !== 1) {
        status = 'INVALID_MODEL_ACTION'
        await appendToolTrace(target, { event: 'agent_response_rejected', turn_id: logicalAgentRequests, model_run_id: requests.at(-1),
          available_tools: autoTools(auto.registry, pending).filter(tool => requestInput.repair_control?.mode !== 'forced_action' || tool.name !== 'finish').map(tool => tool.name), selected_tools: calls.map(call => call.name), host_accepted: false, rejection_reason: status })
        break
      }
      const call = calls[0]!
      const revisionBefore = revision, sourceBefore = sha256(source), toolStarted = new Date().toISOString()
      let observation: Record<string, unknown>, rejected = false
      let finished = false, hostFailure: unknown
      let toolVerification: ReturnType<typeof verificationEvidence> | null = null
      try {
        if (!autoTools(auto.registry, input.pending_verification === true).some(tool => tool.name === call.name) ||
          requestInput.repair_control?.mode === 'forced_action' && call.name === 'finish') throw new Error('UNKNOWN_TOOL')
        const action = parseAutoAction(call.name, call.arguments)
        if (action.name === 'edit_dut') {
          if (pending || action.expected_revision_id !== revision || repairs >= config.maxRepairRounds) throw new Error('REVISION_OR_BUDGET_REJECTED')
          checkAutoSource(action.source, task.interface)
          if (action.source === source) throw new Error('REPEATED_CANDIDATE')
          if (rejectedRevisions.some(item => item.source_sha256 === sha256(action.source))) throw new Error('REJECTED_REVISION')
          const previousSourceSha256 = sha256(source)
          if (!ledger.some(entry => entry.revision_id === revision)) ledger = [...ledger, ledgerEntry(input)]
          source = action.source; revision = randomUUID(); repairs++; pending = true; await saveRevision()
          repairAttempts.push({ semantic_round: repairs, baseline_failed: baselineFailed,
            feedback: { revision_id: input.binding!.revision_id, source_sha256: input.binding!.source_sha256, verification_key: input.binding!.verification_key,
              evidence_kind: input.feedback!.evidence_kind, model_run: requests.at(-1)! },
            edit: { accepted: true, previous_source_sha256: previousSourceSha256, revision_id: revision, source_sha256: sha256(source), source_sha_changed: previousSourceSha256 !== sha256(source) },
            verification: null, valid: false, missing_steps: ['verify_rtl', 'persisted_vivado_result'] })
          observation = { revision_id: revision, source_sha256: sha256(source), verification_state: 'UNVERIFIED', test_suite_id: taskId }
        } else if (action.name === 'verify_rtl') {
          if (!pending || action.revision_id !== revision || action.test_suite_id !== taskId) throw new Error('VERIFICATION_REQUEST_REJECTED')
          observed = await verify('AGENT_TOOL')
          currentRun = runs.at(-1)!
          toolVerification = verificationEvidence(observed)
          const verificationRun = runs.at(-1)!, attempt = repairAttempts.find(value => value.edit.revision_id === revision)
          if (!attempt) throw new Error('REPAIR_ATTEMPT_BINDING_MISSING')
          const resultSha256 = sha256(await readFile(join(verificationRun, 'result.json')))
          attempt.verification = { accepted: true, revision_id: revision, verification_run: verificationRun, result_sha256: resultSha256, status: observed.record.final_status, persisted: true }
          attempt.missing_steps = [
            ...(attempt.baseline_failed ? [] : ['baseline_failed']),
            ...(attempt.feedback.evidence_kind === 'live_verification' && attempt.feedback.source_sha256 === attempt.edit.previous_source_sha256 ? [] : ['bound_feedback']),
            ...(attempt.edit.source_sha_changed ? [] : ['source_sha_changed']),
            ...(attempt.verification.revision_id === attempt.edit.revision_id ? [] : ['verify_new_revision']),
          ]
          attempt.valid = attempt.missing_steps.length === 0
          observation = { revision_id: revision, status: observed.record.final_status, stages: observed.receipt.stages.map(s => ({ stage: s.stage, status: s.status, verdict: s.verdict })) }
          const score = revisionScore(observed.receipt, observed.record.final_verified), decision = compareRevision(best.score, score)
          const candidate = { revision_id: revision, source_sha256: sha256(source), score, verification_run: currentRun }
          ledger.push(ledgerEntry({ ...input, current: { revision_id: revision, source_sha256: sha256(source), source },
            binding: { revision_id: revision, source_sha256: sha256(source), verification_key: observed.record.verification_key! }, feedback: observed.receipt }))
          if (decision === 'IMPROVED') best = { revision, source, observed, run: currentRun, score }
          else {
            if (decision !== 'INCOMPARABLE') rejectedRevisions.push({ revision_id: revision, source_sha256: sha256(source), reason: decision,
              checks: score?.checks ?? null, mismatches: score?.mismatches ?? null })
            // Keep the failed attempt and receipt immutable; restore the incumbent's complete binding.
            revision = best.revision; source = best.source; observed = best.observed; currentRun = best.run
            observation.restored_revision = { revision_id: revision, source_sha256: sha256(source), verification_run: currentRun, score: best.score }
            if (decision === 'INCOMPARABLE') { status = 'INCOMPARABLE_VERIFICATION'; finished = true }
          }
          const revisionDecision = { decision, candidate, best_revision_id: best.revision, best_source_sha256: sha256(best.source), best_score: best.score,
            rolled_back: decision !== 'IMPROVED' }
          revisionDecisions.push(revisionDecision); observation.revision_decision = revisionDecision
          await appendToolTrace(target, { event: 'revision_decision', ...revisionDecision })
        } else if (action.name === 'read_current_rtl') observation = { ...input.current, pending_verification: pending }
        else if (action.name === 'retrieve_skill') observation = await retrieveP09Skills(p09, input.feedback)
        else { status = 'FINISHED_UNVERIFIED'; finished = true; observation = { status } }
      } catch (error) {
        if (call.name === 'verify_rtl' && (error as Error).message !== 'VERIFICATION_REQUEST_REJECTED') hostFailure = error
        rejected = true; observation = { error: error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'INVALID_ACTION' }
      }
      actions.push({ tool_call_id: call.id, tool: call.name, accepted: !rejected, observation, model_run: requests.at(-1), revision })
      await publish(target, `action-${actions.length}.json`, JSON.stringify(actions.at(-1), null, 2))
      await appendToolTrace(target, { event: 'agent_tool', turn_id: logicalAgentRequests, model_run_id: requests.at(-1),
        agent_state: input.pending_verification ? 'PENDING_VERIFICATION' : 'VERIFIED_FAILURE', available_tools: autoTools(auto.registry, input.pending_verification === true).filter(tool => requestInput.repair_control?.mode !== 'forced_action' || tool.name !== 'finish').map(tool => tool.name),
        selected_tool: call.name, tool_call_id: call.id, arguments_sha256: sha256(call.arguments), host_accepted: !rejected,
        rejection_reason: rejected ? observation.error : null, revision_before: revisionBefore, revision_after: revision,
        source_sha_changed: sourceBefore !== sha256(source), tool_started: toolStarted, tool_finished: new Date().toISOString(),
        tool_result: observation, verification: toolVerification })
      if (hostFailure) throw hostFailure
      if (finished) break
      history = [response.message, createToolResultMessage({ callId: call.id, content: [{ type: 'text', text: JSON.stringify(observation) }], isError: rejected })]
      if (!pending && observed.record.final_verified) { status = 'VERIFIED'; break }
    }
    if (pending) {
      revisionDecisions.push({ decision: 'UNVERIFIED_TERMINAL_RESTORE', candidate_revision_id: revision, best_revision_id: best.revision, rolled_back: true })
      revision = best.revision; source = best.source; observed = best.observed; currentRun = best.run; pending = false
    }
    await publish(target, 'best-observed.sv', best.source)
    if (status === 'VERIFIED') {
      if (pending || !observed.record.final_verified || observed.record.final_source_sha256 !== sha256(source)) throw new Error('EXPORT_BINDING_INVALID')
      await publish(target, 'final.sv', source)
      result.final_exported_sha256 = sha256(await readFile(join(target, 'final.sv')))
    }
    result = { ...result, status, terminal_reason: status, semantic_repairs: repairs, logical_agent_requests: logicalAgentRequests,
      agent_incremental_model_requests: dispatches, model_call_attempts: requests.length,
      baseline_failed: baselineFailed, repair_eligible: repairEligible, repair_requested: repairRequested, bound_feedback_dispatches: boundFeedbackDispatches,
      edit_accepted: repairAttempts.length > 0, reverified: repairAttempts.some(value => value.verification !== null),
      valid_repair_attempts: repairAttempts.filter(value => value.valid).length,
      recovered_by_agent: baselineFailed && status === 'VERIFIED', current_source_sha256: sha256(source),
      best_revision_id: best.revision, best_source_sha256: sha256(best.source), best_score: best.score, rejected_revisions: rejectedRevisions,
      verified_source_sha256: !pending && observed.record.final_verified ? observed.record.final_source_sha256 : null,
      verification_key: !pending ? observed.record.verification_key : null, final_verification_run: !pending ? currentRun : null }
    await assertFreeze()
  } catch (error) {
    if (caller.aborted) result.status = 'CANCELLED'
    else if (active.signal.aborted) { result.status = 'TIMEOUT'; result.timeout_scope = 'active' }
    else result.status = error instanceof OutputError ? error.category : error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'HOST_FAILURE'
  } finally {
    clearTimeout(timer); await runner?.close()
    result.physical_dispatches = dispatches
    result.transport_retries = transportRetries
    result.output_recovery_attempts = outputRecoveryAttempts
    result.prompt_tokens = promptTokens
    result.completion_tokens = completionTokens
    result.unknown_usage_requests = unknownUsageRequests
    result.model_wall_ms = modelWallMs
    result.terminal_reason ??= result.status
    const bytes = JSON.stringify(result, null, 2)
    try {
      if (command === 'generate') {
        await publish(target, `result-window-${result.generation_resumes}.json`, bytes)
        if (resuming) {
          await publish(target, 'result-next.json', bytes)
          await rename(join(target, 'result-next.json'), join(target, 'result.json'))
        } else await publish(target, 'result.json', bytes)
      } else await publish(target, 'result.json', bytes)
    } finally { if (generationLock) { await generationLock.close(); await unlink(join(target, 'generation.lock')) } }
    process.stdout.write(JSON.stringify(result) + '\n')
  }
}
