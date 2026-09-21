import { mkdtemp, readFile, writeFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { resolveConfig, runSimulation, within } from '../src/runner.ts'
import type { SimulationConfig } from '../src/runner.ts'

const fixture = fileURLToPath(new URL('./fake-eda.mjs', import.meta.url))
const roots: string[] = []
const contexts: Context[] = []

afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
})

async function setup(spec: object = {}) {
  const root = await mkdtemp(join(tmpdir(), 'rtl-simulation-'))
  roots.push(root)
  const source = join(root, 'test bench.json')
  await writeFile(source, JSON.stringify(spec))
  const ctx = new Context()
  contexts.push(ctx)
  await ctx.plugin(LocalSubprocess)
  const config: SimulationConfig = resolveConfig({
    workspaceRoot: root, top: 'fifo_tb', sources: [source], includeDirs: [],
    iverilog: process.execPath, vvp: process.execPath,
    timeoutMs: 5000, graceMs: 200, maxDiagnostics: 3, maxLineChars: 200,
    maxLogBytes: 1000, passMarker: 'PASS', failMarker: 'FAIL',
  })
  const commands: string[][] = []
  const externalFixture = (argv: readonly string[]) => {
    commands.push([...argv])
    return [process.execPath, fixture, ...argv.slice(1)]
  }
  return { root, source, ctx, config, commands, externalFixture }
}

describe('managed compile and simulation execution', () => {
  it('runs ordered argv in unique directories and leaves source bytes unchanged', async () => {
    const s = await setup({ warning: true })
    const before = await readFile(s.source)
    const result = await runSimulation(s.ctx.subprocess, s.config, new AbortController().signal, s.externalFixture)
    expect(result.status).toBe('PASS')
    expect(result.runs.map(run => run.stage)).toEqual(['compile', 'simulation'])
    expect(result.warnings).toHaveLength(1)
    expect(s.commands[0]).toContain('-g2012')
    expect(s.commands[0]?.at(-1)).toBe(s.source)
    expect(s.commands[1]?.[1]).toBe('-N')
    expect(await readFile(s.source)).toEqual(before)
    expect(JSON.parse(await readFile(join(result.artifactsDir, 'result.json'), 'utf8')).status).toBe('PASS')
    const second = await runSimulation(s.ctx.subprocess, s.config, new AbortController().signal, s.externalFixture)
    expect(second.artifactsDir).not.toBe(result.artifactsDir)
  })

  it('stops at compile failure and retains the first error rather than the noise tail', async () => {
    const s = await setup({ compileError: true })
    const result = await runSimulation(s.ctx.subprocess, s.config, new AbortController().signal, s.externalFixture)
    expect(result).toMatchObject({ status: 'FAIL', stage: 'compile' })
    expect(s.commands).toHaveLength(1)
    expect(result.errors[0]).toMatchObject({ line: 27, type: 'syntax_error' })
    expect(result.runs[0]?.logTruncated).toBe(true)
    expect((await stat(result.runs[0]!.stderrLog)).size).toBe(1000)
  })

  it.each([
    [{ output: '' }, 'UNCONFIRMED'],
    [{ output: 'NOT PASS\n' }, 'UNCONFIRMED'],
    [{ output: 'PASS\nFAIL\n' }, 'FAIL'],
    [{ output: 'PASS\n', stderr: 'ERROR: tb.sv:12: mismatch\n' }, 'FAIL'],
    [{ output: 'PASS\n', exitCode: 1 }, 'FAIL'],
    [{ output: 'PASS\n' + 'x'.repeat(10000) }, 'UNCONFIRMED'],
    [{ output: 'PASS\n' + 'INFO noise\n'.repeat(4000) }, 'PASS'],
  ] as const)('reports %j as %s', async (spec, expected) => {
    const s = await setup(spec)
    const result = await runSimulation(s.ctx.subprocess, s.config, new AbortController().signal, s.externalFixture)
    expect(result.status).toBe(expected)
    expect(result.runs.at(-1)!.outputTail.length).toBeLessThanOrEqual(s.config.maxLineChars)
  })

  it('reports timeout independently and waits for process cleanup', async () => {
    const s = await setup({ hang: true })
    s.config.timeoutMs = 1000
    const result = await runSimulation(s.ctx.subprocess, s.config, new AbortController().signal, s.externalFixture)
    expect(result).toMatchObject({ status: 'FAIL', stage: 'simulation' })
    expect(result.runs[1]).toMatchObject({ timedOut: true, aborted: false })
  })

  it('honors cancellation before spawn and during a live simulation', async () => {
    const s = await setup({ hang: true })
    const pre = AbortSignal.abort()
    await expect(runSimulation(s.ctx.subprocess, s.config, pre, s.externalFixture)).rejects.toThrow()
    expect(s.commands).toHaveLength(0)
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 1200)
    try {
      const result = await runSimulation(s.ctx.subprocess, s.config, controller.signal, s.externalFixture)
      expect(result.status).toBe('FAIL')
      expect(result.runs.at(-1)).toMatchObject({ aborted: true, timedOut: false })
    } finally { clearTimeout(timer) }
  })

  it('fails loudly for missing executables, sources and sandbox refusal', async () => {
    const s = await setup()
    await expect(runSimulation(s.ctx.subprocess, { ...s.config, vvp: 'nonexistent-rtl-executable-123' }, new AbortController().signal, s.externalFixture)).rejects.toThrow()
    await expect(runSimulation(s.ctx.subprocess, { ...s.config, sources: ['missing.sv'] }, new AbortController().signal, s.externalFixture)).rejects.toThrow()
    await expect(runSimulation(s.ctx.subprocess, s.config, new AbortController().signal, () => { throw new Error('sandbox unavailable') })).rejects.toThrow('sandbox unavailable')
  })

  it('rejects invalid configuration and outside-root paths', async () => {
    const { config, root } = await setup()
    for (const patch of [{ top: '-s injected' }, { sources: [] }, { timeoutMs: 0 }, { maxDiagnostics: NaN }, { failMarker: 'PASS' }, { passMarker: 'PASS\n' }, { iverilog: '' }]) {
      expect(() => resolveConfig({ ...config, ...patch })).toThrow()
    }
    expect(within(root, join(root, 'child'))).toBe(true)
    expect(within(root, root + '-sibling')).toBe(false)
    expect(within(root, resolveConfig(config).workspaceRoot)).toBe(true)
  })
})

describe('real Icarus installation', () => {
  it.skipIf(!process.env.RTL_IVERILOG || !process.env.RTL_VVP)('compiles and verifies the supplied counter example', async () => {
    const s = await setup()
    const result = await runSimulation(s.ctx.subprocess, {
      ...s.config,
      iverilog: process.env.RTL_IVERILOG!, vvp: process.env.RTL_VVP!,
      top: 'counter_tb',
      sources: [
        fileURLToPath(new URL('../example/rtl/counter.sv', import.meta.url)),
        fileURLToPath(new URL('../example/tb/counter_tb.sv', import.meta.url)),
      ],
    }, new AbortController().signal, argv => argv)
    expect(result.status, JSON.stringify(result)).toBe('PASS')
  })
})
