import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Context } from '@deepseek-ai/cordis'
import LlmRuntime, { type StreamChunk } from '@deepseek-ai/dsh-llm'
import SessionStore from '@deepseek-ai/dsh-session'
import SessionProjection from '@deepseek-ai/dsh-session-projection'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import Agents from '@deepseek-ai/dsh-agent'
import AgentLoop from '@deepseek-ai/dsh-agent-loop'
import { afterEach, expect, it, vi } from 'vitest'
import { MockAdapter, textResponse, toolCallResponse } from '../../packages/core/agent-loop/tests/mock-adapter.ts'
import { createSolver, skill, type SolverConfig } from '../src/reference/solver.ts'
import { guardStream } from '../src/reference/stream-guard.ts'
import { validateSource } from '../src/reference/checks.ts'
import { interfaceFromPrompt, runTask } from '../src/reference/task.ts'
import { relayRequest } from '../src/reference/relay.ts'

const roots: string[] = [], contexts: Context[] = []
const prompt = 'Implement a module named UnregisteredLogic.\n - input a\n - output z\nOutput the complement of a.'
const source = 'module UnregisteredLogic(input a, output z); assign z = ~a; endmodule\n'
const config: SolverConfig = { provider: 'arbitrary-route', model: 'fresh-model', maxCalls: 4, maxTokens: 256,
  maxRequestBytes: 32768, maxResponseBytes: 65536, temperature: 0,
  checks: { xvlog: 'unavailable-test-only', vivado: 'unavailable-test-only', part: 'xczu3eg-sbva484-1-e', threads: 1,
    timeoutMs: 1000, graceMs: 100, maxLogBytes: 4096, maxLineChars: 400, maxReportBytes: 4096, maxDiagnostics: 5, maxSourceBytes: 65536 } }
afterEach(async () => {
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
})
async function setup(script: ConstructorParameters<typeof MockAdapter>[0], overrides: Partial<SolverConfig> = {}) {
  const root = await mkdtemp(join(tmpdir(), 'rtl solver ')); roots.push(root)
  const task = join(root, 'unknown renamed task'), out = join(root, 'output')
  await mkdir(task); await writeFile(join(task, 'prompt.txt'), prompt)
  for (const file of ['ref.sv', 'tb.sv', 'task.json', 'solution.v', 'interface.txt']) await writeFile(join(task, file), 'FORBIDDEN_SENTINEL')
  const ctx = new Context(); contexts.push(ctx)
  await ctx.plugin(LlmRuntime); await ctx.plugin(SessionStore); await ctx.plugin(SessionProjection)
  await ctx.plugin(SystemPrompt, { personaPrefix: '', includeHarnessIdentity: false, includeRuntimeContext: false })
  await ctx.plugin(Tools); await ctx.plugin(Agents); await ctx.plugin(AgentLoop, { agents: [] })
  const adapter = new MockAdapter(script)
  ctx.llm.registerAdapter(['arbitrary-route'], adapter)
  const checker = vi.fn(async () => ({ syntax: true, synthesis: true, graded: false }))
  const solver = createSolver(ctx, { ...config, ...overrides }, checker)
  return { root, task, out, ctx, adapter, checker, run: (timeoutMs = 1000, signal = new AbortController().signal) => runTask([task, out], { outcome: 'stub', timeoutMs }, signal, solver) }
}
async function chunks(input: StreamChunk[], limit = 65536) {
  async function* feed() { yield* input }
  const result: StreamChunk[] = []
  for await (const chunk of guardStream(feed(), limit, async () => {})) result.push(chunk)
  return result
}

it('runs an unknown name with only one candidate tool and a fully logged public request', async () => {
  const f = await setup([toolCallResponse('call', 'check_rtl', { source }), textResponse('Candidate checked; not graded.')])
  const result = await f.run()
  expect(result.status).toBe('candidate_ungraded')
  expect(f.checker).toHaveBeenCalledTimes(1)
  expect(f.adapter.requests).toHaveLength(2)
  expect(f.adapter.requests[0]!.tools!.map(tool => tool.name)).toEqual(['check_rtl'])
  expect(f.adapter.requests.every(request => request.provider === 'arbitrary-route' && request.reasoningEffort === undefined)).toBe(true)
  const serialized = JSON.stringify(f.adapter.requests)
  expect(serialized).not.toContain('FORBIDDEN_SENTINEL')
  expect(serialized).not.toMatch(/deepseek-official|VerilogEval|campaign/)
  expect(serialized).toContain(skill)
  expect(await readFile(join(f.out, 'solution.v'), 'utf8')).toBe(source)
  const session = await readFile(join(result.workDir, 'session-events.jsonl'), 'utf8')
  expect(session).toContain('system/message')
  expect(session).toContain('tool/result')
  expect(session).not.toContain('FORBIDDEN_SENTINEL')
  expect(JSON.parse((await readFile(join(f.out, 'trace.jsonl'), 'utf8')).trim().split('\n').at(-1)!))
    .toMatchObject({ status: 'candidate_ungraded', model_call_attempts: 2, graded: false })
  expect({ input: prompt, toolNames: f.adapter.requests[0]!.tools!.map(tool => tool.name), output: source }).toMatchInlineSnapshot(`
    {
      "input": "Implement a module named UnregisteredLogic.
     - input a
     - output z
    Output the complement of a.",
      "output": "module UnregisteredLogic(input a, output z); assign z = ~a; endmodule
    ",
      "toolNames": [
        "check_rtl",
      ],
    }
  `)
})

it('accepts plain text transport without manufacturing an unchecked candidate', async () => {
  const f = await setup([textResponse('No candidate submitted.')])
  expect((await f.run()).status).toBe('empty_answer')
  expect(f.checker).not.toHaveBeenCalled()
})

it.each(['max-tokens', 'error', 'aborted'] as const)('never executes tool arguments after %s', async kind => {
  const stream = toolCallResponse('call', 'check_rtl', { source })
  stream[stream.length - 1] = { type: 'finish', reason: kind === 'max-tokens' ? { kind }
    : { kind, failure: { code: kind === 'error' ? 'CONTEXT_WINDOW_EXCEEDED' : 'ABORTED', message: 'provider failed' } } }
  const f = await setup([stream])
  expect((await f.run()).status).toBe('internal_error')
  expect(f.checker).not.toHaveBeenCalled()
  expect(await readFile(join(f.out, 'solution.v'), 'utf8')).toBe('')
})

it('rejects provider-repaired JSON even with a successful finish', async () => {
  const stream = toolCallResponse('call', 'check_rtl', { source })
  const delta = stream.find(chunk => chunk.type === 'tool-call-delta')!
  if (delta.type === 'tool-call-delta') delta.argumentsDelta = ''
  const f = await setup([stream])
  expect((await f.run()).status).toBe('internal_error')
  expect(f.checker).not.toHaveBeenCalled()
})

it('requires complete response blocks and a terminal finish before admission', async () => {
  const valid = toolCallResponse('a', 'check_rtl', { source })
  expect(await chunks(valid)).toEqual(valid)
  for (const broken of [valid.slice(0, -1), valid.filter(chunk => chunk.type !== 'block-end'), [...valid, ...textResponse('extra')]]) {
    expect(await chunks(broken)).toMatchObject([{ type: 'finish', reason: { kind: 'error' } }])
  }
  expect(await chunks(valid, 10)).toMatchObject([{ type: 'finish', reason: { kind: 'error' } }])
})

it('cancels a hanging stream and persists the drained session', async () => {
  const f = await setup(['hang'])
  const result = await f.run(50)
  expect(result.status).toBe('timeout')
  expect(f.checker).not.toHaveBeenCalled()
  expect(await readFile(join(result.workDir, 'session-events.jsonl'), 'utf8')).toContain('turn/end')
})

it('rejects excess calls and request bytes before contacting the provider', async () => {
  const f = await setup([toolCallResponse('a', 'check_rtl', { source }), textResponse('not called')], { maxCalls: 1 })
  expect((await f.run()).status).toBe('internal_error')
  expect(f.adapter.requests).toHaveLength(1)
  const large = await setup([textResponse('not called')], { maxRequestBytes: 10 })
  expect((await large.run()).status).toBe('internal_error')
  expect(large.adapter.requests).toHaveLength(0)
})

it.each(['`include "ref.sv"', '$readmemh("ref.sv", a);', '(* ram_init_file = "ref.sv" *)', '// synthesis read_comments\n$system("type ref.sv");', 'import "DPI-C" function void exploit();'])('refuses file-capable RTL before EDA: %s', extra => {
  expect(() => validateSource(source + extra, interfaceFromPrompt(prompt), 65536)).toThrow()
})
it('checks public widths and names, not just the module identifier', () => {
  expect(() => validateSource(source.replace('output z', 'output [1:0] z'), interfaceFromPrompt(prompt), 65536)).toThrow()
})
it('validates baseline relay input without rewriting its prompt or sampling', () => {
  const request = { model: 'selected', messages: [{ role: 'user', content: 'public spec' }], max_tokens: 8192, temperature: 0, top_p: 1 }
  expect(relayRequest(JSON.stringify(request), 'selected', 8192)).toEqual(request)
  for (const invalid of [{ ...request, model: 'other' }, { ...request, n: 2 }, { ...request, max_tokens: 8193 }, { ...request, messages: [{ role: 'user', content: [{ type: 'image_url' }] }] }]) {
    expect(() => relayRequest(JSON.stringify(invalid), 'selected', 8192)).toThrow()
  }
})
