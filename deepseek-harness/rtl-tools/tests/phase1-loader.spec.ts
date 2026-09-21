import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import Tools, { type ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import Projections from '@deepseek-ai/dsh-session-projection'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import SandboxPolicy from '@deepseek-ai/dsh-sandbox-policy'
import { SandboxProvider } from '@deepseek-ai/dsh-sandbox'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import { afterEach, expect, it, vi } from 'vitest'
import * as Development from '../src/phase1/development.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import type { VerificationResult } from '../src/phase1/verification.ts'
import { fixtureIds } from '../src/phase1/fixtures.ts'

const roots: string[] = [], contexts: Context[] = []
afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
class PartialSandbox extends SandboxProvider {
  confine(argv: readonly string[]) { return { argv: [...argv], enforcement: 'partial' as const, denialSignatures: [], runnerFailureRules: [] } }
}

async function boot(trusted: boolean, options = {}, mode = trusted ? 'danger-full-access' : 'workspace-write') {
  const root = await mkdtemp(join(tmpdir(), 'phase1-loader-')); roots.push(root)
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root; config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  await writeFile(join(root, 'settings.json'), JSON.stringify(config))
  await writeFile(join(root, 'cordis.yml'), JSON.stringify([
    { name: 'systemPrompt' }, { name: 'tools' }, { name: 'subprocess' }, { name: 'sandbox' }, { name: 'projections' },
    { name: 'policy', config: { mode, workspaceRoot: root } },
    { name: 'development', config: { configFile: join(root, 'settings.json'), trustedFixtureSmoke: trusted, compileMs: 5000, elaborateMs: 5000,
      simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 20, maxEventBytes: 65536 } },
  ]))
  const ctx = new Context(); contexts.push(ctx); ctx.baseUrl = pathToFileURL(root).href + '/'
  let start: (() => void) | undefined
  const exit = vi.fn()
  provideCmdline(ctx, { args: ['verify-fixtures'], exit, ready: { onReady(fn) { start = fn; return () => { start = undefined } } } })
  await ctx.plugin(Loader); ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([['systemPrompt', SystemPrompt], ['tools', Tools], ['subprocess', LocalSubprocess], ['sandbox', PartialSandbox], ['projections', Projections], ['policy', SandboxPolicy], ['development', Development]])
  ctx.loader.internal = { version: 'v2', async import(name: string) { if (!modules.has(name)) throw new Error('Unknown test module'); return modules.get(name) } } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(join(root, 'cordis.yml')).href } }); await ctx.loader.await()
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const spy = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify(options), ...spec.argv.slice(1)] }))
  const outputs: ToolExecutionResult[] = []
  const execute = ctx.tools.execute.bind(ctx.tools)
  vi.spyOn(ctx.tools, 'execute').mockImplementation(async call => { const result = await execute(call); outputs.push(result); return result })
  return { root, ctx, spy, exit, outputs, start: () => start!() }
}

it('loads the snapshot-only tool through Loader and reconstructs its compact output from project events', async () => {
  const s = await boot(true)
  const schema = s.ctx.tools.schemas().find(tool => tool.name === 'verify_rtl')!
  expect(Object.keys(schema.parameters.properties as object)).toEqual(['snapshot_id'])
  for (const args of [{ snapshot_id: 'unknown' }, { snapshot_id: 'unknown', shell: 'cmd.exe' }, { snapshot_id: 'unknown', cwd: 'D:/' }]) {
    const result = await s.ctx.tools.execute({ name: 'verify_rtl', arguments: args, callId: ToolCallId('unapproved'), signal: new AbortController().signal })
    expect(result.isError).toBe(true)
  }
  expect(s.spy).not.toHaveBeenCalled(); s.outputs.length = 0; s.start()
  await vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(0), { timeout: 30000 })
  expect(s.outputs).toHaveLength(fixtureIds.length)
  for (const output of s.outputs) {
    expect(output.isError, JSON.stringify(output.content)).toBe(false)
    const result = output.value as unknown as VerificationResult
    const events = (await readFile(join(result.artifacts, 'events.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
    expect(events.filter(event => event.type === 'stage_finished').map(event => event.value)).toEqual(result.stages)
    expect(output.content).toEqual([{ type: 'text', text: Development.renderVerification(result) }])
    expect(JSON.stringify(output.content).length).toBeLessThan(5000)
  }
})

it('does not treat Windows partial enforcement or guessed tool parameters as an unconfined permit', async () => {
  const s = await boot(false); s.start()
  await vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(1), { timeout: 10000 })
  expect(s.spy).not.toHaveBeenCalled()
  expect(s.outputs.every(output => (output.value as unknown as VerificationResult).status === 'TOOL_ERROR')).toBe(true)
})

it.each(['read-only', 'danger-full-access'])('refuses %s without a trusted permit before writing snapshots', async mode => {
  const s = await boot(false, {}, mode); s.start()
  await vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(1), { timeout: 10000 })
  expect(s.spy).not.toHaveBeenCalled()
  expect((await readdir(s.root)).filter(name => name.startsWith('run-'))).toEqual([])
})

it('unloading the application cancels a live verifier and joins its child tree', async () => {
  const s = await boot(true, { hang: 'simulation' }); s.start()
  let run: string | undefined
  await vi.waitFor(async () => {
    run = join(s.root, (await readdir(s.root)).find(name => name.startsWith('run-'))!)
    expect(await readFile(join(run, 'child.pid'), 'utf8')).toMatch(/^\d+$/)
  }, { timeout: 10000, interval: 25 })
  await s.ctx.fiber.dispose()
  const pid = Number(await readFile(join(run!, 'child.pid'), 'utf8'))
  expect(() => process.kill(pid, 0)).toThrow()
  const terminal = JSON.parse(await readFile(join(run!, 'result.json'), 'utf8'))
  expect(terminal.final_status).toBe('ABORTED')
})
