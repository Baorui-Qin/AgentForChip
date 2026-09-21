import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import Llm, { type StreamChunk } from '@deepseek-ai/dsh-llm'
import SandboxPolicy from '@deepseek-ai/dsh-sandbox-policy'
import Projections from '@deepseek-ai/dsh-session-projection'
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { afterEach, expect, it, vi } from 'vitest'
import * as Repair from '../src/phase1/repair.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import { fixtureFiles } from '../src/phase1/fixtures.ts'
import * as Tokenizer from '../src/phase1/p09-tokenizer.ts'

const roots: string[] = [], contexts: Context[] = []
afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
async function directory() {
  const root = await mkdtemp(join(tmpdir(), 'repair-loader-')); roots.push(root)
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root; config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  config.limits = { ...config.limits, timeoutMs: 5000, graceMs: 100 }
  await writeFile(join(root, 'settings.json'), JSON.stringify(config))
  return root
}
async function boot(root: string, args: string[], options: { authorized?: boolean; hang?: string; replay?: string; finiteLoop?: boolean; p09?: boolean } = {}) {
  const ctx = new Context(); contexts.push(ctx); ctx.baseUrl = pathToFileURL(root).href + '/'
  let start: (() => void) | undefined
  const exit = vi.fn()
  provideCmdline(ctx, { args, exit, ready: { onReady(fn) { start = fn; return () => { start = undefined } } } })
  await ctx.plugin(Loader); ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([['llm', Llm], ['subprocess', LocalSubprocess], ['projections', Projections], ['policy', SandboxPolicy], ['repair', Repair]])
  ctx.loader.internal = { version: 'v2', async import(name: string) { if (!modules.has(name)) throw new Error('Unknown module'); return modules.get(name) } } as unknown as NonNullable<typeof ctx.loader.internal>
  const conf = join(root, 'loader-' + contexts.length + '.json')
  if (options.p09) {
    await writeFile(join(root, 'p09.json'), JSON.stringify({ variant: 'B', maxRequests: 15, skillsFile: null, skillsSha256: null,
      tokenizer: { root, python: 'unused-mock', manifestSha256: 'a'.repeat(64), timeoutMs: 1000 },
      limits: { window: 16384, output: 2048, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 } }))
    vi.spyOn(Tokenizer, 'officialCounter').mockResolvedValue({ quality: 'estimated', identity: { implementation: 'explicit-loader-mock' },
      async count(view) { return Buffer.byteLength(JSON.stringify(view)) + 10 } })
  }
  await writeFile(conf, JSON.stringify([{ name: 'llm' }, { name: 'subprocess' }, { name: 'projections' }, { name: 'policy', config: { mode: options.authorized ? 'danger-full-access' : 'workspace-write', workspaceRoot: root } },
    { name: 'repair', config: { configFile: join(root, 'settings.json'), allowReviewedFullAccess: options.authorized ?? false, replayRun: options.replay ?? '', model: 'mock', maxTokens: 2048, temperature: 0, timeoutMs: 5000,
      maxResponseBytes: 65536, maxEventBytes: 1048576, activeMs: 120000, compileMs: 5000, elaborateMs: 5000, simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 10000000, artifactPollMs: 20,
      ...(options.finiteLoop || options.p09 ? { finiteLoop: true, transportBackoffMs: [1, 2] } : {}),
      ...(options.p09 ? { p09ConfigFile: join(root, 'p09.json') } : {}) } }]))
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(conf).href } }); await ctx.loader.await()
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const processes = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify({ hang: options.hang }), ...spec.argv.slice(1)] }))
  let dispatched = 0
  const calls = vi.spyOn(ctx.llm, 'prepareCall').mockImplementation(async config => ({ config, context: { contextWindow: 16384 }, retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 }, adapterDefaults: {}, async *stream(): AsyncGenerator<StreamChunk> {
    if (options.finiteLoop && ++dispatched === 1) {
      yield { type: 'finish', reason: { kind: 'error', failure: { code: 'TRANSPORT', message: 'Mock connection failure' } } }
      return
    }
    const text = fixtureFiles('counter')['rtl/solution.sv']!
    yield { type: 'block-start', index: 0, blockType: 'text' }; yield { type: 'text-delta', index: 0, text }
    yield { type: 'block-end', index: 0, block: { type: 'text', text } }; yield { type: 'finish', reason: { kind: 'stop' } }
  } }))
  return { ctx, exit, calls, processes, start: () => start!(), async run(code = 0) { start!(); await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(code), { timeout: 30000 }) } }
}
it('loads review-separated repair through Loader; replays without EDA or API and resumes a reviewed new version', async () => {
  const root = await directory(), first = await boot(root, ['start', 'functional'], { authorized: true }); await first.run()
  const dir = join(root, (await readdir(root)).find(name => name.startsWith('repair-'))!)
  const waiting = JSON.parse(await readFile(join(dir, 'state.json'), 'utf8'))
  expect(waiting.phase).toBe('AWAITING_REVIEW'); expect(first.calls).toHaveBeenCalledTimes(1)
  await first.ctx.fiber.dispose()
  const replay = await boot(root, ['replay'], { replay: waiting.verification_run }); await replay.run()
  expect(replay.calls).not.toHaveBeenCalled(); expect(replay.processes).not.toHaveBeenCalled(); await replay.ctx.fiber.dispose()
  const review = await boot(root, ['approve', waiting.experiment_id, waiting.current.source_sha256]); await review.run()
  expect(review.processes).not.toHaveBeenCalled(); await review.ctx.fiber.dispose()
  const resume = await boot(root, ['resume', waiting.experiment_id], { authorized: true }); await resume.run()
  const result = JSON.parse(await readFile(join(dir, 'repair-result.json'), 'utf8'))
  expect(result).toMatchObject({ outcome: 'VERIFIED', attempts: 1, full_os_isolation_verified: false, experiment_kind: 'injected_defect_semi_automatic' })
  expect(resume.calls).not.toHaveBeenCalled()
  const events = (await readdir(dir)).filter(name => /^event-/.test(name))
  expect(events.length).toBeGreaterThan(5)
})
it('P09 Loader records the audited request before dispatch and preserves review separation', async () => {
  const root = await directory(), s = await boot(root, ['start', 'functional'], { authorized: true, p09: true }); await s.run()
  const dir = join(root, (await readdir(root)).find(name => name.startsWith('repair-'))!)
  const state = JSON.parse(await readFile(join(dir, 'state.json'), 'utf8'))
  expect(state).toMatchObject({ schema_version: '1.6', phase: 'AWAITING_REVIEW', p09: { variant_id: 'B', model_requests_total: 1 } })
  const events = (await readFile(join(state.model_runs[0], 'events.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
  const audited = events.find(e => e.type === 'model_context'), sent = events.find(e => e.type === 'model_request')
  expect(audited.seq).toBeLessThan(sent.seq)
  const wire = JSON.parse(await readFile(join(state.model_runs[0], 'context.messages.json'), 'utf8'))
  expect(wire.messages.map((m: { content: string }) => m.content)).toEqual([sent.value.system, sent.value.prompt])
  expect({ schema_version: state.schema_version, phase: state.phase, variant: state.p09.variant_id, calls: state.p09.model_requests_total,
    count_quality: audited.value.count_quality, observed: JSON.parse(sent.value.prompt).observed, tools: sent.value.tools }).toMatchSnapshot()
  expect(sent.value.prompt).not.toContain('PHASE1_COMPLETE checks=%0d')
  await s.ctx.fiber.dispose()
  const repeat = await boot(root, ['resume', state.experiment_id], { authorized: true, p09: true }); await repeat.run()
  expect(repeat.calls).not.toHaveBeenCalled(); expect(repeat.processes).not.toHaveBeenCalled()
})
it('refuses unapproved execution before any model call or subprocess', async () => {
  const root = await directory(), s = await boot(root, ['start', 'functional']); await s.run(1)
  expect(s.calls).not.toHaveBeenCalled(); expect(s.processes).not.toHaveBeenCalled()
  expect((await readdir(root)).some(name => name.startsWith('repair-'))).toBe(false)
})
it('loads opt-in finite retries without confusing transport attempts and semantic rounds', async () => {
  const root = await directory(), s = await boot(root, ['start', 'functional'], { authorized: true, finiteLoop: true }); await s.run()
  const dir = join(root, (await readdir(root)).find(name => name.startsWith('repair-'))!)
  const state = JSON.parse(await readFile(join(dir, 'state.json'), 'utf8'))
  expect(state).toMatchObject({ schema_version: '1.5', phase: 'AWAITING_REVIEW', attempts: 1 })
  expect(s.calls).toHaveBeenCalledTimes(2)
  expect(state.loop.rounds[0].transport.map((attempt: { error_layer: string | null }) => attempt.error_layer)).toEqual(['MODEL_TRANSPORT_ERROR', null])
  expect(state.loop.rounds[0].transport[0].request_sha256).toBe(state.loop.rounds[0].transport[1].request_sha256)
  await s.ctx.fiber.dispose()
  const resumed = await boot(root, ['resume', state.experiment_id], { authorized: true, finiteLoop: true }); await resumed.run()
  expect(resumed.calls).not.toHaveBeenCalled(); expect(resumed.processes).not.toHaveBeenCalled()
})
it('unloading cancels and joins the active process tree', async () => {
  const root = await directory(), s = await boot(root, ['start', 'functional'], { authorized: true, hang: 'simulation' }); s.start()
  let run = ''
  await vi.waitFor(async () => {
    const dir = join(root, (await readdir(root)).find(name => name.startsWith('repair-'))!, 'eda')
    run = join(dir, (await readdir(dir))[0]!)
    expect(await readFile(join(run, 'child.pid'), 'utf8')).toMatch(/^\d+$/)
  }, { timeout: 15000 })
  const pid = Number(await readFile(join(run, 'child.pid'), 'utf8'))
  await s.ctx.fiber.dispose()
  expect(() => process.kill(pid, 0)).toThrow()
  expect(s.calls).not.toHaveBeenCalled()
})
