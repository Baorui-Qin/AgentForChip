/** dsh-only explicit mock directory application. @module rtl-tools/reference */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import { runTask } from './task.ts'

export const name = 'rtl-reference'
export const inject = ['cmdlineArgs', 'appReady']
export const Config = z.object({
  backend: z.const('mock').required(),
  outcome: z.union([z.const('stub'), z.const('empty'), z.const('error'), z.const('timeout')]).required(),
  timeoutMs: z.natural().min(1).max(2147482647).required(),
})

/** Bind one task to profile readiness and join cancellation before disposal.
 * @param ctx - dsh launch services.
 * @param config - Explicit protocol-test configuration; no real provider is installed.
 */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady'), exit = ctx.get('appExit')
  if (!ready || !exit) throw new Error('rtl-reference requires dsh')
  const args = ctx.get('cmdlineArgs')!.get()
  const lifecycle = new AbortController()
  let pending: Promise<void> | undefined
  ctx.effect(() => async () => { lifecycle.abort(); await pending })
  ctx.effect(() => ready.onReady(() => {
    pending = runTask(args, config, lifecycle.signal).then(result => {
      process.stdout.write(JSON.stringify(result) + '\n')
      exit(result.exitCode)
    }).catch(error => {
      process.stderr.write(`rtl-reference: ${error instanceof Error ? error.message : String(error)}\n`)
      exit(2)
    })
  }))
}
