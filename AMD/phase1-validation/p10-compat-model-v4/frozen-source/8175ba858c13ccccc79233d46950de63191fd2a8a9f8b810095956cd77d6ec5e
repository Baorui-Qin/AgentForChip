/** P10 shared-seed comparison and separate repair calibration through existing P09 services. @module rtl-tools/phase1/p10-model */
import { mkdir, readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { createToolResultMessage, type Message } from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-subprocess'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { publish, extractSource } from './candidates.ts'
import { sha256 } from './snapshots.ts'
import { loadCompatAssets, negativeControl } from './p10-compat.ts'
import type { P10Task } from './p10-dataset.ts'
import { callText, type ModelSettings } from './model.ts'
import { EventRecorder } from './recorder.ts'
import { buildContext, ledgerEntry, type ContextInput, type RepairLedgerEntry } from './p09-context.ts'
import { textWire } from './p09-tokenizer.ts'
import { callAction, checkCounterRuntime, countActionWire, type AutoSettings } from './p09-action-call.ts'
import { loadP09Skills, readP09Settings, retrieveP09Skills } from './p09-proposal.ts'
import { reserveDispatch } from './p09-claims.ts'
import { checkAutoSource, parseAutoAction } from './p09-auto-policy.ts'
import { readDiagnostics } from './repair-diagnostics.ts'
import { decideRepair } from './repair-policy.ts'
import { readDoctorConfig } from './doctor.ts'
import { VerificationRunner, type VerificationLimits } from './verification.ts'
import type { PhaseId } from './contracts.ts'

export const name = 'rtl-p10-model'
export const inject = ['cmdlineArgs', 'appReady', 'llm', 'subprocess', 'sandboxPolicy']
export const Config = z.object({ campaignRoot: z.string().required(), preflightRoot: z.string().required(), datasetRoot: z.string().required(),
  settingsFile: z.string().required(), p09File: z.string().required(), autoFile: z.string().required(), freezeFile: z.string().required(),
  allowUnisolatedAutomatic: z.boolean().default(false), model: z.string().required(), maxTokens: z.natural().required(), temperature: z.number().required(),
  timeoutMs: z.natural().min(1).required(), activeMs: z.natural().min(1).max(1200000).required(), maxResponseBytes: z.natural().required(),
  compileMs: z.natural().min(1).required(), elaborateMs: z.natural().min(1).required(), simulationMs: z.natural().min(1).required(),
  totalMs: z.natural().min(1).required(), maxArtifactBytes: z.natural().min(1).required(), artifactPollMs: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required() })

/** Explicit commands separate one-shot generation, scored comparison, and faulty-seed repair calibration. @param ctx - provider and Host services. @param config - frozen deployment. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const args = ctx.cmdlineArgs!.get()
  if (!['generate', 'compare', 'repair-control'].includes(args[0] ?? '') || args.length !== 2) throw new Error('Use generate|compare|repair-control <task-id>')
  const controller = new AbortController(); let pending: Promise<void> | undefined
  ctx.effect(() => async () => { controller.abort(); await pending })
  ctx.effect(() => ctx.get('appReady')!.onReady(() => {
    pending = run(ctx, config, args[0]!, args[1]!, controller.signal).then(() => ctx.get('appExit')!(0)).catch(error => {
      process.stderr.write((error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'P10_MODEL_HOST_FAILURE') + '\n'); ctx.get('appExit')!(1)
    })
  }))
}

async function run(ctx: Context, config: ReturnType<typeof Config>, command: string, taskId: string, caller: AbortSignal) {
  if (!config.allowUnisolatedAutomatic || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('P10_EXPLICIT_MODEL_AUTHORITY_REQUIRED')
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
  if (!task?.interface || !(command === 'repair-control' ? taskId === 'Prob038_count15' || order.slice(0, 10).includes(taskId) : order.slice(0, 10).includes(taskId))) throw new Error('TASK_NOT_FROZEN')
  if (!calibrations.find(r => r.task_id === taskId)?.evaluable) throw new Error('EVALUATOR_NOT_CALIBRATED')
  const policy = JSON.parse(await readFile(join(preflight, 'evaluator-policy.json'), 'utf8'))
  const p09 = await readP09Settings(config.p09File), auto = JSON.parse(await readFile(config.autoFile, 'utf8')) as AutoSettings
  if (auto.campaignRoot !== root.replace(/\\/g, '/') && auto.campaignRoot !== root) throw new Error('CAMPAIGN_ROOT_MISMATCH')
  const counterRuntime = await checkCounterRuntime(auto)
  await loadP09Skills(p09)
  const target = join(root, `${command}-${taskId}`); await mkdir(target)
  await mkdir(join(target, 'models')); await mkdir(join(target, 'eda')); await mkdir(join(target, 'revisions'))
  const experiment = randomUUID() as PhaseId
  const model: ModelSettings = { model: config.model, maxTokens: config.maxTokens, temperature: config.temperature, timeoutMs: config.timeoutMs, maxResponseBytes: config.maxResponseBytes }
  const publicTask = { id: taskId, spec: task.spec, interface: task.interface, constraints: 'SystemVerilog, single self-contained TopModule DUT; xczu3eg-sbva484-1-e; 5 ns synthesis clock; simulator seed 1. No reference dependencies, hierarchy outside the DUT, file access, includes or DPI.' }
  const active = new AbortController(), timer = setTimeout(() => active.abort(), config.activeMs)
  const signal = AbortSignal.any([caller, active.signal])
  let runner: VerificationRunner | undefined
  const requests: string[] = [], actions: unknown[] = [], revisions: unknown[] = [], runs: string[] = []
  let dispatches = 0
  let result: Record<string, unknown> = { task_id: taskId, command, experiment_id: experiment, status: 'INCONCLUSIVE', full_os_isolation_verified: false,
    shared_initial: command === 'compare', counted_in_model_score: command === 'compare', model_runs: requests, actions, revisions, verification_runs: runs }
  try {
    if (command === 'generate') {
      const recorder = await EventRecorder.create(join(target, 'models'), { experiment_id: experiment, task_id: taskId as PhaseId, sample_id: 0, mode: 'baseline' }, config.maxEventBytes, '1.3')
      requests.push(recorder.directory)
      try {
        const input: ContextInput = { task: publicTask, sample_id: experiment, variant_id: 'A', current: null, binding: null, feedback: null, ledger: [], purpose: 'generation' }
        const response = await callText(ctx.llm, model, '', recorder, { call_id: randomUUID() as PhaseId, revision_id: null }, signal, undefined, async (prepared, signal) => {
          if (prepared.retryPolicy.mode !== 'normal' || prepared.retryPolicy.maxRetries !== 0) throw new Error('LOWER_LEVEL_RETRY_ENABLED')
          if (!prepared.context?.contextWindow || prepared.config.maxTokens !== p09.limits.output) throw new Error('CONTEXT_CONFIGURATION_ERROR')
          await publish(target, 'resolved-model.json', JSON.stringify({ config: prepared.config, defaults: prepared.adapterDefaults, context: prepared.context }))
          let seq = 0
          const built = await buildContext(input, { ...p09.limits, window: Math.min(p09.limits.window, prepared.context.contextWindow) }, {
            quality: 'exact_local', identity: { implementation: 'official-rust-deepseek-recipe', revision: counterRuntime.revision, manifest_sha256: auto.runtimeManifestSha256, cloud_equivalence: 'unconfirmed' },
            count: (view, signal) => countActionWire(counterRuntime, auto, ctx.subprocess, join(recorder.directory, 'token-' + ++seq), textWire(prepared, view), signal),
          }, signal)
          const wire = textWire(prepared, built)
          await publish(recorder.directory, 'context-audit.json', JSON.stringify(built.audit, null, 2))
          await publish(recorder.directory, 'prompt-final.json', JSON.stringify(wire, null, 2))
          const ticket = await reserveDispatch(root, auto.bucket, { experiment, purpose: 'shared_initial', request_sha256: sha256(JSON.stringify(wire)) }, signal)
          await publish(recorder.directory, 'dispatch.json', JSON.stringify({ ticket }))
          dispatches++
          return built
        })
        await publish(recorder.directory, 'model.json', JSON.stringify(response, null, 2))
        await publish(recorder.directory, 'response.txt', response.content)
        if (response.error) { result.status = 'MODEL_RESPONSE_ERROR'; result.error = response.error; return }
        const extracted = extractSource(response.content, response.truncated, config.maxResponseBytes, task.interface)
        checkAutoSource(extracted.source, task.interface)
        await publish(target, 'initial.sv', extracted.source)
        result = { ...result, status: 'GENERATED_UNVERIFIED', source_sha256: extracted.source_sha256, model_requests: 1, feedback_exposed: false, tools_exposed: false, skills_exposed: false }
      } finally { await recorder.close() }
      return
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
      result.initial_generation_physical_requests = 1; result.initial_generation_charged_again = false
    } else { source = negativeControl(task); result.control_seed = 'reviewed_negative_copy_not_baseline'; result.shared_initial = false }
    let revision = randomUUID(), pending = false, repairs = 0, history: Message[] = [], ledger: RepairLedgerEntry[] = []
    let facts: Awaited<ReturnType<typeof readDiagnostics>> | null = null
    async function saveRevision() {
      const directory = join(target, 'revisions', revision); await mkdir(directory)
      await publish(directory, 'solution.sv', source)
      revisions.push({ revision, sha256: sha256(source), directory })
    }
    async function verify() {
      await assertFreeze(); checkAutoSource(source, task!.interface!)
      const { assets, evaluation } = await loadCompatAssets(config.datasetRoot, task!, join(preflight, 'derived'), policy.defaultTimescale ?? undefined)
      assets['rtl/solution.sv'] = source
      const snapshot = await runner!.registerDataset(assets, evaluation, { experiment_id: experiment, task_id: taskId as PhaseId, sample_id: runs.length, mode: command === 'compare' && runs.length === 0 ? 'baseline' : 'agent' })
      const outcome = await runner!.verify(snapshot, signal, argv => argv); runs.push(outcome.artifacts)
      facts = await readDiagnostics(outcome.artifacts, 'live_verification')
      if (facts.record.final_source_sha256 !== sha256(source)) throw new Error('VERIFICATION_BINDING_INVALID')
      pending = false
      process.stdout.write(JSON.stringify({ task_id: taskId, command, verification: outcome.status, revision, run: outcome.artifacts }) + '\n')
      return facts
    }
    await saveRevision()
    let observed = await verify()
    result.initial_status = observed.record.final_status; result.baseline_run = command === 'compare' ? runs[0] : null
    if (command === 'repair-control' && !observed.receipt.stages.some(s => s.functional_failure)) throw new Error('NEGATIVE_CONTROL_NOT_OBSERVED')
    let status = 'MODEL_REQUEST_BUDGET_EXHAUSTED'
    while (requests.length < p09.maxRequests - (command === 'compare' ? 1 : 0) && actions.length < auto.maxToolSteps) {
      if (!pending) {
        const decision = decideRepair(observed.receipt, { calibrated: true, bound: true, attempts: repairs, maxAttempts: 3, top: 'TopModule' })
        if (decision.rule === 'VERIFIED' && observed.record.final_verified) { status = 'VERIFIED'; break }
        if (decision.action !== 'propose_repair') { status = decision.rule; break }
      }
      const input: ContextInput = { task: publicTask, sample_id: experiment, variant_id: p09.variant,
        current: { revision_id: revision, source_sha256: sha256(source), source },
        binding: pending ? null : { revision_id: revision, source_sha256: sha256(source), verification_key: observed.record.verification_key! },
        feedback: pending ? null : observed.receipt, ledger, purpose: 'repair', tool_mode: true, pending_verification: pending }
      await assertFreeze()
      const response = await callAction({ root: target, experiment, sequence: requests.length + 1, input, history, auto, p09, model,
        runtime: ctx.llm, subprocess: ctx.subprocess, maxEventBytes: config.maxEventBytes, signal, loadSkills: () => loadP09Skills(p09), expectedRequestHash: null,
        claim: async directory => { requests.push(directory) } })
      if (response.dispatched) dispatches++
      if (response.error_code || !response.message) { status = response.error_code ?? 'MODEL_RESPONSE_ERROR'; break }
      const calls = response.message.content.filter(b => b.type === 'tool-call')
      if (calls.length !== 1) { status = 'INVALID_MODEL_ACTION'; break }
      const call = calls[0]!
      let observation: Record<string, unknown>, rejected = false
      try {
        const action = parseAutoAction(call.name, call.arguments)
        if (action.name === 'edit_dut') {
          if (pending || action.expected_revision_id !== revision || repairs >= 3) throw new Error('REVISION_OR_BUDGET_REJECTED')
          checkAutoSource(action.source, task.interface)
          if (action.source === source) throw new Error('REPEATED_CANDIDATE')
          ledger = [...ledger, ledgerEntry(input)].slice(-2)
          source = action.source; revision = randomUUID(); repairs++; pending = true; await saveRevision()
          observation = { revision_id: revision, source_sha256: sha256(source), verification_state: 'UNVERIFIED', test_suite_id: taskId }
        } else if (action.name === 'verify_rtl') {
          if (!pending || action.revision_id !== revision || action.test_suite_id !== taskId) throw new Error('VERIFICATION_REQUEST_REJECTED')
          observed = await verify()
          observation = { revision_id: revision, status: observed.record.final_status, stages: observed.receipt.stages.map(s => ({ stage: s.stage, status: s.status, verdict: s.verdict })) }
        } else if (action.name === 'read_current_rtl') observation = { ...input.current, pending_verification: pending }
        else if (action.name === 'retrieve_skill') observation = await retrieveP09Skills(p09, input.feedback)
        else { status = 'FINISHED_UNVERIFIED'; break }
      } catch (error) {
        if (call.name === 'verify_rtl' && (error as Error).message !== 'VERIFICATION_REQUEST_REJECTED') throw error
        rejected = true; observation = { error: error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'INVALID_ACTION' }
      }
      actions.push({ tool_call_id: call.id, tool: call.name, accepted: !rejected, observation, model_run: requests.at(-1), revision })
      await publish(target, `action-${actions.length}.json`, JSON.stringify(actions.at(-1), null, 2))
      history = [response.message, createToolResultMessage({ callId: call.id, content: [{ type: 'text', text: JSON.stringify(observation) }], isError: rejected })]
      if (!pending && observed.record.final_verified) { status = 'VERIFIED'; break }
    }
    if (status === 'VERIFIED') {
      if (pending || !observed.record.final_verified || observed.record.final_source_sha256 !== sha256(source)) throw new Error('EXPORT_BINDING_INVALID')
      await publish(target, 'final.sv', source)
      result.final_exported_sha256 = sha256(await readFile(join(target, 'final.sv')))
    }
    result = { ...result, status, semantic_repairs: repairs, agent_incremental_model_requests: dispatches, model_call_attempts: requests.length, current_source_sha256: sha256(source),
      verified_source_sha256: !pending && observed.record.final_verified ? observed.record.final_source_sha256 : null,
      verification_key: !pending ? observed.record.verification_key : null, final_verification_run: !pending ? runs.at(-1) : null }
    await assertFreeze()
  } catch (error) {
    result.status = signal.aborted ? 'CANCELLED_OR_ACTIVE_TIMEOUT' : error instanceof Error && /^[A-Z_]+$/.test(error.message) ? error.message : 'HOST_FAILURE'
  } finally {
    clearTimeout(timer); await runner?.close()
    result.physical_dispatches = dispatches
    await publish(target, 'result.json', JSON.stringify(result, null, 2))
    process.stdout.write(JSON.stringify(result) + '\n')
  }
}
