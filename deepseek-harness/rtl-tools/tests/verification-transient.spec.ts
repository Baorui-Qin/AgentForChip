import { mkdtemp, mkdir, readdir, rm } from 'node:fs/promises'
import type { PathLike } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { afterEach, expect, it, vi } from 'vitest'
import { VerificationRunner } from '../src/phase1/verification.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'

const probe = vi.hoisted(() => ({ path: '', code: '', seen: false }))
vi.mock('node:fs/promises', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs/promises')>()
  return { ...actual, async readdir(path: PathLike, ...args: unknown[]) {
    if (path === probe.path && !probe.seen) {
      probe.seen = true
      if (probe.code === 'ENOENT') await actual.rm(path, { recursive: true })
      throw Object.assign(new Error('Injected live directory scan ' + probe.code), { code: probe.code })
    }
    return Reflect.apply(actual.readdir, actual, [path, ...args])
  } }
})

const roots: string[] = [], contexts: Context[] = [], runners: VerificationRunner[] = []
afterEach(async () => {
  probe.path = ''; probe.seen = false
  for (const runner of runners.splice(0)) await runner.close()
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
it.each(['ENOENT', 'EACCES'])('handles a live child scan %s without weakening other filesystem failures', async code => {
  const root = await mkdtemp(join(tmpdir(), 'verification-transient-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const { config } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  config.outputRoot = root
  config.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  config.limits = { ...config.limits, timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192 }
  const runner = new VerificationRunner(ctx.subprocess, config, { compileMs: 5000, elaborateMs: 5000, simulationMs: 5000,
    totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 10, maxEventBytes: 65536 }); runners.push(runner)
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec,
    argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), '{}', ...spec.argv.slice(1)] }))
  const id = await runner.registerFixture('counter', { experiment_id: 'mock' as PhaseId, task_id: 'counter' as PhaseId, sample_id: 0, mode: 'agent' })
  probe.path = join(root, (await readdir(root))[0]!, 'volatile-child'); probe.code = code; probe.seen = false
  await mkdir(probe.path)
  const result = await runner.verify(id, new AbortController().signal, argv => argv)
  expect(probe.seen).toBe(true)
  expect(result.status).toBe(code === 'ENOENT' ? 'PASS' : 'TOOL_ERROR')
}, 30000)
