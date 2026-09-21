/** dsh commands for host-reviewed repair and non-executing diagnostic replay. @module rtl-tools/phase1/repair */
import { mkdir, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { readDoctorConfig } from './doctor.ts'
import { readDiagnostics } from './repair-diagnostics.ts'
import { RepairWorkflow, repairFixtures } from './repair-workflow.ts'
import { publish } from './candidates.ts'
import { within } from '../runner.ts'
import { readP09Settings } from './p09-proposal.ts'
import { taskIds, type TaskId } from './p09-tasks.ts'
import { freezeP09, reportP09 } from './p09-report.ts'

export const name = 'rtl-repair'
export const inject = ['cmdlineArgs', 'appReady', 'llm', 'subprocess', 'sandboxPolicy']
export const Config = z.object({
  configFile: z.string().required(), allowReviewedFullAccess: z.boolean().default(false), replayRun: z.string().default(''),
  p09ConfigFile: z.string().default(''),
  model: z.string().required(), maxTokens: z.natural().min(1).required(), temperature: z.number().min(0).max(2).required(), timeoutMs: z.natural().min(1).required(),
  maxResponseBytes: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required(), activeMs: z.natural().min(1).required(),
  compileMs: z.natural().min(1).required(), elaborateMs: z.natural().min(1).required(), simulationMs: z.natural().min(1).required(), totalMs: z.natural().min(1).required(),
  maxArtifactBytes: z.natural().min(1).required(), artifactPollMs: z.natural().min(1).required(),
  finiteLoop: z.boolean().default(false), maxSemanticRepairs: z.natural().min(1).max(3).default(3),
  maxTransportRetries: z.natural().max(2).default(2), transportBackoffMs: z.array(z.natural().max(60000)).default([1000, 2000]),
  maxRepeatedDiagnostic: z.natural().min(2).default(3),
})
/** No model tool exposes these commands. @param ctx - existing services. @param config - host configuration. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const args = ctx.cmdlineArgs!.get(), ready = ctx.get('appReady')!, exit = ctx.get('appExit')!
  if (!args?.length || !['start', 'resume', 'approve', 'reject', 'status', 'replay', 'calibrate', 'freeze', 'report'].includes(args[0]!)) throw new Error('Expected repair command')
  if (config.maxEventBytes < config.maxResponseBytes * 6 + 16384) throw new Error('Event limit cannot retain response')
  if (config.finiteLoop && config.transportBackoffMs.length !== config.maxTransportRetries) throw new Error('Backoff schedule must match retry budget')
  const controller = new AbortController()
  let pending: Promise<void> | undefined, workflow: RepairWorkflow | undefined
  ctx.effect(() => async () => { controller.abort(); await pending; await workflow?.close() })
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      const { config: eda } = await readDoctorConfig(config.configFile)
      const policy = ctx.sandboxPolicy.resolve({})
      if (args[0] !== 'status') {
        if (policy.mode === 'read-only') throw new Error('Writable artifacts required')
        if (policy.mode === 'workspace-write' && !within(await realpath(policy.workspaceRoot), await realpath(eda.outputRoot))) throw new Error('Artifact root outside workspace')
      }
      if (args[0] === 'replay') {
        if (args.length !== 1 || !config.replayRun) throw new Error('Replay requires profile-owned replayRun')
        const { receipt } = await readDiagnostics(config.replayRun, 'diagnostic_replay', eda.limits.maxLogBytes)
        const directory = join(await realpath(eda.outputRoot), 'replay-' + randomUUID()); await mkdir(directory)
        await publish(directory, 'diagnostic-replay.json', JSON.stringify(receipt, null, 2))
        process.stdout.write(JSON.stringify({ artifacts: directory, evidence_kind: receipt.evidence_kind }) + '\n'); exit(0); return
      }
      if (['start', 'resume', 'calibrate'].includes(args[0]!) && (!config.allowReviewedFullAccess || policy.mode !== 'danger-full-access')) throw new Error('Explicit reviewed authority required; no sandbox fallback')
      const p09 = config.p09ConfigFile ? await readP09Settings(config.p09ConfigFile) : undefined
      if (['freeze', 'report'].includes(args[0]!)) {
        if (!p09 || args.length !== 1) throw new Error('P09 profile required')
        const artifacts = args[0] === 'freeze' ? await freezeP09(eda.outputRoot) : await reportP09(eda.outputRoot)
        process.stdout.write(JSON.stringify({ artifacts, model_requests_total: 0 }) + '\n'); exit(0); return
      }
      workflow = new RepairWorkflow({ eda, model: { model: config.model, maxTokens: config.maxTokens, temperature: config.temperature, timeoutMs: config.timeoutMs, maxResponseBytes: config.maxResponseBytes },
        limits: { compileMs: config.compileMs, elaborateMs: config.elaborateMs, simulationMs: config.simulationMs, totalMs: config.totalMs, maxArtifactBytes: config.maxArtifactBytes, artifactPollMs: config.artifactPollMs, maxEventBytes: config.maxEventBytes }, activeMs: config.activeMs,
        ...(config.finiteLoop ? { loop: { maxSemanticRepairs: config.maxSemanticRepairs, maxTransportRetries: config.maxTransportRetries, transportBackoffMs: config.transportBackoffMs, maxRepeatedDiagnostic: config.maxRepeatedDiagnostic } } : {}),
        ...(p09 ? { p09 } : {}) }, ctx.subprocess, ctx.llm)
      let state
      if (args[0] === 'calibrate') {
        if (!p09 || args.length !== 2 || !taskIds.includes(args[1] as TaskId)) throw new Error('Unknown P09 task')
        state = await workflow.calibrateTask(args[1] as TaskId, controller.signal)
      } else if (args[0] === 'start') {
        if (args.length !== 2 || !(repairFixtures.includes(args[1] as typeof repairFixtures[number]) || p09 && taskIds.includes(args[1] as TaskId))) throw new Error('Unknown fixed fixture')
        state = await workflow.start(args[1] as typeof repairFixtures[number] | TaskId); state = await workflow.resume(state.experiment_id, controller.signal)
      } else if (args[0] === 'approve' || args[0] === 'reject') {
        if (args.length !== 3) throw new Error('Review requires id and source digest')
        state = await workflow.review(args[1]!, args[2]!, args[0] === 'approve')
      } else {
        if (args.length !== 2) throw new Error('Expected experiment id')
        state = args[0] === 'resume' ? await workflow.resume(args[1]!, controller.signal) : await workflow.status(args[1]!)
      }
      process.stdout.write(JSON.stringify({ ...state, artifacts: join(eda.outputRoot, 'repair-' + state.experiment_id) }) + '\n')
      exit(state.phase === 'TERMINAL' && !['VERIFIED', 'CALIBRATED'].includes(state.outcome ?? '') ? 1 : 0)
    })().catch(() => { process.stderr.write('Repair command refused or failed; inspect retained state. No automatic retry.\n'); exit(1) })
  }))
}
