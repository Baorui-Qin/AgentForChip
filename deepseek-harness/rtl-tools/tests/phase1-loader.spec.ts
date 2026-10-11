import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'
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
import { installTestOperationScope } from './test-operation-scope.ts'
import { ManagedVersionProbeFixture } from './helpers/managed-version-probe-fixture.ts'
import { TargetWitness } from './helpers/g1-target-witness.ts'
import { LoaderReceiptCapture } from './helpers/loader-receipt-capture.ts'
import { waitForChildReadiness } from './helpers/child-readiness-wait.ts'

const roots: string[] = [], contexts: Context[] = []
const versionFixtures: ManagedVersionProbeFixture[] = []
const operationScope = installTestOperationScope()
let receiptCapture: LoaderReceiptCapture | undefined
afterEach(async () => {
  const scope = operationScope()
  try {
    const capture = receiptCapture ?? new LoaderReceiptCapture(scope, new TargetWitness('Loader-boot'), roots)
    await capture.cleanup(async () => {
      for (const fixture of versionFixtures) await fixture.close()
      for (const ctx of contexts) await ctx.fiber.dispose()
    }, async () => {
      for (const root of roots) await rm(root, { recursive: true, force: true })
    })
    contexts.length = 0; roots.length = 0; versionFixtures.length = 0; receiptCapture = undefined
  } catch (error) {
    console.error('Loader cleanup failed; roots retained', JSON.stringify({ roots, scope_id: scope.id,
      pending: scope.pendingOperations, primary_errors: scope.bodyErrors(), cleanup_error: String(error) }))
    throw error
  } finally { vi.restoreAllMocks() }
})
class PartialSandbox extends SandboxProvider {
  confine(argv: readonly string[]) { return { argv: [...argv], enforcement: 'partial' as const, denialSignatures: [], runnerFailureRules: [] } }
}

async function boot(trusted: boolean, options = {}, mode = trusted ? 'danger-full-access' : 'workspace-write', isolateVersionProbes = false) {
  return operationScope().track('Loader boot', async () => {
  const root = await mkdtemp(join(tmpdir(), 'phase1-loader-')); roots.push(root)
  const scope = operationScope(), witness = new TargetWitness(isolateVersionProbes ? 'Loader-seven' : 'Loader-native')
  receiptCapture = new LoaderReceiptCapture(scope, witness, roots)
  const loaderId = scope.id
  witness.record('loader_boot_start', { loader_id: loaderId, owned_root: root, isolate_version_probes: isolateVersionProbes })
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
  let started = false, fixtureIndex = 0, targetRun: string | undefined
  const targetTerminalListeners = new Set<(code: number) => void>()
  let activeFixture: { fixture: string; index: number; snapshot_id: unknown; call_id: string } | undefined
  const exit = vi.fn((code?: number) => {
    witness.record('loader_terminal', { loader_id: loaderId, owned_root: root, code })
    for (const listener of targetTerminalListeners) listener(code!)
  })
  provideCmdline(ctx, { args: ['verify-fixtures'], exit, ready: { onReady(fn) { start = fn; return () => { start = undefined } } } })
  await ctx.plugin(Loader); ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([['systemPrompt', SystemPrompt], ['tools', Tools], ['subprocess', LocalSubprocess], ['sandbox', PartialSandbox], ['projections', Projections], ['policy', SandboxPolicy], ['development', Development]])
  ctx.loader.internal = { version: 'v2', async import(name: string) { if (!modules.has(name)) throw new Error('Unknown test module'); return modules.get(name) } } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(join(root, 'cordis.yml')).href } }); await ctx.loader.await()
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const prefix = [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify(options)]
  const versionFixture = isolateVersionProbes ? new ManagedVersionProbeFixture(spawn, [...prefix, '-version'], { stdout: 'Vivado Simulator v2026.1\n', stderr: '', exitCode: 0 }) : undefined
  if (versionFixture) versionFixtures.push(versionFixture)
  const spy = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => {
    const mapped = { ...spec, argv: [...prefix, ...spec.argv.slice(1)] }
    const runName = relative(root, mapped.cwd).split(sep)[0]
    const run = runName?.startsWith('run-') ? join(root, runName) : null
    if (run !== null && activeFixture?.fixture === 'counter' && activeFixture.index === 0) {
      if (targetRun !== undefined) expect(run).toBe(targetRun)
      targetRun = run
    }
    witness.record('loader_subprocess_call_start', { loader_id: loaderId, owned_root: root, ...activeFixture,
      run, argv: mapped.argv, cwd: mapped.cwd })
    const handle = versionFixture ? versionFixture.spawn(mapped) : spawn(mapped)
    return scope.observeManaged(witness.observe(mapped, handle, versionFixture?.calls.at(-1)?.kind === 'VERSION_FIXTURE' ? 'LOGICAL_VERSION' : 'NATIVE'))
  })
  const outputs: ToolExecutionResult[] = []
  const execute = ctx.tools.execute.bind(ctx.tools)
  vi.spyOn(ctx.tools, 'execute').mockImplementation(call => scope.track('Loader verify_rtl', async () => {
    const fixture = started ? fixtureIds[fixtureIndex] : undefined
    activeFixture = fixture === undefined ? undefined : { fixture, index: fixtureIndex++, snapshot_id: (call.arguments as { snapshot_id: unknown }).snapshot_id, call_id: call.callId }
    const binding = activeFixture
    witness.record('loader_fixture_start', { loader_id: loaderId, owned_root: root, ...binding })
    try {
      const result = await execute({ ...call, signal: AbortSignal.any([call.signal, scope.signal]) })
      outputs.push(result)
      const value = result.value as unknown as VerificationResult | undefined
      witness.record('loader_fixture_result', { loader_id: loaderId, owned_root: root, ...binding, is_error: result.isError,
        snapshot_id: value?.snapshot_id ?? binding?.snapshot_id, run: value?.artifacts ?? null,
        status: value?.status ?? null, stages: value?.stages ?? null })
      if (binding?.fixture === 'counter' && binding.index === 0) {
        if (targetRun !== undefined && value?.artifacts !== undefined) expect(value.artifacts).toBe(targetRun)
        for (const listener of targetTerminalListeners) listener(!result.isError && value?.status === 'PASS' ? 0 : 1)
      }
      return result
    } finally { activeFixture = undefined }
  }))
  witness.record('loader_boot_end', { loader_id: loaderId, owned_root: root })
  return { root, ctx, spy, exit, outputs, versionFixture, versionArgv: [...prefix, '-version'], witness, currentRun: () => targetRun,
    subscribeTargetTerminal: (listener: (code: number) => void) => {
      targetTerminalListeners.add(listener)
      return () => { targetTerminalListeners.delete(listener) }
    }, start: () => {
    started = true; witness.record('loader_command_start', { loader_id: loaderId, owned_root: root }); start!()
  } }
  })
}

it('loads the snapshot-only tool through Loader and reconstructs its compact output from project events', async () => {
  const s = await boot(true, {}, 'danger-full-access', true)
  const schema = s.ctx.tools.schemas().find(tool => tool.name === 'verify_rtl')!
  expect(Object.keys(schema.parameters.properties as object)).toEqual(['snapshot_id'])
  for (const args of [{ snapshot_id: 'unknown' }, { snapshot_id: 'unknown', shell: 'cmd.exe' }, { snapshot_id: 'unknown', cwd: 'D:/' }]) {
    const result = await s.ctx.tools.execute({ name: 'verify_rtl', arguments: args, callId: ToolCallId('unapproved'), signal: new AbortController().signal })
    expect(result.isError).toBe(true)
  }
  expect(s.spy).not.toHaveBeenCalled(); s.outputs.length = 0; s.start()
  await operationScope().track('Loader terminal wait', () => vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(0), { timeout: 30000 }))
  expect(s.outputs).toHaveLength(fixtureIds.length)
  for (const [index, output] of s.outputs.entries()) {
    expect(output.isError, JSON.stringify(output.content)).toBe(false)
    const result = output.value as unknown as VerificationResult
    const events = await operationScope().track('Loader event reconstruction', async () =>
      (await readFile(join(result.artifacts, 'events.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line)))
    expect(events.filter(event => event.type === 'stage_finished').map(event => event.value)).toEqual(result.stages)
    expect(output.content).toEqual([{ type: 'text', text: Development.renderVerification(result) }])
    expect(JSON.stringify(output.content).length).toBeLessThan(5000)
    expect(s.versionFixture!.calls.filter(call => call.kind === 'VERSION_FIXTURE' && call.spec.cwd === join(result.artifacts, 'build'))).toHaveLength(4)
    s.witness.record('loader_event_reconstruction_complete', { fixture: fixtureIds[index], index, snapshot_id: result.snapshot_id,
      run: result.artifacts, stage_receipts: result.stages.length })
    s.witness.record('loader_fixture_end', { fixture: fixtureIds[index], index, snapshot_id: result.snapshot_id, run: result.artifacts })
  }
  expect(s.versionFixture!.calls.filter(call => call.kind === 'VERSION_FIXTURE')).toHaveLength(4 * fixtureIds.length)
  const versions = s.versionFixture!.calls.filter(call => call.kind === 'VERSION_FIXTURE')
  expect(versions.every(call => call.settled)).toBe(true)
  for (const call of versions) expect(call.spec.argv).toEqual(s.versionArgv)
  expect(s.versionFixture!.calls.some(call => call.kind === 'NATIVE_FAKE_VERIFICATION')).toBe(true)
  expect(s.outputs.flatMap(output => (output.value as unknown as VerificationResult).stages[0]!.invocations ?? [])
    .filter(invocation => invocation.label.endsWith('-version')).every(invocation => invocation.version_matches)).toBe(true)
})

it('does not treat Windows partial enforcement or guessed tool parameters as an unconfined permit', async () => {
  const s = await boot(false); s.start()
  await operationScope().track('Loader terminal wait', () => vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(1), { timeout: 10000 }))
  expect(s.spy).not.toHaveBeenCalled()
  expect(s.outputs.every(output => (output.value as unknown as VerificationResult).status === 'TOOL_ERROR')).toBe(true)
})

it.each(['read-only', 'danger-full-access'])('refuses %s without a trusted permit before writing snapshots', async mode => {
  const s = await boot(false, {}, mode); s.start()
  await operationScope().track('Loader terminal wait', () => vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(1), { timeout: 10000 }))
  expect(s.spy).not.toHaveBeenCalled()
  expect((await readdir(s.root)).filter(name => name.startsWith('run-'))).toEqual([])
})

it('unloading the application cancels a live verifier and joins its child tree', async () => {
  const s = await boot(true, { hang: 'simulation' })
  expect(s.versionFixture).toBeUndefined()
  let run: string | undefined
  await operationScope().track('Loader child readiness wait', () => waitForChildReadiness(async () => {
    run = s.currentRun()
    if (run === undefined) return false
    const path = join(run, 'child.pid')
    let text: string
    try { text = await readFile(path, 'utf8') }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT' && (error as NodeJS.ErrnoException).path === path) return false; throw error }
    expect(text).toMatch(/^\d+$/)
    return true
  }, s.subscribeTargetTerminal, s.start, 10000, 25))
  await s.ctx.fiber.dispose()
  const pid = Number(await readFile(join(run!, 'child.pid'), 'utf8'))
  expect(() => process.kill(pid, 0)).toThrow()
  const terminal = JSON.parse(await readFile(join(run!, 'result.json'), 'utf8'))
  expect(terminal.final_status).toBe('ABORTED')
})
