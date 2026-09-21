import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import LlmRuntime, { createUserMessage, LlmAdapter, ToolCallId, type GenerateOptions, type StreamChunk } from '@deepseek-ai/dsh-llm'
import Sessions, { SessionId } from '@deepseek-ai/dsh-session'
import Agents from '@deepseek-ai/dsh-agent'
import AgentLoop from '@deepseek-ai/dsh-agent-loop'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import Projections from '@deepseek-ai/dsh-session-projection'
import SandboxPolicy from '@deepseek-ai/dsh-sandbox-policy'
import { SandboxProvider } from '@deepseek-ai/dsh-sandbox'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import * as RtlTools from '../src/index.ts'

let ctx: Context | undefined
let root: string | undefined
let keepRoot = false

afterEach(async () => {
  await ctx?.fiber.dispose()
  if (root && !keepRoot) await rm(root, { recursive: true, force: true })
  root = undefined
  keepRoot = false
  vi.restoreAllMocks()
})

// This test owns no sandbox runner: only explicit danger-full-access may run.
class UnavailableSandbox extends SandboxProvider {
  confine(): never { throw new Error('sandbox unavailable in test') }
}

async function boot(mode = 'danger-full-access', synthesis: false | 'fixture' | 'counter' | 'syntax' | 'comb' = false) {
  const real = synthesis && synthesis !== 'fixture'
  const parent = real && process.env.RTL_VIVADO_ARTIFACTS_DIR ? process.env.RTL_VIVADO_ARTIFACTS_DIR : tmpdir()
  await mkdir(parent, { recursive: true })
  root = await mkdtemp(join(parent, real ? 'rtl loader-' : 'rtl-loader-'))
  keepRoot = !!(real && process.env.RTL_VIVADO_ARTIFACTS_DIR)
  await writeFile(join(root, 'source.json'), '{}')
  if (real) {
    const source = synthesis === 'counter' ? await readFile(fileURLToPath(new URL('../example/rtl/counter.sv', import.meta.url)), 'utf8')
      : synthesis === 'syntax' ? 'module counter(output wire q); assign q = ; endmodule\n'
        : 'module counter(output wire q); assign q = 1\'b0; endmodule\n'
    await writeFile(join(root, 'source.sv'), source)
    await writeFile(join(root, 'clock.xdc'), 'create_clock -name clk -period 5.000 [get_ports clk]\n')
  }
  const configPath = join(root, 'cordis.yml')
  await writeFile(configPath, [
    '- name: systemPrompt', '- name: tools', '- name: projections',
    '- name: llm', '- name: sessions', '- name: agents', '- name: loop\n  config:\n    agents: []',
    `- name: policy\n  config:\n    mode: ${mode}\n    workspaceRoot: ${JSON.stringify(root)}`,
    '- name: sandbox', '- name: subprocess',
    '- name: rtl-tools', '  config:',
    `    workspaceRoot: ${JSON.stringify(root)}`,
    '    top: fifo_tb', '    sources: [source.json]',
    `    iverilog: ${JSON.stringify(process.execPath)}`,
    `    vvp: ${JSON.stringify(process.execPath)}`,
    ...(synthesis ? [
      '    synthesis:', `      top: ${real ? 'counter' : 'top'}`,
      `      sources: [${real ? 'source.sv' : 'source.json'}]`,
      `      xdcFiles: ${synthesis === 'counter' ? '[clock.xdc]' : '[]'}`,
      `      vivado: ${JSON.stringify(real ? process.env.RTL_VIVADO : process.execPath)}`,
    ] : []),
    '',
  ].join('\n'))
  ctx = new Context()
  ctx.baseUrl = pathToFileURL(root).href + '/'
  await ctx.plugin(Loader)
  ctx.loader.builtins.include = Include
  const modules = new Map<string, unknown>([
    ['systemPrompt', SystemPrompt], ['tools', Tools], ['projections', Projections],
    ['llm', LlmRuntime], ['sessions', Sessions], ['agents', Agents], ['loop', AgentLoop],
    ['policy', SandboxPolicy], ['sandbox', UnavailableSandbox],
    ['subprocess', LocalSubprocess], ['rtl-tools', RtlTools],
  ])
  ctx.loader.internal = {
    version: 'v2', async import(specifier: string) {
      if (!modules.has(specifier)) throw new Error(`unexpected plugin: ${specifier}`)
      return modules.get(specifier)
    },
  } as unknown as NonNullable<typeof ctx.loader.internal>
  await ctx.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(configPath).href } })
  await ctx.loader.await()
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  const fixture = fileURLToPath(new URL(synthesis ? './fake-vivado.mjs' : './fake-eda.mjs', import.meta.url))
  if (!real) vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fixture, ...spec.argv.slice(1)] }))
  return ctx
}

function invoke(context: Context, top = 'fifo_tb') {
  return context.tools.execute({ name: 'run_simulation', arguments: { top }, callId: ToolCallId('rtl-call'), signal: new AbortController().signal })
}

it('loads through cordis.yml and returns a schema-validated value with compact Native output', async () => {
  const context = await boot()
  expect(context.tools.schemas().find(tool => tool.name === 'run_simulation')).toBeDefined()
  expect(context.tools.schemas().find(tool => tool.name === 'run_synthesis')).toBeUndefined()
  const result = await invoke(context)
  expect(result.isError, JSON.stringify(result)).toBe(false)
  expect(result.value).toMatchObject({ status: 'PASS', backend: 'icarus', stage: 'simulation' })
  expect(result.content[0]).toMatchObject({ type: 'text', text: expect.stringContaining('RTL simulation: PASS') })
  expect(JSON.stringify(result.content).length).toBeLessThan(2000)
  expect((await invoke(context, 'other_tb')).isError).toBe(true)
  await writeFile(join(root!, 'source.json'), '{"compileError":true}')
  const failure = await invoke(context)
  expect(failure.isError).toBe(false)
  expect(failure.value).toMatchObject({ status: 'FAIL', stage: 'compile' })
  const content = failure.content[0]
  expect(content?.type).toBe('text')
  if (content?.type === 'text') {
    expect(content.text.replace(/^Artifacts: .*$/m, 'Artifacts: <run>')).toMatchSnapshot()
  }
  expect(await readFile(join(root!, 'source.json'), 'utf8')).toBe('{"compileError":true}')
})

it.each(['read-only', 'workspace-write'])('does not bypass %s sandbox policy', async mode => {
  const context = await boot(mode)
  const result = await invoke(context)
  expect(result.isError).toBe(true)
  expect(context.subprocess.spawn).not.toHaveBeenCalled()
})

it.each(['simulation', 'synthesis'] as const)('records compact %s results in the real agent session and sends the same facts to the next model request', async tool => {
  const context = await boot('danger-full-access', tool === 'synthesis' ? 'fixture' : false)
  await writeFile(join(root!, 'source.json'), tool === 'synthesis' ? '{"synthError":true}' : '{"compileError":true}')
  const requests: GenerateOptions[] = []
  class ScriptedModel extends LlmAdapter {
    override async resolveModel(provider: string, model: string) {
      return { provider, id: model, name: model }
    }
    override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
      requests.push(options)
      if (requests.length === 1) {
        const id = ToolCallId('simulation-1')
        const argumentsJson = JSON.stringify({ top: tool === 'synthesis' ? 'top' : 'fifo_tb' })
        yield { type: 'block-start', index: 0, blockType: 'tool-call' }
        yield { type: 'tool-call-delta', index: 0, id, name: `run_${tool}`, argumentsDelta: argumentsJson }
        yield { type: 'block-end', index: 0, block: { type: 'tool-call', id, name: `run_${tool}`, arguments: argumentsJson } }
        yield { type: 'finish', reason: { kind: 'tool-calls' } }
      } else {
        yield { type: 'block-start', index: 0, blockType: 'text' }
        yield { type: 'text-delta', index: 0, text: 'Compilation failed at fifo.sv:27.' }
        yield { type: 'block-end', index: 0, block: { type: 'text', text: 'Compilation failed at fifo.sv:27.' } }
        yield { type: 'finish', reason: { kind: 'stop' } }
      }
    }
  }
  context.llm.registerAdapter(['rtl-test'], new ScriptedModel())
  const agent = await context.agentLoop.create(SessionId('rtl-recorded-session'), { provider: 'rtl-test', model: 'scripted' }, { cwd: root! })
  const idle = new Promise<void>(resolve => {
    const dispose = context.on('agent/status', ({ agent: current, status }) => {
      if (current === agent && status === 'idle') { dispose(); resolve() }
    })
  })
  agent.followup(createUserMessage({ content: [{ type: 'text', text: `Run ${tool} on the configured RTL.` }], source: { kind: 'user' } }))
  await idle
  expect(requests).toHaveLength(2)
  const recorded = agent.session.snapshotEvents().filter(event => event.type === 'tool/result')
  expect(recorded).toHaveLength(1)
  const text = JSON.stringify(recorded[0]!.data)
  expect(text).toContain('syntax_error')
  expect(text).not.toContain('INFO noise')
  expect(JSON.stringify(requests[1]!.messages)).toContain('syntax_error')
  const normalized = JSON.parse(text.replace(/Artifacts: [^"\\]*(?:\\.[^"\\]*)*/g, 'Artifacts: <run>')) as (typeof recorded)[number]['data']
  expect({ ...normalized, message: { ...normalized.message, id: '<message-id>' } }).toMatchSnapshot()
})

function synthesize(context: Context, top = 'top') {
  return context.tools.execute({ name: 'run_synthesis', arguments: { top }, callId: ToolCallId('synthesis-call'), signal: new AbortController().signal })
}

it('loads optional synthesis with defaults and validates its schema and compact presentation', async () => {
  const context = await boot('danger-full-access', 'fixture')
  expect(context.tools.schemas().find(tool => tool.name === 'run_synthesis')).toBeDefined()
  const result = await synthesize(context)
  expect(result.isError, JSON.stringify(result)).toBe(false)
  expect(result.value).toMatchObject({ success: true, synthesizable: true, backend: 'vivado', timing: { wns: -0.125 } })
  expect(JSON.stringify(result.content).length).toBeLessThan(2000)
  expect((await synthesize(context, 'fifo_tb')).isError).toBe(true)
  const content = result.content[0]
  if (content?.type === 'text') expect(content.text.replace(/^Artifacts: .*$/m, 'Artifacts: <run>')).toMatchSnapshot()
})

it('requires explicit synthesis constraints and rejects invalid synthesis configuration at load', async () => {
  for (const synthesis of [{ top: 'top', sources: ['rtl.sv'] }, { top: 'top', sources: ['rtl.sv'], xdcFiles: [], timeoutMs: 0 }]) {
    const wire = { workspaceRoot: tmpdir(), top: 'tb', sources: ['tb.sv'], synthesis }
    const parsed = await RtlTools.Config['~standard'].validate(wire)
    if ('value' in parsed) {
      expect(() => RtlTools.apply(new Context(), parsed.value as RtlTools.RtlConfig)).toThrow('timeoutMs')
    } else expect(parsed.issues).toBeDefined()
  }
})

it.each(['read-only', 'workspace-write'])('does not bypass %s sandbox policy for synthesis', async mode => {
  const context = await boot(mode, 'fixture')
  expect((await synthesize(context)).isError).toBe(true)
  expect(context.subprocess.spawn).not.toHaveBeenCalled()
})

it('plugin disposal cancels and joins a running Vivado process tree', async () => {
  const context = await boot('danger-full-access', 'fixture')
  await writeFile(join(root!, 'source.json'), '{"hang":true}')
  const pending = synthesize(context)
  let child = 0
  await expect.poll(async () => {
    const dir = (await readdir(root!)).find(name => name.startsWith('.rtl-synth-'))
    if (!dir) return false
    child = Number(await readFile(join(root!, dir, 'child.pid'), 'utf8').catch(() => '0'))
    return child > 0
  }).toBe(true)
  const entry = [...context.loader.entries()].find(item => item.options.name === 'rtl-tools')
  expect(entry?.fiber).toBeDefined()
  await entry!.fiber!.dispose()
  await pending
  expect(() => process.kill(child, 0)).toThrow()
})

it.skipIf(!process.env.RTL_VIVADO).each(['counter', 'syntax', 'comb'] as const)('real Vivado via registered tool: %s', async candidate => {
  const context = await boot('danger-full-access', candidate)
  const before = await readFile(join(root!, 'source.sv'))
  const result = await synthesize(context, 'counter')
  expect(result.isError, JSON.stringify(result)).toBe(false)
  expect(result.value, JSON.stringify(result)).toMatchObject({
    success: candidate !== 'syntax', synthesizable: candidate !== 'syntax',
    stage: candidate === 'syntax' ? 'synthesis' : 'report',
  })
  expect(await readFile(join(root!, 'source.sv'))).toEqual(before)
  if (candidate === 'counter') expect(result.value).toMatchObject({ resources: { lut: 2, ff: 4, bram: 0, dsp: 0 }, timing: { wns: expect.any(Number), reason: null } })
  if (candidate === 'comb') expect(result.value).toMatchObject({ timing: { wns: null, reason: 'no_clocks' } })
  if (keepRoot) console.info(`Real Vivado ${candidate} artifacts: ${root}`)
}, 300_000)
