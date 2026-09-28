/** Explicit API-development profile, separate from research P10 and protocol mock. @module rtl-tools/reference/api */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import { createSolver, type SolverConfig } from './solver.ts'
import { runTask } from './task.ts'

export const name = 'rtl-reference-api'
export const inject = ['agents', 'agentLoop', 'sessions', 'tools', 'llm', 'subprocess', 'cmdlineArgs', 'appReady']

/** Unisolated development runs require explicit consent; production isolation is not inferred. */
export interface Config extends SolverConfig { timeoutMs: number; allowUnisolatedDevelopment: boolean }
const positive = () => z.natural().min(1).max(2147482647).required()
export const Config: z<Config> = z.object({
  provider: z.string().required(), model: z.string().required(), maxCalls: positive(), maxTokens: positive(),
  maxRequestBytes: positive(), maxResponseBytes: positive(), temperature: z.number().min(0).max(2).required(),
  timeoutMs: positive(), allowUnisolatedDevelopment: z.boolean().default(false),
  checks: z.object({ xvlog: z.string().required(), vivado: z.string().required(), part: z.string().required(),
    threads: positive(), timeoutMs: positive(), graceMs: positive(), maxLogBytes: positive(), maxLineChars: positive(),
    maxReportBytes: positive(), maxDiagnostics: positive(), maxSourceBytes: positive() }),
})

/** Mount the bounded invocation and drain cancellation before profile teardown.
 * @param ctx - Settled minimal profile services and launcher lifecycle.
 * @param config - Validated API and EDA limits.
 */
export function apply(ctx: Context, config: Config): void {
  if (!config.allowUnisolatedDevelopment) throw new Error('OS read isolation is not supplied by this development profile; explicit consent is required')
  const exit = ctx.get('appExit'), ready = ctx.get('appReady')
  if (!exit || !ready) throw new Error('rtl-reference-api requires the dsh launcher')
  const args = ctx.get('cmdlineArgs')!.get()
  const lifetime = new AbortController()
  let pending: Promise<void> | undefined
  ctx.effect(() => async () => { lifetime.abort(); await pending })
  ctx.effect(() => ready.onReady(() => {
    pending = runTask(args, { outcome: 'stub', timeoutMs: config.timeoutMs }, lifetime.signal, createSolver(ctx, config))
      .then(result => { process.stdout.write(JSON.stringify(result) + '\n'); exit(result.exitCode) })
      .catch((error: unknown) => { process.stderr.write(String(error) + '\n'); exit(2) })
  }))
}
