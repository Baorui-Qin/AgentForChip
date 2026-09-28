/** Independent zero-shot application: no Agent, tools, evaluator or subprocess injection. @module rtl-tools/phase1/baseline */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-llm'
import { generate, initializeExperiment } from './experiment.ts'
export const name = 'rtl-baseline'
export const inject = ['cmdlineArgs', 'appReady', 'llm']
export const Config = z.object({ outputRoot: z.string().required(), datasetRoot: z.string().required(), settingsFile: z.string().required() })
/** Independent one-shot entry; initialization never calls the model. @param ctx - minimal profile. @param config - host paths. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady')!, exit = ctx.get('appExit')!, args = ctx.cmdlineArgs!.get()
  if (ctx.get('agentLoop') || ctx.get('tools') || ctx.get('subprocess') || ctx.get('skill')) throw new Error('Baseline requires an isolated no-Agent/no-EDA profile')
  const controller = new AbortController(); let pending: Promise<void> | undefined
  ctx.effect(() => async () => { controller.abort(); await pending })
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      if (args.length === 1 && args[0] === 'init') process.stdout.write(JSON.stringify(await initializeExperiment(config)) + '\n')
      else if (args.length === 2 && args[0] === 'generate') {
        const result = await generate(ctx.llm, config, args[1]!, 'baseline', controller.signal)
        process.stdout.write(JSON.stringify({ variant: 'baseline', status: result.status }) + '\n'); exit(result.error ? 1 : 0); return
      } else throw new Error('Use init or generate <experiment UUID>')
      exit(0)
    })().catch(error => { process.stderr.write(String(error instanceof Error ? error.message : 'Baseline error') + '\n'); exit(1) })
  }))
}
