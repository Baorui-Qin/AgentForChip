import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load, JSON_SCHEMA } from 'js-yaml'
import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { readDoctorConfig, runDoctor } from '../src/phase1/doctor.ts'

let root: string | undefined
let ctx: Context | undefined
afterEach(async () => {
  await ctx?.fiber.dispose()
  if (root) await rm(root, { recursive: true, force: true })
  ctx = undefined
  root = undefined
})

async function setup(scenario: string) {
  root = await mkdtemp(join(tmpdir(), 'doctor-fixture-'))
  await mkdir(join(root, 'rtl-tools'))
  await writeFile(join(root, 'pnpm-lock.yaml'), 'fixture lock')
  await writeFile(join(root, 'rtl-tools', 'config.yaml'), 'fixture: true')
  const input = load(await readFile(new URL('../phase1/configs/dev.yaml', import.meta.url), 'utf8'), { schema: JSON_SCHEMA }) as Record<string, unknown>
  const configPath = join(root, 'dev.yaml')
  await writeFile(configPath, JSON.stringify({ ...input, repositoryRoot: root, outputRoot: root,
    tools: { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath } }))
  const { config } = await readDoctorConfig(configPath)
  ctx = new Context()
  await ctx.plugin(LocalSubprocess)
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const spy = vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec,
    argv: [process.execPath, fileURLToPath(new URL('./fake-doctor.mjs', import.meta.url)), scenario, ...spec.argv.slice(1)] }))
  return { ctx, spy, config: { ...config, repositoryRoot: root, outputRoot: root,
    tools: { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath },
    limits: { ...config.limits, timeoutMs: 5000 } } }
}

it.each([
  ['normal', true, 'PASS'], ['version-mismatch', false, 'SKIPPED'], ['missing-part', false, 'FAIL'], ['missing-netlist', false, 'PASS'],
] as const)('preflight %s records observed tools and fails closed before dependent work', async (scenario, edaReady, partStatus) => {
  const setupResult = await setup(scenario)
  const result = await runDoctor(setupResult.ctx.subprocess, setupResult.config, 'b'.repeat(64), new AbortController().signal, argv => argv)
  expect(result.eda_ready).toBe(edaReady)
  expect(result.status).toBe(edaReady ? 'MODEL_NOT_READY' : 'EDA_NOT_READY')
  expect(result.part_query.status).toBe(partStatus)
  const lock = JSON.parse(await readFile(join(result.directory, 'environment.lock.json'), 'utf8'))
  expect(lock.repository.commit).toBe('a'.repeat(40))
  expect(lock.repository.extension_sha256['rtl-tools/config.yaml']).toMatch(/^[a-f0-9]{64}$/)
  expect(lock.configuration.sha256).toBe('b'.repeat(64))
  expect(lock.host.inference_backend.version).toBeNull()
  expect(lock.gates.G0).toBe('NOT_ACCEPTED')
  expect(JSON.parse(await readFile(join(result.directory, 'doctor.json'), 'utf8'))).toEqual(result)
  if (scenario === 'version-mismatch') expect(setupResult.spy.mock.calls.every(([spec]) => !spec.argv.includes('-mode'))).toBe(true)
})

it('retains policy refusal as an environment failure and never spawns an unconfined fallback', async () => {
  const setupResult = await setup('normal')
  const result = await runDoctor(setupResult.ctx.subprocess, setupResult.config, 'b'.repeat(64), new AbortController().signal, () => { throw new Error('sandbox refused') })
  expect(setupResult.spy).not.toHaveBeenCalled()
  expect(result.eda_ready).toBe(false)
  expect(result.versions.vivado?.probe.error).toBe('sandbox refused')
  expect(result.synthesis).toBeNull()
})
