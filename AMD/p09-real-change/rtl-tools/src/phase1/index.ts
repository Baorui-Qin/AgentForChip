/** One-shot preflight launched only by a dsh profile. @module rtl-tools/phase1 */
import { realpath } from 'node:fs/promises'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-sandbox'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { within } from '../runner.ts'
import { readDoctorConfig, runDoctor } from './doctor.ts'
import { atomicJson } from './recorder.ts'

export const name = 'rtl-phase1-doctor'
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy', 'sandbox']
export const Config = z.object({ configFile: z.string().required() })

/**
 * Start preflight after Loader startup commits and join it before plugin disposal completes.
 * @param ctx - launcher and managed execution services.
 * @param config - explicit development YAML path.
 */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const exit = ctx.get('appExit')
  const ready = ctx.get('appReady')
  if (!exit || !ready) throw new Error('Doctor requires the dsh profile launcher')
  const args = ctx.get('cmdlineArgs')?.get()
  if (args?.length !== 1 || args[0] !== 'doctor') throw new Error('Expected the single command: doctor')
  const lifecycle = new AbortController()
  let pending: Promise<void> | undefined
  ctx.effect(() => async () => { lifecycle.abort(); await pending })
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      const { config: settings, sha256 } = await readDoctorConfig(config.configFile)
      const policy = ctx.sandboxPolicy.resolve({})
      if (policy.mode === 'read-only') throw new Error('Doctor requires writable artifacts')
      if (policy.mode === 'workspace-write' && !within(await realpath(policy.workspaceRoot), await realpath(settings.outputRoot))) throw new Error('Doctor outputRoot is outside the writable workspace')
      const result = await runDoctor(ctx.subprocess, settings, sha256, lifecycle.signal, argv => {
        if (policy.mode === 'danger-full-access') return argv
        const confined = ctx.sandbox.confine(argv, { ...policy, mode: 'workspace-write' })
        if (confined.enforcement !== 'full') throw new Error('Doctor requires full file-sandbox enforcement')
        return confined.argv
      })
      await atomicJson(result.directory, 'launch.json', { schema_version: '1.0', command: 'doctor',
        config_file: config.configFile, sandbox_policy: { mode: policy.mode, workspace_root: policy.workspaceRoot } })
      process.stdout.write(JSON.stringify({ status: result.status, eda_ready: result.eda_ready, artifacts: result.directory }) + '\n')
      exit(result.eda_ready ? 2 : 1)
    })().catch(error => {
      process.stderr.write(`Doctor failed: ${error instanceof Error ? error.message : 'unknown failure'}\n`)
      exit(1)
    })
  }))
}
