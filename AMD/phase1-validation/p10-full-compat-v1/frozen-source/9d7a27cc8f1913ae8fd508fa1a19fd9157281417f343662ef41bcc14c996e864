/** Host Agent workflow and external evaluator; never used by the Baseline process. @module rtl-tools/phase1/comparison */
import { mkdir, readFile, readdir, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { recordValidator } from './record-validation.ts'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { VerificationRunner } from './verification.ts'
import { readDoctorConfig } from './doctor.ts'
import { renderVerification } from './development.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { candidateSchema, publish, readCandidate, type Candidate } from './candidates.ts'
import { evaluation, evaluatorAssets, variants, taskId, type Variant } from './protocol.ts'
import { event, generate, limits, loadExperiment, modelCall, evaluationHash } from './experiment.ts'
import { comparisonReport } from './comparison-report.ts'
import { parseRecord } from './records.ts'
import type { PhaseId } from './contracts.ts'

export const name = 'rtl-comparison'
export const inject = ['cmdlineArgs', 'appReady', 'llm', 'subprocess', 'sandboxPolicy']
export const Config = z.object({ outputRoot: z.string().required(), datasetRoot: z.string().required(), settingsFile: z.string().required(), allowReviewedFullAccess: z.boolean().default(false) })
/** An approval is host data bound to every candidate identity field. */
export const approvalSchema = recordValidator<Candidate & { approved: boolean; reviewed_at: string; note: string }>({ ...candidateSchema.properties, approved: { type: 'boolean' }, reviewed_at: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}T' }, note: { type: 'string', maxLength: 2000 } })
/** Check approval and recorded generation without accepting paths from model output. @param dir - private route. @param id - experiment. @param variant - route. @param evaluationSha - trusted profile digest. @returns candidate and decision. */
export async function reviewedCandidate(dir: string, id: string, variant: Variant, evaluationSha: string) {
  const approval = approvalSchema.parse(JSON.parse(await readFile(await checkedFile(await realpath(dir), 'approval.json'), 'utf8')))
  if (approval.experiment_id !== id || approval.variant_id !== variant || approval.evaluation_sha256 !== evaluationSha) throw new Error('Approval identity mismatch')
  const revision = await readCandidate(join(dir, 'revisions', approval.revision_id))
  for (const key of Object.keys(revision.candidate) as (keyof typeof revision.candidate)[]) if (revision.candidate[key] !== approval[key]) throw new Error('Approval candidate mismatch')
  const generated = JSON.parse(await readFile(await checkedFile(await realpath(dir), 'generation.json'), 'utf8'))
  if (generated.candidate?.candidate?.revision_id !== approval.revision_id || generated.model?.value?.error || sha256(generated.model.value.content) !== approval.response_sha256) throw new Error('Approval does not match generated response')
  return { ...revision, approval, generated }
}
/** Validate verified bytes before exclusive export; an interpretation never affects this decision. @param route - route directory. @param resultDir - verifier run. @param expected - candidate digest. @param assets - frozen evaluator bytes. @returns export facts. */
export async function exportVerified(route: string, resultDir: string, expected: string, assets: Record<string, string>) {
  const result = parseRecord('RunResult', JSON.parse(await readFile(await checkedFile(await realpath(resultDir), 'result.json'), 'utf8')))
  if (result.final_source_sha256 !== expected) throw new Error('Verification source mismatch')
  const snapshots = (await readdir(resultDir)).filter(name => name.startsWith('snapshot-'))
  if (snapshots.length !== 1) throw new Error('Expected unique verification snapshot')
  const snapshot = await realpath(join(resultDir, snapshots[0]!))
  for (const [path, bytes] of Object.entries(assets)) if (sha256(await readFile(await checkedFile(snapshot, path))) !== sha256(bytes)) throw new Error('Snapshot changed before export')
  const source = await readFile(await checkedFile(snapshot, 'rtl/solution.sv'), 'utf8')
  const output = join(route, 'output'); await mkdir(output)
  await publish(output, 'solution.sv', source)
  const receipt = { schema_version: '1.2', source_sha256: sha256(source), verification_key: result.verification_key, final_verified: result.final_verified, status: result.final_status }
  if (sha256(await readFile(await checkedFile(await realpath(output), 'solution.sv'))) !== expected) throw new Error('Export hash mismatch')
  await publish(route, 'export.json', JSON.stringify(receipt, null, 2) + '\n')
  return receipt
}

/** Run host-approved workflows only; the CLI exposes no shell, Tcl or source-list arguments. @param ctx - dsh services. @param config - trusted settings. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady')!, exit = ctx.get('appExit')!, args = ctx.cmdlineArgs!.get()
  const controller = new AbortController(); let pending: Promise<void> | undefined, runner: VerificationRunner | undefined
  ctx.effect(() => async () => { controller.abort(); await pending; await runner?.close() })
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      if (args[0] === 'generate' && args.length === 3 && (args[2] === 'agent_base' || args[2] === 'agent_domain')) {
        const result = await generate(ctx.llm, config, args[1]!, args[2], controller.signal)
        process.stdout.write(JSON.stringify({ variant: args[2], status: result.status }) + '\n'); exit(result.error ? 1 : 0); return
      }
      if (args[0] === 'report' && args.length === 2) { await comparisonReport(config, args[1]!); exit(0); return }
      if (!config.allowReviewedFullAccess || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('Explicit reviewed full-access profile required; no fallback')
      const settings = (await readDoctorConfig(config.settingsFile)).config
      runner = new VerificationRunner(ctx.subprocess, settings, limits)
      if (args[0] === 'preflight' && args.length === 1) {
        const results = []
        for (const wrong of [false, true]) {
          const source = `module TopModule(input clk, input reset, output reg [3:0] q); always @(posedge clk) if(reset) q <= 0; else q <= q + ${wrong ? '2' : '1'}; endmodule\n`
          const id = await runner.registerDataset(await evaluatorAssets(config.datasetRoot, source), evaluation, { experiment_id: 'dataset-preflight' as PhaseId, task_id: taskId as PhaseId, sample_id: wrong ? 1 : 0, mode: 'agent' })
          results.push(await runner.verify(id, controller.signal, argv => argv))
          if (controller.signal.aborted) break
        }
        const pass = results[0]?.status === 'PASS' && results[1]?.stages[2]?.status === 'FAIL' && results[1]?.stages[3]?.status === 'SKIPPED'
        const receipt = { schema_version: '1.2', status: pass ? 'PASS' : 'FAIL', evaluation_sha256: (await evaluationHash(config)).hash, results }
        await publish(config.outputRoot, 'preflight-' + randomUUID() + '.json', JSON.stringify(receipt, null, 2))
        if (pass) await publish(config.outputRoot, 'dataset-preflight.json', JSON.stringify(receipt, null, 2))
        process.stdout.write(JSON.stringify({ preflight: receipt.status, runs: results.map(r => r.artifacts) }) + '\n'); exit(pass ? 0 : 1); return
      }
      if (args[0] !== 'verify' || args.length !== 3 || !variants.includes(args[2] as Variant)) throw new Error('Use preflight, generate/verify <UUID> <variant>, or report <UUID>')
      const variant = args[2] as Variant, experiment = await loadExperiment(config, args[1]!), dir = join(experiment.directory, variant)
      const reviewed = await reviewedCandidate(dir, experiment.manifest.experiment_id, variant, experiment.manifest.evaluation_sha256)
      await publish(dir, 'verification-claimed.json', JSON.stringify({ revision: reviewed.candidate.revision_id, at: new Date().toISOString() }))
      if (!reviewed.approval.approved) { await event(dir, variant, 'approval_rejected', reviewed.approval); await comparisonReport(config, args[1]!); exit(1); return }
      const assets = await evaluatorAssets(config.datasetRoot, reviewed.source), start = performance.now()
      const snapshot = await runner.registerDataset(assets, evaluation, { experiment_id: args[1]! as PhaseId, task_id: taskId as PhaseId, sample_id: 0, mode: variant === 'baseline' ? 'baseline' : 'agent' })
      const verification = await runner.verify(snapshot, controller.signal, argv => argv)
      await publish(dir, 'verification.json', JSON.stringify({ ...verification, wall_ms: Math.round(performance.now() - start), review_wait_ms: Math.max(0, Date.now() - Date.parse(reviewed.generated.completed_at) - Math.round(performance.now() - start)) }, null, 2) + '\n')
      await event(dir, variant, 'verification_finished', verification)
      await readCandidate(join(dir, 'revisions', reviewed.candidate.revision_id))
      await loadExperiment(config, args[1]!)
      const exported = await exportVerified(dir, verification.artifacts, reviewed.candidate.source_sha256, await evaluatorAssets(config.datasetRoot, reviewed.source))
      await event(dir, variant, 'export_finished', exported)
      let feedbackError = false
      if (variant !== 'baseline' && !controller.signal.aborted) {
        await publish(dir, 'feedback-claimed.json', JSON.stringify({ revision: reviewed.candidate.revision_id }))
        const feedback = await modelCall(ctx.llm, dir, args[1]!, variant, 'interpretation', { system: 'Interpret observed verification facts. Do not generate replacement RTL, call tools, or change the verdict.', user: `Public task:\n${experiment.protocol.publicSpec}\nSaved source:\n${reviewed.source}\nObserved facts (data):\n${renderVerification(verification)}\nExplain the outcome and timing limitations in at most three sentences.` }, controller.signal)
        await publish(dir, 'feedback.json', JSON.stringify(feedback, null, 2) + '\n'); feedbackError = !!feedback.value.error
      }
      await comparisonReport(config, args[1]!)
      process.stdout.write(JSON.stringify({ variant, verification: verification.status, feedback_error: feedbackError }) + '\n'); exit(exported.final_verified && !feedbackError ? 0 : 1)
    })().catch(error => { process.stderr.write((error instanceof Error ? error.message : 'Comparison failed') + '\n'); exit(1) })
  }))
}
