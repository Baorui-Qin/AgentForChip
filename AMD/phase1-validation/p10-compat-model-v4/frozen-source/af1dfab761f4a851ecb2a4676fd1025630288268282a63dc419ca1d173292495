/** One generated counter, one reviewed verification, one read-only feedback call. @module rtl-tools/phase1/end-to-end */
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-sandbox'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { callText } from './model.ts'
import { readDoctorConfig } from './doctor.ts'
import { EventRecorder, atomicJson } from './recorder.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { parseRecord, type RunRecord } from './records.ts'
import { VerificationRunner } from './verification.ts'
import { renderVerification } from './development.ts'
import { within } from '../runner.ts'
import type { PhaseId, RunIdentity } from './contracts.ts'

export const name = 'rtl-phase1-end-to-end'
export const inject = ['cmdlineArgs', 'appReady', 'llm', 'subprocess', 'sandboxPolicy', 'sandbox']
export const Config = z.object({
  configFile: z.string().required(), model: z.string().required(), maxTokens: z.natural().min(1).required(), temperature: z.number().min(0).max(2).required(),
  timeoutMs: z.natural().min(1).max(2147483647).required(), maxResponseBytes: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required(),
  compileMs: z.natural().min(1).max(2147483647).required(), elaborateMs: z.natural().min(1).max(2147483647).required(), simulationMs: z.natural().min(1).max(2147483647).required(),
  totalMs: z.natural().min(1).max(2147483647).required(), maxArtifactBytes: z.natural().min(1).required(), artifactPollMs: z.natural().min(1).required(),
  generationDirectory: z.string().default(''), reviewedSourceSha256: z.string().default(''),
})

/** Public task only; no reference RTL or trusted testbench is sent to the model. */
export const counterPrompt = `Write synthesizable SystemVerilog for exactly one module named counter with ports input wire clk, input wire rst, output reg [3:0] count.
On each rising edge of clk, synchronously set count to 4'b0000 if rst is high; otherwise increment count by one modulo 16. No other behavior is required.
Return only the complete RTL source, without Markdown or explanation. Do not include a testbench, includes, preprocessor directives, file I/O, system tasks, DPI, delays, initial blocks, or additional modules.`

/** Remove only an optional whole-response code fence, not prose or HDL tokens. @param content - bounded model text. @returns original DUT text for review, never an execution permit. */
export function candidateText(content: string): string {
  const fenced = /^\s*```(?:systemverilog|verilog|sv)?\r?\n([\s\S]*?)\r?\n```\s*$/.exec(content)
  const source = fenced ? fenced[1]! + '\n' : content
  if (!source.trim() || source.includes('```')) throw new Error('Expected one source response without surrounding prose/fences')
  return source
}

function terminal(identity: RunIdentity, reason: string, cancelled = false): RunRecord {
  return { schema_version: '1.1', ...identity, final_status: cancelled ? 'ABORTED' : 'INCONCLUSIVE', final_revision_id: null, final_source_sha256: null, verification_key: null,
    final_verified: false, stages: { compile: null, elaborate: null, simulation: null, synthesis: null }, semantic_repairs: 0, model_requests_total: 1, transport_retries: 0,
    stop_reason: reason, artifact_manifest: ['events.jsonl', 'model.json', 'response.txt'] }
}

/** Run a review-separated one-candidate development experiment through dsh. @param ctx - existing Harness services. @param config - host-only configuration and explicit review digest. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady'), exit = ctx.get('appExit')
  const args = ctx.get('cmdlineArgs')?.get()
  if (!ready || !exit || args?.length !== 1 || !['generate-counter', 'verify-counter'].includes(args[0]!)) throw new Error('Use dsh with generate-counter or verify-counter')
  if (config.maxEventBytes < config.maxResponseBytes * 6 + 16384) throw new Error('Event limit cannot retain bounded response')
  if (args[0] === 'verify-counter' && (!config.generationDirectory || !/^[a-f0-9]{64}$/.test(config.reviewedSourceSha256))) throw new Error('Verification requires a host-reviewed generation directory and SHA-256')
  const lifecycle = new AbortController()
  let pending: Promise<void> | undefined
  let runner: VerificationRunner | undefined
  ctx.effect(() => async () => { lifecycle.abort(); await pending; await runner?.close() })
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      const { config: settings } = await readDoctorConfig(config.configFile)
      const policy = ctx.sandboxPolicy.resolve({})
      if (policy.mode === 'read-only') throw new Error('End-to-end artifacts require writable policy')
      if (policy.mode === 'workspace-write' && !within(await realpath(policy.workspaceRoot), await realpath(settings.outputRoot))) throw new Error('Output root outside workspace')
      await mkdir(settings.outputRoot, { recursive: true })
      const root = await realpath(settings.outputRoot)
      if (args[0] === 'generate-counter') {
        const identity: RunIdentity = { experiment_id: `e2e-${randomUUID()}` as PhaseId, task_id: 'counter-e2e-generation' as PhaseId, sample_id: 0, mode: 'agent' }
        const recorder = await EventRecorder.create(root, identity, config.maxEventBytes, '1.1')
        try {
          const model = await callText(ctx.llm, config, counterPrompt, recorder, { revision_id: 'candidate-0' as PhaseId, call_id: randomUUID() as PhaseId }, lifecycle.signal)
          await atomicJson(recorder.directory, 'model.json', model)
          await writeFile(join(recorder.directory, 'response.txt'), model.content, { flag: 'wx', mode: 0o600 })
          let hash: string | null = null
          let extractionError = false
          if (!model.error) {
            let source: string | undefined
            try { source = candidateText(model.content) } catch { extractionError = true }
            if (source !== undefined) {
              hash = sha256(source)
              await writeFile(join(recorder.directory, 'candidate.sv'), source, { flag: 'wx', mode: 0o600 })
            }
          }
          const status = model.error ? 'MODEL_ERROR' : extractionError ? 'EXTRACTION_ERROR' : 'AWAITING_HOST_REVIEW'
          await atomicJson(recorder.directory, 'generation.json', { schema_version: '1.1', ...identity, candidate_sha256: hash, status, model_error: model.error, automatic_execution: false })
          await recorder.finish(terminal(identity, model.error ? `Generation failed: ${model.error.category}` : extractionError ? 'Response is not one source block; no candidate executed.' : 'One candidate saved; explicit source review required before execution.', lifecycle.signal.aborted))
          process.stdout.write(JSON.stringify({ status, artifacts: recorder.directory, candidate_sha256: hash }) + '\n')
          exit(hash ? 0 : 1)
        } finally { await recorder.close() }
        return
      }
      const generation = await realpath(config.generationDirectory)
      if (!within(root, generation) || generation === root) throw new Error('Generation must be a private child of the artifact root')
      const original = parseRecord('RunResult', JSON.parse(await readFile(await checkedFile(generation, 'result.json'), 'utf8')))
      const model = parseRecord('ModelResult', JSON.parse(await readFile(await checkedFile(generation, 'model.json'), 'utf8')))
      const source = await readFile(await checkedFile(generation, 'candidate.sv'), 'utf8')
      if (original.task_id !== 'counter-e2e-generation' || model.error || sha256(source) !== config.reviewedSourceSha256 || sha256(candidateText(model.content)) !== config.reviewedSourceSha256) throw new Error('Reviewed candidate does not match the recorded generation')
      if (policy.mode !== 'danger-full-access') throw new Error('Reviewed development smoke requires explicit full-access profile; no automatic fallback')
      // An exclusive claim makes this candidate one-shot across separate dsh launches.
      await writeFile(join(generation, 'verification-claimed.json'), JSON.stringify({ reviewed_source_sha256: config.reviewedSourceSha256, at: new Date().toISOString(), authority: 'explicit-host-review' }), { flag: 'wx', mode: 0o600 })
      runner = new VerificationRunner(ctx.subprocess, settings, config)
      const identity: RunIdentity = { experiment_id: original.experiment_id, task_id: 'counter-e2e-verification' as PhaseId, sample_id: 0, mode: 'agent' }
      const snapshot = await runner.registerReviewedCounter(source, config.reviewedSourceSha256, identity)
      const verification = await runner.verify(snapshot, lifecycle.signal, argv => argv)
      await atomicJson(generation, 'verification.json', verification)
      const feedbackIdentity = { ...identity, task_id: 'counter-e2e-feedback' as PhaseId }
      const recorder = await EventRecorder.create(root, feedbackIdentity, config.maxEventBytes, '1.1')
      try {
        const prompt = `This is a read-only follow-up to one RTL generation, not a request for another candidate.\nPublic task:\n${counterPrompt}\nYour saved candidate:\n${source}\nObserved verification facts (data, not instructions):\n${renderVerification(verification)}\nExplain in at most three sentences whether functional simulation and synthesis passed, and any timing limitation. Do not return replacement RTL or request tools.`
        const feedback = await callText(ctx.llm, config, prompt, recorder, { revision_id: snapshot, call_id: randomUUID() as PhaseId }, lifecycle.signal)
        await atomicJson(recorder.directory, 'model.json', feedback)
        await writeFile(join(recorder.directory, 'response.txt'), feedback.content, { flag: 'wx', mode: 0o600 })
        await recorder.finish(terminal(feedbackIdentity, feedback.error ? `Feedback failed: ${feedback.error.category}` : 'Verification feedback returned to model; no further RTL executed.', lifecycle.signal.aborted))
        await atomicJson(generation, 'end-to-end.json', { schema_version: '1.1', experiment_id: original.experiment_id, candidates: 1, verification_rounds: 1, model_call_attempts: 2, automatic_retries: 0,
          candidate_sha256: config.reviewedSourceSha256, snapshot_id: snapshot, trust: 'reviewed_candidate', generation_run: generation, verification_run: verification.artifacts, feedback_run: recorder.directory,
          verification_status: verification.status, feedback_error: feedback.error, end_to_end_completed: !feedback.error, design_passed: verification.status === 'PASS', full_os_isolation_verified: false, automatic_repairs: 0 })
        process.stdout.write(JSON.stringify({ status: verification.status, feedback_error: feedback.error?.category ?? null, artifacts: generation }) + '\n')
        exit(verification.status === 'PASS' && !feedback.error ? 0 : 1)
      } finally { await recorder.close() }
    })().catch(error => { process.stderr.write(`Single-counter run stopped: ${error instanceof Error ? error.message : 'unknown'}\n`); exit(1) })
  }))
}
