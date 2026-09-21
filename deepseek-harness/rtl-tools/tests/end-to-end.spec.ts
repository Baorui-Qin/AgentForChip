import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import LlmRuntime, { type GenerateOptions, type PreparedLlmCall } from '@deepseek-ai/dsh-llm'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import SandboxPolicy from '@deepseek-ai/dsh-sandbox-policy'
import Projections from '@deepseek-ai/dsh-session-projection'
import { SandboxProvider } from '@deepseek-ai/dsh-sandbox'
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { afterEach, expect, it, vi } from 'vitest'
import * as EndToEnd from '../src/phase1/end-to-end.ts'
import { fixtureFiles } from '../src/phase1/fixtures.ts'
import { checkSnapshot, createReviewedCounterSnapshot, sha256 } from '../src/phase1/snapshots.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import { inspectRun } from '../src/phase1/recorder.ts'
import { renderVerification } from '../src/phase1/development.ts'

const roots: string[] = [], contexts: Context[] = []
const source = fixtureFiles('counter')['rtl/solution.sv']!
afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
class NoSandbox extends SandboxProvider {
  confine(): never { throw new Error('No full sandbox in test') }
}
async function temporary() { const root = await mkdtemp(join(tmpdir(), 'counter-e2e-test-')); roots.push(root); return root }

async function boot(root: string, command: string, response = source, extra = {}, mode = 'workspace-write') {
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root; config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  await writeFile(join(root, 'settings.json'), JSON.stringify(config))
  await writeFile(join(root, 'cordis.yml'), JSON.stringify([
    { name: 'llm' }, { name: 'subprocess' }, { name: 'sandbox' }, { name: 'projections' }, { name: 'policy', config: { mode, workspaceRoot: root } },
    { name: 'e2e', config: { configFile: join(root, 'settings.json'), model: 'mock', maxTokens: 2048, temperature: 0, timeoutMs: 1000,
      maxResponseBytes: 4096, maxEventBytes: 65536, compileMs: 5000, elaborateMs: 5000, simulationMs: 5000,
      totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 20, ...extra } },
  ]))
  const ctx = new Context(); contexts.push(ctx); ctx.baseUrl = pathToFileURL(root).href + '/'
  let start: (() => void) | undefined
  const exit = vi.fn()
  provideCmdline(ctx, { args: [command], exit, ready: { onReady(fn) { start = fn; return () => { start = undefined } } } })
  await ctx.plugin(Loader); ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([['llm', LlmRuntime], ['subprocess', LocalSubprocess], ['sandbox', NoSandbox], ['projections', Projections], ['policy', SandboxPolicy], ['e2e', EndToEnd]])
  ctx.loader.internal = { version: 'v2', async import(name: string) { if (!modules.has(name)) throw new Error('Unknown module'); return modules.get(name) } } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(join(root, 'cordis.yml')).href } }); await ctx.loader.await()
  const requests: GenerateOptions[] = []
  const prepare = vi.spyOn(ctx.llm, 'prepareCall').mockImplementation(async config => ({ config, async *stream(options: GenerateOptions) {
    requests.push(options)
    yield { type: 'block-start', index: 0, blockType: 'text' }
    yield { type: 'text-delta', index: 0, text: response }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: response } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  } }) as unknown as PreparedLlmCall)
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const processes = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), '{}', ...spec.argv.slice(1)] }))
  return { ctx, requests, prepare, processes, exit, async run(code: number) { start!(); await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(code), { timeout: 30000 }) } }
}

it('only strips a whole-response fence and never repairs source or accepts multiple blocks', () => {
  expect(EndToEnd.candidateText(source)).toBe(source)
  expect(EndToEnd.candidateText('```sv\n' + source.trimEnd() + '\n```')).toBe(source.trimEnd() + '\n')
  for (const text of ['', '```sv\na\n```\n```sv\nb\n```', 'Explanation\n```sv\na\n```']) expect(() => EndToEnd.candidateText(text)).toThrow()
})

it('pins reviewed DUT bytes separately without replacing the trusted evaluator', async () => {
  const root = await temporary()
  await expect(createReviewedCounterSnapshot(root, source, '0'.repeat(64))).rejects.toThrow('hash')
  expect(await readdir(root)).toEqual([])
  const snapshot = await createReviewedCounterSnapshot(root, source, sha256(source))
  expect(snapshot.trust).toBe('reviewed_candidate')
  for (const [path, bytes] of Object.entries(fixtureFiles('counter'))) expect(snapshot.files[path]).toBe(sha256(bytes))
  await checkSnapshot(snapshot)
  await writeFile(join(snapshot.directory, 'trusted/tb.sv'), 'changed')
  await expect(checkSnapshot(snapshot)).rejects.toThrow('changed')
})

it('uses the real Loader for one generation, one reviewed verification and one non-executing feedback call', async () => {
  const root = await temporary()
  const generation = await boot(root, 'generate-counter'); await generation.run(0)
  expect(generation.requests).toHaveLength(1); expect(generation.processes).not.toHaveBeenCalled()
  expect(generation.requests[0]?.tools).toEqual([])
  const directory = join(root, (await readdir(root)).find(name => name.startsWith('run-'))!)
  expect(await readFile(join(directory, 'candidate.sv'), 'utf8')).toBe(source)
  expect((await inspectRun(directory)).state).toBe('TERMINAL')
  await generation.ctx.fiber.dispose()
  const approval = { generationDirectory: directory, reviewedSourceSha256: sha256(source) }
  const denied = await boot(root, 'verify-counter', 'unused', approval); await denied.run(1)
  expect(denied.processes).not.toHaveBeenCalled(); expect(denied.prepare).not.toHaveBeenCalled(); await denied.ctx.fiber.dispose()
  const mismatch = await boot(root, 'verify-counter', 'unused', { ...approval, reviewedSourceSha256: '0'.repeat(64) }, 'danger-full-access'); await mismatch.run(1)
  expect(mismatch.processes).not.toHaveBeenCalled(); expect(mismatch.prepare).not.toHaveBeenCalled(); await mismatch.ctx.fiber.dispose()
  const verified = await boot(root, 'verify-counter', 'Observed PASS; post-synthesis timing only.', approval, 'danger-full-access'); await verified.run(0)
  expect(verified.requests).toHaveLength(1); expect(verified.requests[0]?.tools).toEqual([])
  const summary = JSON.parse(await readFile(join(directory, 'end-to-end.json'), 'utf8'))
  expect(summary).toMatchObject({ candidates: 1, verification_rounds: 1, model_call_attempts: 2, automatic_retries: 0, automatic_repairs: 0, trust: 'reviewed_candidate', design_passed: true, full_os_isolation_verified: false })
  const verification = JSON.parse(await readFile(join(directory, 'verification.json'), 'utf8'))
  expect(verification.stages.every((stage: { trust: string }) => stage.trust === 'reviewed_candidate')).toBe(true)
  const events = await readFile(join(summary.feedback_run, 'events.jsonl'), 'utf8')
  expect(events).toContain(JSON.stringify(renderVerification(verification)).slice(1, -1))
  expect(JSON.stringify(verified.requests[0]?.messages)).not.toContain('PHASE1_COMPLETE')
  await verified.ctx.fiber.dispose()
  const repeated = await boot(root, 'verify-counter', 'unused', approval, 'danger-full-access'); await repeated.run(1)
  expect(repeated.processes).not.toHaveBeenCalled(); expect(repeated.prepare).not.toHaveBeenCalled()
})

it('retains a terminal extraction failure without retrying or executing', async () => {
  const root = await temporary(), app = await boot(root, 'generate-counter', '```sv\na\n```\n```sv\nb\n```')
  await app.run(1)
  expect(app.requests).toHaveLength(1); expect(app.processes).not.toHaveBeenCalled()
  const directory = join(root, (await readdir(root)).find(name => name.startsWith('run-'))!)
  expect(JSON.parse(await readFile(join(directory, 'generation.json'), 'utf8')).status).toBe('EXTRACTION_ERROR')
  expect((await inspectRun(directory)).state).toBe('TERMINAL')
})
