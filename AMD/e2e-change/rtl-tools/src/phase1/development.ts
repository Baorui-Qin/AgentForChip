/** Explicit handwritten-fixture application, launched by dsh only. @module rtl-tools/phase1/development */
import { mkdir, realpath } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-cmdline'
import type {} from '@deepseek-ai/dsh-sandbox'
import type {} from '@deepseek-ai/dsh-sandbox-policy'
import { within } from '../runner.ts'
import { readDoctorConfig } from './doctor.ts'
import { fixtureIds, expectedStage } from './fixtures.ts'
import { atomicJson } from './recorder.ts'
import { VerificationRunner, type VerificationResult } from './verification.ts'
import type { PhaseId } from './contracts.ts'
import { verificationOutput } from './verification-output.ts'

export const name = 'rtl-phase1-development'
export const inject = ['cmdlineArgs', 'appReady', 'tools', 'subprocess', 'sandboxPolicy', 'sandbox']
export const Config = z.object({
  configFile: z.string().required(), trustedFixtureSmoke: z.boolean().required(),
  compileMs: z.natural().min(1).max(2147483647).required(), elaborateMs: z.natural().min(1).max(2147483647).required(),
  simulationMs: z.natural().min(1).max(2147483647).required(), totalMs: z.natural().min(1).max(2147483647).required(),
  maxArtifactBytes: z.natural().min(1).required(), artifactPollMs: z.natural().min(1).required(), maxEventBytes: z.natural().min(1).required(),
})

/** Bounded transcript projection. @param value - validated verification facts. @returns reconstructable model text. */
export function renderVerification(value: VerificationResult): string {
  return [`RTL verification: ${value.status}`, ...value.stages.map(stage => `${stage.stage}: ${stage.status}; exit=${stage.exit_code}; errors=${JSON.stringify(stage.errors)}; warnings=${JSON.stringify(stage.warnings)}; processes=${JSON.stringify(stage.processes)}; omitted=${stage.diagnostics_omitted}; excerpt_truncated=${stage.diagnostic_excerpt_truncated}${stage.synthesis ? '; synthesis=' + JSON.stringify(stage.synthesis) : ''}`),
    value.stages.some(stage => stage.trust === 'reviewed_candidate') ? 'Trust: host-reviewed model candidate; full OS isolation NOT verified.' : 'Trust: fixed handwritten fixture; full OS isolation NOT verified.', `Artifacts: ${value.artifacts}`].join('\n')
}

/** Install snapshot-only tool and run the explicit fixture command. @param ctx - Harness services. @param config - trusted deployment settings. */
export function apply(ctx: Context, config: ReturnType<typeof Config>): void {
  const ready = ctx.get('appReady')
  const exit = ctx.get('appExit')
  if (!ready || !exit) throw new Error('Phase 1 development requires dsh')
  const args = ctx.get('cmdlineArgs')?.get()
  if (args?.length !== 1 || args[0] !== 'verify-fixtures') throw new Error('Expected the single command: verify-fixtures')
  const lifecycle = new AbortController()
  const active = new Set<Promise<unknown>>()
  const permits = new Map<string, string>()
  let runner: VerificationRunner | undefined
  let root: string | undefined
  let pending: Promise<void> | undefined
  ctx.effect(() => async () => { lifecycle.abort(); await pending; await Promise.allSettled([...active]); await runner?.close() })
  ctx.tools.register(defineTool({
    name: 'verify_rtl', description: 'Verify a host-registered snapshot. No paths, commands or arbitrary HDL are accepted. Returns bounded stage evidence; not an adversarial scoring authority.',
    parameters: { snapshot_id: { type: 'string', required: true } },
    output: { schema: verificationOutput, render: (_args, value) => [{ type: 'text', text: renderVerification(value as unknown as VerificationResult) }] },
    async execute(args, exec) {
      if (!runner || !root) throw new Error('Snapshot registry is not ready')
      const signal = AbortSignal.any([exec.signal, lifecycle.signal])
      const policy = ctx.sandboxPolicy.resolve(exec.agent ? { session: exec.agent.session } : {})
      const approved = !exec.agent && config.trustedFixtureSmoke && permits.get(exec.callId) === args.snapshot_id
      permits.delete(exec.callId)
      if (policy.mode === 'read-only' || (policy.mode === 'danger-full-access' && !approved)) throw new Error('Verification requires writable confinement or an explicit host fixture permit')
      if (policy.mode === 'workspace-write' && !within(await realpath(policy.workspaceRoot), root)) throw new Error('Artifacts are outside the sandbox workspace')
      const task = runner.verify(args.snapshot_id, signal, argv => {
        if (approved && policy.mode === 'danger-full-access') return argv
        if (policy.mode !== 'workspace-write') throw new Error('Ordinary verification requires a full workspace-write sandbox')
        const confined = ctx.sandbox.confine(argv, { ...policy, mode: 'workspace-write' })
        if (confined.enforcement !== 'full') throw new Error('Partial sandbox enforcement refused')
        return confined.argv
      })
      active.add(task)
      try { return JSON.parse(JSON.stringify(await task)) } finally { active.delete(task) }
    },
  }))
  ctx.effect(() => ready.onReady(() => {
    pending = (async () => {
      const { config: settings } = await readDoctorConfig(config.configFile)
      const policy = ctx.sandboxPolicy.resolve({})
      if (policy.mode === 'read-only') throw new Error('Fixture application requires writable artifacts')
      if (policy.mode === 'workspace-write') {
        // Ordinary deployments must pre-create their confined artifact root.
        if (!within(await realpath(policy.workspaceRoot), await realpath(settings.outputRoot))) throw new Error('Artifacts are outside the sandbox workspace')
      } else {
        if (!config.trustedFixtureSmoke) throw new Error('Full access is restricted to the explicit fixture application')
        await mkdir(settings.outputRoot, { recursive: true })
      }
      root = await realpath(settings.outputRoot)
      runner = new VerificationRunner(ctx.subprocess, settings, config)
      const experiment = `fixtures-${randomUUID()}` as PhaseId
      const summary: { fixture: string; expected: string | null; matched: boolean; result: VerificationResult }[] = []
      for (const [index, fixture] of fixtureIds.entries()) {
        lifecycle.signal.throwIfAborted()
        const id = await runner.registerFixture(fixture, { experiment_id: experiment, task_id: fixture as PhaseId, sample_id: index, mode: 'agent' })
        const callId = ToolCallId(randomUUID())
        permits.set(callId, id)
        const output = await ctx.tools.execute({ name: 'verify_rtl', arguments: { snapshot_id: id }, callId, signal: lifecycle.signal })
        if (output.isError) throw new Error('Verification tool failed: ' + JSON.stringify(output.content))
        const result = output.value as unknown as VerificationResult
        const failed = result.stages.find(stage => stage.status !== 'PASS')
        const expected = expectedStage[fixture]
        const matched = expected === null ? result.status === 'PASS' : failed?.stage === expected && failed.status === 'FAIL'
        summary.push({ fixture, expected, matched, result })
        await atomicJson(root, `${experiment}.json`, { schema_version: '1.1', evidence: 'real-handwritten-fixtures', full_isolation_verified: false, summary })
        process.stdout.write(JSON.stringify({ fixture, matched, status: result.status, artifacts: result.artifacts }) + '\n')
      }
      exit(summary.every(row => row.matched) ? 0 : 1)
    })().catch(error => { process.stderr.write(`Fixture suite failed: ${error instanceof Error ? error.message : 'unknown'}\n`); exit(1) })
  }))
}
