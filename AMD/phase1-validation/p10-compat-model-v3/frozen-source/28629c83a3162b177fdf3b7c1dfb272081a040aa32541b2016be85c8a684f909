/** Official API smoke application; generated text is never executed. @module rtl-tools/phase1/api-development */
import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-llm'
import { EventRecorder, atomicJson } from './recorder.ts'
import { callText } from './model.ts'
import type { PhaseId, RunIdentity } from './contracts.ts'
import type { ModelRecord, RunRecord } from './records.ts'

export const name = 'rtl-phase1-api-development'
export const inject = ['cmdlineArgs', 'appReady', 'llm']
export const Config = z.object({
  outputRoot: z.string().required(), model: z.string().required(), maxTokens: z.natural().min(1).required(),
  temperature: z.number().min(0).max(2).required(), timeoutMs: z.natural().min(1).max(2147483647).required(),
  maxResponseBytes: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required(),
})

/** Run ten serial short development calls through dsh. @param ctx - existing provider and credential services. @param config - explicit model and budgets. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady'), exit = ctx.get('appExit')
  if (!ready || !exit) throw new Error('API development requires dsh')
  if (!config.model.trim()) throw new Error('An explicit model id is required')
  if (config.maxEventBytes < config.maxResponseBytes * 6 + 16384) throw new Error('Event cap must retain the complete bounded JSON response')
  const args = ctx.get('cmdlineArgs')?.get()
  if (args?.length !== 1 || args[0] !== 'model-smoke') throw new Error('Expected the single command: model-smoke')
  const lifecycle = new AbortController()
  let pending: Promise<void> | undefined
  ctx.effect(() => async () => { lifecycle.abort(); await pending })
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      await mkdir(config.outputRoot, { recursive: true })
      const experiment = `api-${randomUUID()}` as PhaseId
      const results: { artifacts: string; result: ModelRecord }[] = []
      for (let sample = 0; sample < 10; sample++) {
        if (lifecycle.signal.aborted) break
        const identity: RunIdentity = { experiment_id: experiment, task_id: 'public-development-smoke' as PhaseId, sample_id: sample, mode: 'agent' }
        const recorder = await EventRecorder.create(config.outputRoot, identity, config.maxEventBytes, '1.1')
        try {
          const link = { revision_id: `sample-${sample}` as PhaseId, call_id: randomUUID() as PhaseId }
          const result = await callText(ctx.llm, config, 'Reply with a single short sentence describing a four-bit synchronous binary counter. Do not call tools.', recorder, link, lifecycle.signal)
          await atomicJson(recorder.directory, 'model.json', result)
          await writeFile(join(recorder.directory, 'response.txt'), result.content, { flag: 'wx', mode: 0o600 })
          const terminal: RunRecord = { schema_version: '1.1', ...identity, final_status: lifecycle.signal.aborted ? 'ABORTED' : 'INCONCLUSIVE',
            final_revision_id: link.revision_id, final_source_sha256: null, verification_key: null, final_verified: false,
            stages: { compile: null, elaborate: null, simulation: null, synthesis: null }, semantic_repairs: 0, model_requests_total: 1, transport_retries: 0,
            stop_reason: result.error ? `Official API development: ${result.error.category}` : 'Official API development only; text saved, no EDA execution.', artifact_manifest: ['events.jsonl', 'model.json', 'response.txt'] }
          await recorder.finish(terminal)
          results.push({ artifacts: recorder.directory, result })
          await atomicJson(config.outputRoot, `${experiment}.json`, { schema_version: '1.1', evidence: 'real-official-api', attempts: results.length,
            passed: results.length === 10 && results.every(row => !row.result.error), local_model_verified: false, results })
          process.stdout.write(JSON.stringify({ sample, error: result.error?.category ?? null, artifacts: recorder.directory }) + '\n')
        } finally { await recorder.close() }
      }
      exit(results.length === 10 && results.every(row => !row.result.error) ? 0 : 1)
    })().catch(() => { process.stderr.write('API development failed; inspect retained project records. No credential details are printed.\n'); exit(1) })
  }))
}
