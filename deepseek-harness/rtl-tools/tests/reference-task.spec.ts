import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { afterEach, expect, it, vi } from 'vitest'
import * as Reference from '../src/reference/index.ts'
import { interfaceFromPrompt, runTask, type MockOptions } from '../src/reference/task.ts'

const roots: string[] = [], contexts: Context[] = []
const prompt = 'Implement a module named FreshModule with the following interface.\n - input clk\n - input data (8 bits)\n - output q (8 bits)\n'
const options: MockOptions = { outcome: 'stub', timeoutMs: 5000 }
afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
async function fixture(text = prompt) {
  const root = await mkdtemp(join(tmpdir(), 'rtl reference ')); roots.push(root)
  const task = join(root, 'unknown task'), out = join(root, 'new output')
  await mkdir(task); await writeFile(join(task, 'prompt.txt'), text)
  return { root, task, out }
}
async function trace(out: string) {
  return (await readFile(join(out, 'trace.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
}
async function boot(task: string, out: string, outcome: MockOptions['outcome'] = 'stub') {
  const ctx = new Context(); contexts.push(ctx)
  let start: (() => void) | undefined
  const exit = vi.fn()
  vi.spyOn(process.stdout, 'write').mockImplementation(() => true)
  vi.spyOn(process.stderr, 'write').mockImplementation(() => true)
  provideCmdline(ctx, { args: [task, out], exit, ready: { onReady(fn) { start = fn; return () => { start = undefined } } } })
  await ctx.plugin(Reference, { backend: 'mock', outcome, timeoutMs: 5000 })
  return { ctx, start: () => start!(), exit }
}

it('reads only prompt.txt, preserving the declared interface and explicitly labeling its snapshot as mock', async () => {
  const f = await fixture()
  await writeFile(join(f.task, 'interface.txt'), '')
  const result = await runTask([f.task, f.out], options, new AbortController().signal)
  expect(result.status).toBe('mock_candidate')
  expect(await readFile(join(f.out, 'solution.v'), 'utf8')).toMatchInlineSnapshot(`
    "// EXPLICIT MOCK: interface fixture only; not a model-generated solution.
    module FreshModule (
      input wire clk,
      input wire [7:0] data,
      output wire [7:0] q
    );
    assign q = 8'd0;
    endmodule
    "
  `)
  expect(await readFile(join(result.workDir, 'trace.jsonl'), 'utf8')).toBe(await readFile(join(f.out, 'trace.jsonl'), 'utf8'))
  expect(await readFile(join(result.workDir, 'prompt.txt'), 'utf8')).toBe(prompt)
  const events = await trace(f.out)
  expect(events.map(event => event.tool)).toEqual(['invocation', 'read_prompt', 'mock_generate', 'result'])
  expect(events.every(event => event.evidence === 'explicit_mock_protocol_only' && typeof event.ts === 'number')).toBe(true)
  expect(events.at(-1)).toMatchObject({ status: 'mock_candidate', rc: 0, real_model_calls: 0, graded: false })
})

it('ignores conflicting interface and adjacent judge assets rather than treating them as prompt authority', async () => {
  const f = await fixture()
  for (const name of ['interface.txt', 'ref.sv', 'tb.sv', 'task.json', 'solution.v']) await writeFile(join(f.task, name), 'SHOULD_NOT_BE_READ')
  await runTask([f.task, f.out], options, new AbortController().signal)
  expect(await readFile(join(f.out, 'solution.v'), 'utf8')).toContain('module FreshModule')
  expect(await readFile(join(f.out, 'trace.jsonl'), 'utf8')).not.toContain('SHOULD_NOT_BE_READ')
})

it('isolates repeated task names and refuses output reuse without changing existing evidence', async () => {
  const f = await fixture()
  const first = await runTask([f.task, f.out], options, new AbortController().signal)
  const before = await readFile(join(f.out, 'trace.jsonl'), 'utf8')
  const other = join(f.root, 'second output')
  const second = await runTask([f.task, other], { ...options, outcome: 'empty' }, new AbortController().signal)
  expect(first.workDir).not.toBe(second.workDir)
  expect(await readFile(join(other, 'solution.v'), 'utf8')).toBe('')
  await expect(runTask([f.task, f.out], options, new AbortController().signal)).rejects.toThrow('already exist')
  expect(await readFile(join(f.out, 'trace.jsonl'), 'utf8')).toBe(before)
})

it('allows the selftest run.log while claiming a new output directory', async () => {
  const f = await fixture()
  await mkdir(f.out); await writeFile(join(f.out, 'run.log'), 'driver log')
  expect((await runTask([f.task, f.out], options, new AbortController().signal)).exitCode).toBe(0)
  expect(await readFile(join(f.out, 'run.log'), 'utf8')).toBe('driver log')
})

it.each([
  ['empty', 'empty_answer', 0], ['error', 'internal_error', 1], ['timeout', 'timeout', 124],
] as const)('records %s separately and leaves an empty solution', async (outcome, status, exitCode) => {
  const f = await fixture()
  const result = await runTask([f.task, f.out], { outcome, timeoutMs: 100 }, new AbortController().signal)
  expect(result).toMatchObject({ status, exitCode })
  expect(await readFile(join(f.out, 'solution.v'), 'utf8')).toBe('')
  expect((await trace(f.out)).at(-1)).toMatchObject({ status, rc: exitCode, graded: false })
})

it.each(['', 'module named FreshModule\n - output q (zero bits)', 'module named FreshModule\n - output q\n - input q'])('records invalid prompt %j without publishing a partial candidate', async text => {
  const f = await fixture(text)
  expect(await runTask([f.task, f.out], options, new AbortController().signal)).toMatchObject({ status: 'invalid_input', exitCode: 2 })
  expect(await readFile(join(f.out, 'solution.v'), 'utf8')).toBe('')
})

it('records missing prompt.txt as invalid input', async () => {
  const f = await fixture()
  await rm(join(f.task, 'prompt.txt'))
  expect(await runTask([f.task, f.out], options, new AbortController().signal)).toMatchObject({ status: 'invalid_input', exitCode: 2 })
})

it.each([[], ['one'], ['one', 'two', 'three'], ['', 'two'], ['--bad', 'two']].map(args => ({ args })))('rejects invalid argv $args', async ({ args }) => {
  await expect(runTask(args, options, new AbortController().signal)).rejects.toThrow('Usage:')
})

it('rejects aliased task/output arguments without modifying prompt.txt', async () => {
  const f = await fixture()
  await expect(runTask([f.task, f.task], options, new AbortController().signal)).rejects.toThrow('must differ')
  expect(await readFile(join(f.task, 'prompt.txt'), 'utf8')).toBe(prompt)
})

it.each(['plain text', 'module named X', 'module named X\n - output q (0 bits)', 'module named X\n - output q (9007199254740992 bits)'])('does not silently accept unsupported interface %j', text => {
  expect(() => interfaceFromPrompt(text)).toThrow()
})

it('parses CRLF, one-bit defaults and inout without hardcoding TopModule', () => {
  expect(interfaceFromPrompt('module named Bus\r\n - inout io (1 bit)\r\n - output q (12 bits)')).toEqual({ module: 'Bus', ports: [{ name: 'io', direction: 'inout', width: 1 }, { name: 'q', direction: 'output', width: 12 }] })
})

it('runs at dsh readiness and exits with the recorded outcome', async () => {
  const f = await fixture(), s = await boot(f.task, f.out)
  expect(s.exit).not.toHaveBeenCalled(); s.start()
  await vi.waitFor(() => expect(s.exit).toHaveBeenCalledWith(0))
  expect((await trace(f.out)).at(-1)).toMatchObject({ status: 'mock_candidate' })
})

it('joins cancellation and records it separately from timeout when the profile is disposed', async () => {
  const f = await fixture(), s = await boot(f.task, f.out, 'timeout')
  s.start()
  await vi.waitFor(async () => expect((await trace(f.out)).some(event => event.tool === 'mock_generate')).toBe(true))
  await s.ctx.fiber.dispose()
  expect(s.exit).toHaveBeenCalledWith(130)
  expect((await trace(f.out)).at(-1)).toMatchObject({ status: 'cancelled', rc: 130 })
})

it('requires explicit mock configuration and bounded valid development limits', () => {
  const parse = Reference.Config as (value: unknown) => unknown
  for (const config of [{ outcome: 'stub', timeoutMs: 10 }, { backend: 'openai', outcome: 'stub', timeoutMs: 10 }, { backend: 'mock', outcome: 'unknown', timeoutMs: 10 }, { backend: 'mock', outcome: 'stub', timeoutMs: 0 }]) expect(() => parse(config)).toThrow()
})

it('preserves an existing case-variant solution filename', async () => {
  const f = await fixture()
  await mkdir(f.out); await writeFile(join(f.out, 'Solution.v'), 'prior answer')
  await expect(runTask([f.task, f.out], options, new AbortController().signal)).rejects.toThrow('already exist')
  expect(await readFile(join(f.out, 'Solution.v'), 'utf8')).toBe('prior answer')
})

it('admits only one concurrent writer to the same output', async () => {
  const f = await fixture()
  const runs = await Promise.allSettled([runTask([f.task, f.out], options, new AbortController().signal), runTask([f.task, f.out], options, new AbortController().signal)])
  expect(runs.filter(run => run.status === 'fulfilled')).toHaveLength(1)
  expect(runs.filter(run => run.status === 'rejected')).toHaveLength(1)
  expect((await trace(f.out)).filter(event => event.tool === 'result')).toHaveLength(1)
})
