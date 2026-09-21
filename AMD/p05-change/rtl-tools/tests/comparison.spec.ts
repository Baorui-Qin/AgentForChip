import { mkdtemp, readFile, readdir, rm, writeFile, chmod } from 'node:fs/promises'
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
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { afterEach, expect, it, vi } from 'vitest'
import * as Baseline from '../src/phase1/baseline.ts'
import * as Comparison from '../src/phase1/comparison.ts'
import * as Protocol from '../src/phase1/protocol.ts'
import { evaluationHash, generate, initializeExperiment, modelCall, type ExperimentSettings } from '../src/phase1/experiment.ts'
import { comparisonReport } from '../src/phase1/comparison-report.ts'
import { publish } from '../src/phase1/candidates.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import { sha256 } from '../src/phase1/snapshots.ts'

const roots: string[] = [], contexts: Context[] = []
const source = 'module TopModule(input clk, input reset, output reg [3:0] q); always @(posedge clk) if(reset) q<=0; else q<=q+1; endmodule'
afterEach(async () => { for (const ctx of contexts.splice(0)) await ctx.fiber.dispose(); for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); vi.restoreAllMocks() })
async function setup() {
  const root = await mkdtemp(join(tmpdir(), 'rtl-comparison-')); roots.push(root)
  const settings = (await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))).config
  settings.outputRoot = root; settings.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  const settingsFile = join(root, 'settings.json'); await writeFile(settingsFile, JSON.stringify(settings))
  const config: ExperimentSettings = { outputRoot: root, datasetRoot: root, settingsFile }
  vi.spyOn(Protocol, 'loadProtocol').mockResolvedValue({ system: 'Fixed base system.', user: 'Question: public counter task. Answer:', rules: ' Frozen domain rules.', publicSpec: 'Public counter task.', sha256: 'a'.repeat(64) })
  vi.spyOn(Protocol, 'evaluatorAssets').mockImplementation(async (_root, text) => ({ 'rtl/solution.sv': text, 'trusted/tb.sv': 'HIDDEN_TEST_SENTINEL', 'trusted/ref.sv': 'REFERENCE_SENTINEL', 'trusted/clock.xdc': 'CLOCK_SENTINEL' }))
  await writeFile(join(root, 'dataset-preflight.json'), JSON.stringify({ status: 'PASS', evidence: 'MOCK_ONLY', evaluation_sha256: (await evaluationHash(config)).hash }))
  return { root, config, ...(await initializeExperiment(config)) }
}
async function boot(s: Awaited<ReturnType<typeof setup>>, args: string[], baseline: boolean, response = '[BEGIN]' + source + '[DONE]', fake = {}) {
  const path = join(s.root, 'loader-' + contexts.length + '.json')
  await writeFile(path, JSON.stringify([{ name: 'llm' }, ...baseline ? [] : [{ name: 'subprocess' }, { name: 'projections' }, { name: 'policy', config: { mode: 'danger-full-access', workspaceRoot: s.root } }], { name: 'app', config: { ...s.config, ...baseline ? {} : { allowReviewedFullAccess: true } } }]))
  const ctx = new Context(); contexts.push(ctx); ctx.baseUrl = pathToFileURL(s.root).href + '/'
  let start: (() => void) | undefined
  const exit = vi.fn()
  provideCmdline(ctx, { args, exit, ready: { onReady(fn) { start = fn; return () => { start = undefined } } } })
  await ctx.plugin(Loader); ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([['llm', LlmRuntime], ['subprocess', LocalSubprocess], ['projections', Projections], ['policy', SandboxPolicy], ['app', baseline ? Baseline : Comparison]])
  ctx.loader.internal = { version: 'v2', async import(name: string) { if (!modules.has(name)) throw new Error('Unknown module'); return modules.get(name) } } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(path).href } }); await ctx.loader.await()
  const requests: GenerateOptions[] = []
  vi.spyOn(ctx.llm, 'prepareCall').mockImplementation(async config => ({ config, async *stream(options: GenerateOptions) {
    requests.push(options)
    if (response.startsWith('ERROR:')) { yield { type: 'finish', reason: { kind: 'error', failure: { code: response.slice(6), message: 'SECRET_SENTINEL' } } }; return }
    yield { type: 'block-start', index: 0, blockType: 'text' }; yield { type: 'text-delta', index: 0, text: response }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: response } }; yield { type: 'finish', reason: { kind: 'stop' } }
  } }) as unknown as PreparedLlmCall)
  if (!baseline) {
    const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
    vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify({ verdict: 'Mismatches: 0 in 420 samples', ...fake }), ...spec.argv.slice(1)] }))
  }
  return { ctx, requests, exit, async run(code: number) { start!(); await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(code), { timeout: 30000 }) } }
}
async function approve(s: Awaited<ReturnType<typeof setup>>, variant: Protocol.Variant, approved = true) {
  const dir = join(s.directory, variant), generation = JSON.parse(await readFile(join(dir, 'generation.json'), 'utf8'))
  await publish(dir, 'approval.json', JSON.stringify({ ...generation.candidate.candidate, approved, reviewed_at: new Date().toISOString(), note: 'MOCK review only' }))
  return generation
}

it('loads three isolated routes, performs 1/2/2 calls and reconstructs independent evidence without hidden-source leakage', async () => {
  const s = await setup(), requests: GenerateOptions[][] = []
  for (const variant of Protocol.variants) {
    const app = await boot(s, variant === 'baseline' ? ['generate', s.experiment_id] : ['generate', s.experiment_id, variant], variant === 'baseline')
    if (variant === 'baseline') { expect(app.ctx.get('agentLoop')).toBeUndefined(); expect(app.ctx.get('subprocess')).toBeUndefined(); expect(app.ctx.get('tools')).toBeUndefined() }
    await app.run(0); requests.push(app.requests); await app.ctx.fiber.dispose()
  }
  expect(requests.map(r => r.length)).toEqual([1, 1, 1])
  expect(requests[0]![0]?.system).toBe(requests[1]![0]?.system)
  expect(requests[0]![0]?.messages.map(message => message.content)).toEqual(requests[1]![0]?.messages.map(message => message.content))
  expect(requests[2]![0]?.system).toBe(requests[0]![0]?.system + ' Frozen domain rules.')
  const feedbacks: GenerateOptions[] = []
  for (const variant of Protocol.variants) {
    await approve(s, variant)
    const app = await boot(s, ['verify', s.experiment_id, variant], false, 'Observed pass; post-synthesis only.')
    await app.run(0); expect(app.requests).toHaveLength(variant === 'baseline' ? 0 : 1); feedbacks.push(...app.requests)
    const commands = JSON.parse(await readFile(join(s.directory, variant, 'verification.json'), 'utf8'))
    const argv = JSON.parse(await readFile(join(commands.artifacts, 'build/commands.json'), 'utf8'))
    expect(argv.compile.join(' ')).toContain('ref.sv'); expect(argv.simulation).toContain('-sv_seed')
    const synthDir = join(commands.artifacts, 'build', (await readdir(join(commands.artifacts, 'build'))).find(name => name.startsWith('.rtl-synth-'))!)
    const tcl = await readFile(join(synthDir, 'synthesis.tcl'), 'utf8'); expect(tcl).not.toContain('ref.sv'); expect(tcl).not.toContain('tb.sv')
    await app.ctx.fiber.dispose()
  }
  expect(feedbacks[0]?.system).toBe(feedbacks[1]?.system)
  const all = JSON.stringify([...requests.flat(), ...feedbacks]); expect(all).not.toContain('HIDDEN_TEST_SENTINEL'); expect(all).not.toContain('REFERENCE_SENTINEL'); expect(all).not.toContain('CLOCK_SENTINEL')
  expect(JSON.stringify(feedbacks)).not.toContain('Frozen domain rules')
  const report = await comparisonReport(s.config, s.experiment_id)
  expect(report.rows.map(row => row.calls.generation + row.calls.interpretation)).toEqual([1, 2, 2])
  expect(report.rows.every(row => row.final_verified)).toBe(true)
  expect(report.rows.every(row => row.source_sha256 === row.exported_sha256)).toBe(true)
  expect(report.rows.map(row => [row.variant_id, row.generation, ...Object.values(row.stages), row.interpretation, row.final_verified, row.calls.generation, row.calls.interpretation].join('|')).join('\n')).toMatchInlineSnapshot(`
    "baseline|AWAITING_REVIEW|PASS|PASS|PASS|PASS|NOT_APPLICABLE|true|1|0
    agent_base|AWAITING_REVIEW|PASS|PASS|PASS|PASS|COMPLETE|true|1|1
    agent_domain|AWAITING_REVIEW|PASS|PASS|PASS|PASS|COMPLETE|true|1|1"
  `)
  const repeated = await boot(s, ['verify', s.experiment_id, 'agent_base'], false); await repeated.run(1); expect(repeated.requests).toHaveLength(0); expect(repeated.ctx.subprocess.spawn).not.toHaveBeenCalled()
})

it('reports an attached failed evaluator preflight without inventing candidate failures or API usage', async () => {
  const s = await setup()
  await publish(s.directory, 'preflight.json', JSON.stringify({ status: 'FAIL', evaluation_sha256: (await evaluationHash(s.config)).hash, evidence: 'MOCK_ONLY' }))
  const report = await comparisonReport(s.config, s.experiment_id)
  expect(report.execution_blocked).toContain('preflight failed')
  expect(report.rows.map(row => [row.generation, row.calls.generation, row.tokens.generation, row.checks])).toEqual(Array(3).fill(['NOT_RUN', 0, null, null]))
})

it('retains invalid output and cannot regenerate a claimed baseline', async () => {
  const s = await setup(), app = await boot(s, ['generate', s.experiment_id], true, 'empty prose')
  await app.run(1); expect(app.requests).toHaveLength(1); await app.ctx.fiber.dispose()
  const retry = await boot(s, ['generate', s.experiment_id], true); await retry.run(1); expect(retry.requests).toHaveLength(0)
  expect((await comparisonReport(s.config, s.experiment_id)).rows[0]?.extraction_error).toBe('INVALID_OUTPUT')
})

it('blocks absent preflight before requesting generation and rejects cross-route approval', async () => {
  const s = await setup(); await rm(join(s.root, 'dataset-preflight.json'))
  const app = await boot(s, ['generate', s.experiment_id], true); await app.run(1); expect(app.requests).toHaveLength(0)
  await writeFile(join(s.root, 'dataset-preflight.json'), JSON.stringify({ status: 'PASS', evaluation_sha256: (await evaluationHash(s.config)).hash }))
  const result = await generate(app.ctx.llm, s.config, s.experiment_id, 'baseline', new AbortController().signal)
  expect(result.error).toBeNull(); const generated = await approve(s, 'baseline')
  await expect(Comparison.reviewedCandidate(join(s.directory, 'baseline'), s.experiment_id, 'agent_base', generated.candidate.candidate.evaluation_sha256)).rejects.toThrow('identity')
})

it('freezes effective provider configuration and does not dispatch when it drifts', async () => {
  const s = await setup(), app = await boot(s, ['generate', s.experiment_id], true); await app.run(0)
  vi.spyOn(app.ctx.llm, 'prepareCall').mockResolvedValue({ config: { provider: 'deepseek-official', model: 'deepseek-flash', maxTokens: 2048, temperature: 1 }, stream: vi.fn() } as unknown as PreparedLlmCall)
  const result = await modelCall(app.ctx.llm, join(s.directory, 'agent_base'), s.experiment_id, 'agent_base', 'generation', { system: '', user: 'public' }, new AbortController().signal)
  expect(result.value.error?.category).toBe('configuration'); expect(result.value.dispatched).toBe(false)
})

it('does not export a changed snapshot or an old successful source under a new hash', async () => {
  const s = await setup(), gen = await boot(s, ['generate', s.experiment_id], true); await gen.run(0); await gen.ctx.fiber.dispose()
  await approve(s, 'baseline'); const run = await boot(s, ['verify', s.experiment_id, 'baseline'], false); await run.run(0)
  const receipt = JSON.parse(await readFile(join(s.directory, 'baseline/verification.json'), 'utf8'))
  const snapshot = join(receipt.artifacts, (await readdir(receipt.artifacts)).find(name => name.startsWith('snapshot-'))!)
  await chmod(join(snapshot, 'rtl/solution.sv'), 0o600); await writeFile(join(snapshot, 'rtl/solution.sv'), source + ' ')
  const assets = await Protocol.evaluatorAssets(s.root, source)
  await expect(Comparison.exportVerified(join(s.directory, 'baseline'), receipt.artifacts, sha256(source), assets)).rejects.toThrow('changed')
  await expect(Comparison.exportVerified(join(s.directory, 'baseline'), receipt.artifacts, '0'.repeat(64), assets)).rejects.toThrow('mismatch')
})

it.each(['AUTH', 'TRANSPORT', 'TIMEOUT'])('retains a %s generation failure with one attempt and no candidate', async code => {
  const s = await setup(), app = await boot(s, ['generate', s.experiment_id], true, 'ERROR:' + code)
  await app.run(1); expect(app.requests).toHaveLength(1)
  const data = await readFile(join(s.directory, 'baseline/generation.json'), 'utf8')
  expect(data).not.toContain('SECRET_SENTINEL'); expect(JSON.parse(data).candidate).toBeNull()
  expect((await comparisonReport(s.config, s.experiment_id)).rows[0]?.calls.generation).toBe(1)
})

it('keeps confirmed verification when interpretation fails, without a second attempt', async () => {
  const s = await setup(), gen = await boot(s, ['generate', s.experiment_id, 'agent_base'], false); await gen.run(0); await gen.ctx.fiber.dispose()
  await approve(s, 'agent_base')
  const verify = await boot(s, ['verify', s.experiment_id, 'agent_base'], false, 'ERROR:TRANSPORT'); await verify.run(1)
  expect(verify.requests).toHaveLength(1)
  const row = (await comparisonReport(s.config, s.experiment_id)).rows[1]!
  expect(row.final_verified).toBe(true); expect(row.interpretation).toBe('FAILED'); expect(row.calls).toEqual({ generation: 1, interpretation: 1, retries: 0 })
})

it.each(['compile', 'simulation', 'synthesis'])('preserves a %s design failure without feedback repairs', async stage => {
  const s = await setup(), gen = await boot(s, ['generate', s.experiment_id, 'agent_base'], false); await gen.run(0); await gen.ctx.fiber.dispose()
  await approve(s, 'agent_base')
  const verify = await boot(s, ['verify', s.experiment_id, 'agent_base'], false, 'Observed failure.', stage === 'simulation' ? { verdict: 'Mismatches: 3 in 20 samples' } : { error: stage })
  await verify.run(1); expect(verify.requests).toHaveLength(1)
  const row = (await comparisonReport(s.config, s.experiment_id)).rows[1]!
  expect(row.final_verified).toBe(false); expect(row.stages[stage]).toBe('FAIL'); expect(row.interpretation).toBe('COMPLETE')
  expect(row.source_sha256).toBe(row.exported_sha256)
})

it('preserves a rejected review without EDA execution or interpretation', async () => {
  const s = await setup(), gen = await boot(s, ['generate', s.experiment_id, 'agent_base'], false); await gen.run(0); await gen.ctx.fiber.dispose()
  await approve(s, 'agent_base', false)
  const verify = await boot(s, ['verify', s.experiment_id, 'agent_base'], false); await verify.run(1)
  expect(verify.requests).toHaveLength(0); expect(verify.ctx.subprocess.spawn).not.toHaveBeenCalled()
  expect((await comparisonReport(s.config, s.experiment_id)).rows[1]?.approval).toBe('REJECTED')
})

it('does not authorize generation after a trusted-testbench preflight compilation failure', async () => {
  const s = await setup(); await rm(join(s.root, 'dataset-preflight.json'))
  const app = await boot(s, ['preflight'], false, 'Not requested.', { error: 'compile', trustedError: true })
  await app.run(1); expect(app.requests).toHaveLength(0)
  const files = await readdir(s.root)
  expect(files).not.toContain('dataset-preflight.json')
  const receipt = JSON.parse(await readFile(join(s.root, files.find(name => name.startsWith('preflight-'))!), 'utf8'))
  expect(receipt.status).toBe('FAIL')
  expect(receipt.results.map((run: any) => [run.stages[0].status, run.stages[0].failure_domain, run.stages[1].status])).toEqual([
    ['TOOL_ERROR', 'environment', 'SKIPPED'], ['TOOL_ERROR', 'environment', 'SKIPPED'],
  ])
})

it('unloading joins the live dataset process tree and never dispatches interpretation', async () => {
  const s = await setup(), gen = await boot(s, ['generate', s.experiment_id, 'agent_base'], false); await gen.run(0); await gen.ctx.fiber.dispose()
  await approve(s, 'agent_base')
  const verify = await boot(s, ['verify', s.experiment_id, 'agent_base'], false, 'Not requested.', { hang: 'simulation' })
  const pending = verify.run(1)
  let childFile = ''
  await vi.waitFor(async () => {
    const run = (await readdir(s.root)).find(name => name.startsWith('run-'))!
    childFile = join(s.root, run, 'child.pid'); expect(await readFile(childFile, 'utf8')).toMatch(/^\d+$/)
  }, { timeout: 15000 })
  await verify.ctx.fiber.dispose(); await pending
  const pid = Number(await readFile(childFile, 'utf8'))
  expect(() => process.kill(pid, 0)).toThrow()
  expect(verify.requests).toHaveLength(0)
})
