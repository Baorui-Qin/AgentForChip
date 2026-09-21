import { mkdtemp, readFile, writeFile, rm, stat, readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { resolveSynthesisConfig, runSynthesis, tclWord, vivadoArgv } from '../src/synthesis.ts'
import type { SynthesisConfig } from '../src/synthesis.ts'

const roots: string[] = []
const contexts: Context[] = []
const fixture = fileURLToPath(new URL('./fake-vivado.mjs', import.meta.url))

afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
})

async function setup(spec: object = {}) {
  const root = await mkdtemp(join(tmpdir(), 'rtl-synthesis-'))
  roots.push(root)
  await writeFile(join(root, 'source.json'), JSON.stringify(spec))
  const ctx = new Context()
  contexts.push(ctx)
  await ctx.plugin(LocalSubprocess)
  const config: SynthesisConfig = resolveSynthesisConfig({ workspaceRoot: root, top: 'top',
    sources: ['source.json'], includeDirs: [], xdcFiles: [], vivado: process.execPath,
    part: 'xczu3eg-sbva484-1-e', timeoutMs: 5000, threads: 4, maxReportBytes: 10000,
    graceMs: 200, maxLogBytes: 1000, maxDiagnostics: 3, maxLineChars: 200 })
  const argv: string[][] = []
  const confine = (args: readonly string[]) => { argv.push([...args]); return [process.execPath, fixture, ...args.slice(1)] }
  return { ctx, config, root, confine, argv }
}

it('uses separate report processes, unique artifacts and preserves source bytes', async () => {
  const s = await setup({ warning: true, noise: true, timingViolated: true })
  const source = await readFile(join(s.root, 'source.json'))
  const result = await runSynthesis(s.ctx.subprocess, s.config, new AbortController().signal, s.confine)
  expect(result).toMatchObject({ success: true, synthesizable: true, stage: 'report', resources: { lut: 2, ff: 4, bram: 0.5, dsp: 0 }, timing: { wns: -0.125 } })
  expect(result.runs.map(run => run.stage)).toEqual(['synthesis', 'report'])
  expect(result.warnings[0]?.severity).toBe('CRITICAL WARNING')
  expect(result.warnings).toContainEqual(expect.objectContaining({ type: 'timing_constraints_not_met' }))
  expect((await stat(result.runs[0]!.stdoutLog)).size).toBe(1000)
  expect(result.runs[0]?.logTruncated).toBe(true)
  expect(await readFile(join(s.root, 'source.json'))).toEqual(source)
  expect(JSON.parse(await readFile(join(result.artifactsDir, 'result.json'), 'utf8')).success).toBe(true)
  const script = await readFile(join(result.artifactsDir, 'synthesis.tcl'), 'utf8')
  expect(script).toContain('synth_design -top "top" -part "xczu3eg-sbva484-1-e"')
  expect(script).not.toContain('read_xdc')
  expect((await runSynthesis(s.ctx.subprocess, s.config, new AbortController().signal, s.confine)).artifactsDir).not.toBe(result.artifactsDir)
})

it.each([
  [{ synthError: true }, false, false, 'synthesis'],
  [{ synthError: true, exitCode: 0 }, false, false, 'synthesis'],
  [{ environment: true }, false, null, 'synthesis'],
  [{ exitCode: 2 }, false, null, 'synthesis'],
  [{ missingArtifact: true }, false, null, 'synthesis'],
  [{ longLine: true }, false, null, 'synthesis'],
  [{ reportError: true }, false, true, 'report'],
  [{ missingReport: true }, false, true, 'report'],
  [{ badReport: true }, false, true, 'report'],
  [{ badTiming: true }, false, true, 'report'],
  [{ noClocks: true }, true, true, 'report'],
  [{ noPaths: true }, true, true, 'report'],
] as const)('classifies %j independently from report success', async (spec, success, synthesizable, stage) => {
  const s = await setup(spec)
  const result = await runSynthesis(s.ctx.subprocess, s.config, new AbortController().signal, s.confine)
  expect(result).toMatchObject({ success, synthesizable, stage })
  expect(s.argv).toHaveLength(stage === 'synthesis' ? 1 : 2)
  if ('noClocks' in spec || 'noPaths' in spec) expect(result.timing.wns).toBeNull()
})

it.each(['synthesis', 'report'])('times out %s, preserving prior evidence, and reaps descendants', async hangStage => {
  const s = await setup({ hang: true, hangStage })
  const result = await runSynthesis(s.ctx.subprocess, { ...s.config, timeoutMs: 1200 }, new AbortController().signal, s.confine)
  expect(result).toMatchObject({ success: false, synthesizable: hangStage === 'synthesis' ? null : true, stage: hangStage })
  expect(result.runs.at(-1)).toMatchObject({ timedOut: true, aborted: false })
  const child = Number(await readFile(join(result.artifactsDir, 'child.pid'), 'utf8'))
  expect(() => process.kill(child, 0)).toThrow()
})

it('cancels before spawn and while a process is live', async () => {
  const s = await setup({ hang: true })
  await expect(runSynthesis(s.ctx.subprocess, s.config, AbortSignal.abort(), s.confine)).rejects.toThrow()
  expect(s.argv).toHaveLength(0)
  const controller = new AbortController()
  const pending = runSynthesis(s.ctx.subprocess, s.config, controller.signal, s.confine)
  let runDir = ''
  await expect.poll(async () => {
    runDir = (await readdir(s.root)).find(name => name.startsWith('.rtl-synth-')) ?? ''
    return runDir && await readFile(join(s.root, runDir, 'child.pid'), 'utf8').catch(() => '')
  }).toBeTruthy()
  controller.abort()
  const result = await pending
  expect(result).toMatchObject({ success: false, synthesizable: null })
  expect(result.runs[0]).toMatchObject({ aborted: true, timedOut: false })
  const child = Number(await readFile(join(result.artifactsDir, 'child.pid'), 'utf8'))
  expect(() => process.kill(child, 0)).toThrow()
})

it('rejects missing dependencies and sandbox refusal without launching a command', async () => {
  const s = await setup()
  await expect(runSynthesis(s.ctx.subprocess, { ...s.config, sources: ['missing.sv'] }, new AbortController().signal, s.confine)).rejects.toThrow()
  await expect(runSynthesis(s.ctx.subprocess, { ...s.config, vivado: 'missing-vivado-123' }, new AbortController().signal, s.confine)).rejects.toThrow()
  await expect(runSynthesis(s.ctx.subprocess, s.config, new AbortController().signal, () => { throw new Error('sandbox refused') })).rejects.toThrow('sandbox refused')
  expect(s.argv).toHaveLength(0)
})

it('does not replace oversized reports with zero resource counts', async () => {
  const s = await setup()
  const result = await runSynthesis(s.ctx.subprocess, { ...s.config, maxReportBytes: 50 }, new AbortController().signal, s.confine)
  expect(result).toMatchObject({ success: false, synthesizable: true, resources: { lut: null, ff: null, bram: null, dsp: null }, timing: { reason: 'report_unavailable' } })
})

it('rejects invalid configuration and quotes Tcl and Windows arguments explicitly', async () => {
  const s = await setup()
  for (const patch of [{ top: 'tb; exit' }, { sources: [] }, { timeoutMs: 0 }, { threads: NaN }, { part: '-part; exit' }, { xdcFiles: ['a\nb'] }]) {
    expect(() => resolveSynthesisConfig({ ...s.config, ...patch })).toThrow()
  }
  expect(tclWord('D:\\path with spaces\\$x[0]{a}".sv')).toBe('"D:\\\\path with spaces\\\\\\$x\\[0\\]\\{a\\}\\".sv"')
  expect(vivadoArgv('/tools/vivado', ['-mode', 'batch'], 'linux')).toEqual(['/tools/vivado', '-mode', 'batch'])
  expect(vivadoArgv('D:/Vivado/bin/vivado.bat', ['-source', 'D:/my work/run.tcl'], 'win32', 'cmd.exe').slice(0, 5)).toEqual(['cmd.exe', '/d', '/v:off', '/c', 'call'])
  for (const path of ['a%PATH%', 'a&whoami', 'a"b', 'a!b']) expect(() => vivadoArgv('vivado.bat', [path], 'win32', 'cmd.exe')).toThrow()
})
