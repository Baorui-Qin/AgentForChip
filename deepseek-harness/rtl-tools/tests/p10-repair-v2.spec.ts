import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, expect, it, vi } from 'vitest'
import { createToolResultMessage, createUserMessage, ToolCallId, type Message, type StreamChunk } from '@deepseek-ai/dsh-llm'
import type { SubprocessRuntime } from '@deepseek-ai/dsh-subprocess'
import { callAction } from '../src/phase1/p09-action-call.ts'
import { buildContext, ledgerEntry, type ContextInput } from '../src/phase1/p09-context.ts'
import { revisionScore, compareRevision } from '../src/phase1/p10-revision.ts'
import { simulationFeedback, withWaveform } from '../src/phase1/waveform-feedback.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import type { ModelRuntime } from '../src/phase1/model.ts'

const counts = vi.hoisted(() => ({ history: 130000, core: 1000 }))
// Explicit wire-count test double; no claim of provider tokenizer equivalence.
vi.mock('../src/process.ts', () => ({ runCommand: async (_runtime: unknown, _limits: unknown, argv: string[], directory: string) => {
  const wire = JSON.parse(await readFile(argv[1]!, 'utf8'))
  const tokens = wire.messages.some((m: { role: string }) => m.role === 'assistant') ? counts.history : counts.core
  const stdoutLog = join(directory, 'count.json'); await writeFile(stdoutLog, JSON.stringify({ tokens }))
  return { exitCode: 0, stdoutLog, timedOut: false, aborted: false, logTruncated: false }
} }))
const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { force: true, recursive: true }); counts.history = 130000; counts.core = 1000 })

function repair(): ContextInput {
  const source = 'module TopModule(input clk, d, output q); assign q = d; endmodule\n'
  return { task: { id: 'test', spec: 'Capture d on both edges.', interface: { top: 'TopModule', ports: [{ name: 'clk', direction: 'input', width: 1 }, { name: 'd', direction: 'input', width: 1 }, { name: 'q', direction: 'output', width: 1 }] }, constraints: 'Single DUT.' },
    current: { revision_id: 'r0', source, source_sha256: sha256(source) }, binding: { revision_id: 'r0', source_sha256: sha256(source), verification_key: 'sha256:' + 'a'.repeat(64) },
    sample_id: 'sample', variant_id: 'C', purpose: 'repair', tool_mode: true, pending_verification: false, ledger: [],
    repair_control: { mode: 'normal', compacted: false, best_revision_id: 'r0', best_source_sha256: sha256(source), rejected: [] },
    feedback: { schema_version: '1.4', evidence_kind: 'live_verification', eda_rerun: false, model_repair_executed: false, original_run: 'mock', result_sha256: 'b'.repeat(64), parser_version: 'mock', parser_sha256: 'c'.repeat(64), inputs: [], old_diagnostics: {},
      stages: ['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => ({ stage, status: stage === 'simulation' ? 'FAIL' : stage === 'synthesis' ? 'SKIPPED' : 'PASS', complete: true, process_normal: true, process_clean: true, functional_failure: stage === 'simulation', diagnostics: [],
        verdict: { records: 1, completed: true, checks: 224, mismatches: 93, fatal: false } })) } }
}

async function actionSetup() {
  const root = await mkdtemp(join(tmpdir(), 'repair-v2-')); roots.push(root)
  await mkdir(join(root, 'models'))
  const runtimeRoot = join(root, 'runtime'); await mkdir(runtimeRoot)
  await writeFile(join(runtimeRoot, 'counter.exe'), 'mock'); await writeFile(join(runtimeRoot, 'tokenizer.json'), '{}')
  const manifest = JSON.stringify({ revision: 'a'.repeat(40), executable: 'counter.exe', tokenizer: 'tokenizer.json', compiler: 'mock', files: { 'counter.exe': sha256('mock'), 'tokenizer.json': sha256('{}') } })
  await writeFile(join(runtimeRoot, 'manifest.json'), manifest)
  const wires: unknown[] = [], directories: string[] = []
  let respond = 'tool'
  const runtime: ModelRuntime = { async prepareCall(config) { return { config, context: { contextWindow: 131072 }, adapterDefaults: {},
    retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 },
    async *stream(request): AsyncGenerator<StreamChunk> {
      wires.push(request)
      if (respond === 'many-chunks') for (let i = 0; i < 11000; i++) yield { type: 'reasoning-delta', index: 0, text: 'abc' }
      if (['tool', 'finish', 'mixed'].includes(respond)) yield { type: 'tool-call-delta', index: 0, id: ToolCallId('call'), name: respond === 'finish' ? 'finish' : 'read_current_rtl', argumentsDelta: '{}' }
      if (respond === 'text' || respond === 'mixed') yield { type: 'text-delta', index: 1, text: 'I will think about it.' }
      if (respond === 'truncated') yield { type: 'tool-call-delta', index: 0, id: ToolCallId('call'), name: 'edit_dut', argumentsDelta: '{' }
      yield { type: 'finish', reason: { kind: respond === 'truncated' ? 'max-tokens' : 'stop' } }
    } } } }
  const p09 = { variant: 'C' as const, limits: { window: 131072, output: 16384, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 },
    tokenizer: { python: '', root, manifestSha256: '', timeoutMs: 1000 }, skillsFile: null, skillsSha256: null, maxRequests: 15 }
  const args = { root, experiment: 'sample', sequence: 1, input: repair(), history: [] as Message[], auto: { registry: 'full' as const, campaignRoot: root, bucket: 'preflight' as const, sampleId: 'sample', runtimeRoot, runtimeManifestSha256: sha256(manifest), maxToolSteps: 15 },
    p09, model: { model: 'deepseek-flash', maxTokens: 16384, maxResponseBytes: 262144, timeoutMs: 10000, temperature: 0 }, runtime, subprocess: {} as SubprocessRuntime,
    maxEventBytes: 1048576, signal: new AbortController().signal, loadSkills: async () => [], claim: async (path: string) => { directories.push(path) }, expectedRequestHash: null, compactThreshold: 0.8 }
  return { args, wires, directories, respond(value: string) { respond = value } }
}

it('uses a 4K thinking-disabled request with no finish tool and logs the exact action prompt', async () => {
  const s = await actionSetup(); s.args.input.repair_control!.mode = 'forced_action'
  s.args.model.maxTokens = 4096; s.args.p09.limits.output = 4096
  const result = await callAction(s.args)
  expect(result.error_code).toBeNull()
  const wire = JSON.parse(await readFile(join(s.directories[0]!, 'prompt-final.txt'), 'utf8'))
  expect(wire).toMatchObject({ max_tokens: 4096, thinking: { type: 'disabled' } })
  expect(wire.tools.some((tool: { function: { name: string } }) => tool.function.name === 'finish')).toBe(false)
  expect({ max_tokens: wire.max_tokens, thinking: wire.thinking,
    instruction: JSON.parse(wire.messages.find((m: { role: string }) => m.role === 'user').content).action_instruction,
    tools: wire.tools.map((tool: { function: { name: string } }) => tool.function.name) }).toMatchSnapshot()
  const events = await readFile(join(s.directories[0]!, 'events.jsonl'), 'utf8')
  expect(events).toContain('agent_request'); expect(events).toContain('forced_action')
})

it.each(['finish', 'text', 'mixed', 'truncated'])('rejects forced recovery %s without executing it', async response => {
  const s = await actionSetup(); s.args.input.repair_control!.mode = 'forced_action'; s.respond(response)
  const result = await callAction(s.args)
  expect(result.error_code).toBe(response === 'truncated' ? 'OUTPUT_TRUNCATED' : 'FORCED_ACTION_REQUIRED')
})

it.each([100000, 130000])('compacts %i history tokens at threshold or overflow, retaining source, bound failure and rejected ledger', async historyTokens => {
  counts.history = historyTokens
  const s = await actionSetup()
  s.args.input.ledger = [ledgerEntry(s.args.input)]
  s.args.input.repair_control!.rejected.push({ revision_id: 'bad', source_sha256: 'd'.repeat(64), reason: 'REGRESSION', checks: 224, mismatches: 223 })
  s.args.history = [{ ...createUserMessage({ content: [], source: { kind: 'user' } }), role: 'assistant', source: { kind: 'model', provider: 'deepseek-official', model: 'deepseek-flash' }, content: [{ type: 'tool-call', id: ToolCallId('old'), name: 'read_current_rtl', arguments: '{}' }] },
    createToolResultMessage({ callId: ToolCallId('old'), content: [{ type: 'text', text: 'old trace' }], isError: false })]
  const result = await callAction(s.args)
  expect(result.error_code).toBeNull(); expect(result.context_compacted).toBe(true)
  const wire = JSON.parse(await readFile(join(s.directories[0]!, 'prompt-final.txt'), 'utf8'))
  expect(wire.messages.some((m: { role: string }) => m.role === 'assistant' || m.role === 'tool')).toBe(false)
  const prompt = JSON.parse(wire.messages.find((m: { role: string }) => m.role === 'user').content)
  expect(prompt.current).toEqual(s.args.input.current)
  expect(prompt.repair_ledger).toEqual(s.args.input.ledger)
  expect(prompt.repair_control.rejected[0].mismatches).toBe(223)
  expect(prompt.observed.verdict.mismatches).toBe(93)
  expect(prompt.repair_control.compacted).toBe(true)
  expect(JSON.parse(await readFile(join(s.directories[0]!, 'context-audit.json'), 'utf8')).ledger_entry_ids).toEqual(['r0'])
})

it('stops before dispatch when even the mandatory compact core cannot fit', async () => {
  const s = await actionSetup(); counts.core = 130000
  const result = await callAction(s.args)
  expect(result).toMatchObject({ error_code: 'CONTEXT_UNSATISFIABLE', dispatched: false })
  expect(s.wires).toHaveLength(0)
})

it('retains a stream larger than the event envelope without truncating bounded model text', async () => {
  const s = await actionSetup(); s.respond('many-chunks')
  const result = await callAction(s.args)
  expect(result).toMatchObject({ error_code: null, finish_kind: 'stop', response_bytes: 33000 })
  expect(Buffer.byteLength(await readFile(join(s.directories[0]!, 'stream.json'), 'utf8'))).toBeGreaterThan(524288)
  expect((await readFile(join(s.directories[0]!, 'stream.jsonl'), 'utf8')).trim().split('\n')).toHaveLength(11001)
  expect(await readFile(join(s.directories[0]!, 'reasoning.txt'), 'utf8')).toBe('abc'.repeat(11000))
})

it('still bounds response bytes and archives the chunk that crosses the limit', async () => {
  const s = await actionSetup(); s.respond('many-chunks'); s.args.model.maxResponseBytes = 5
  expect(await callAction(s.args)).toMatchObject({ error_code: 'OUTPUT_TRUNCATED', truncation_reason: 'response_bytes', response_bytes: 6 })
  // Drain receives the remaining chunks; the complete archive includes the original crossing prefix.
  const reasoning = await readFile(join(s.directories[0]!, 'reasoning.txt'), 'utf8')
  expect(reasoning.slice(0, 6)).toBe('abcabc')
  expect(reasoning).toBe('abc'.repeat(11000))
  expect((await readFile(join(s.directories[0]!, 'stream.jsonl'), 'utf8')).trim().split('\n')).toHaveLength(11001)
})

it('retains the previous host tool result even when compacting away the message history', async () => {
  const s = await actionSetup(); s.args.input.core_only = true
  s.args.input.previous_tool_result = { tool: 'edit_dut', accepted: false, observation: { error: 'REPEATED_CANDIDATE' } }
  await callAction(s.args)
  const wire = JSON.parse(await readFile(join(s.directories[0]!, 'prompt-final.txt'), 'utf8'))
  expect(JSON.parse(wire.messages.find((m: { role: string }) => m.role === 'user').content).previous_tool_result).toEqual(s.args.input.previous_tool_result)
  expect(JSON.parse(wire.messages.find((m: { role: string }) => m.role === 'user').content).previous_tool_result).toMatchInlineSnapshot(`
    {
      "accepted": false,
      "observation": {
        "error": "REPEATED_CANDIDATE",
      },
      "tool": "edit_dut",
    }
  `)
})

it('orders compatible revisions but never scores missing evidence or different sample counts', () => {
  const receipt = repair().feedback!, best = revisionScore(receipt, false)
  expect(best).toEqual({ rank: 2, checks: 224, mismatches: 93 })
  expect(compareRevision(best, { ...best!, mismatches: 223 })).toBe('REGRESSION')
  expect(compareRevision(best, { ...best!, mismatches: 50 })).toBe('IMPROVED')
  expect(compareRevision(best, { ...best!, checks: 100 })).toBe('INCOMPARABLE')
  expect(compareRevision(best, { rank: 5, checks: null, mismatches: null })).toBe('REGRESSION')
  expect(revisionScore(receipt, true)).toBeNull()
  const passed = { ...receipt, stages: receipt.stages.map(s => ({ ...s, status: 'PASS' })) }
  expect(compareRevision(best, revisionScore(passed, true))).toBe('IMPROVED')
  passed.stages[0]!.complete = false
  expect(revisionScore(passed, true)).toBeNull()
  receipt.stages[2]!.complete = false
  expect(revisionScore(receipt, false)).toBeNull()
  expect(compareRevision(best, null)).toBe('INCOMPARABLE')
})

const log = "Hint: Output 'q' has 93 mismatches. First mismatch occurred at time 15."
const wave = `$timescale 1ps $end
$scope module tb $end
$var reg 1 # clk $end
$var reg 1 $ d $end
$var reg 1 % q_ref $end
$var reg 1 & q_dut $end
$scope module good1 $end
$var reg 1 ! private_state $end
$upscope $end
$upscope $end
$enddefinitions $end
#0
0#
0$
0%
0&
#10
1#
1$
#15
0#
1%
0&
#20
1#
1&
#25
0#
`
it('retains XSim hints and samples only public ports around reported time, not hidden reference state', async () => {
  const feedback = withWaveform(wave, simulationFeedback([log, 'Mismatches: 93 in 224 samples']))
  expect(feedback.first_failure_time).toBe(15); expect(feedback.first_failure_cycle).toBeNull()
  expect(feedback.waveform.samples).toEqual([{ time: 10, values: { clk: '1', d: '1', q_ref: '0', q_dut: '0' } }, { time: 15, values: { clk: '0', d: '1', q_ref: '1', q_dut: '0' } }, { time: 20, values: { clk: '1', d: '1', q_ref: '1', q_dut: '1' } }])
  expect(JSON.stringify(feedback)).not.toContain('private_state')
  const input = repair(); input.feedback!.stages[2]!.simulation_feedback = feedback
  const built = await buildContext(input, (await actionSetup()).args.p09.limits, { quality: 'estimated', identity: {}, count: async () => 1000 }, new AbortController().signal)
  expect(JSON.parse(built.prompt).observed.simulation_feedback).toEqual(feedback)
  expect({ observed: JSON.parse(built.prompt).observed, instruction: JSON.parse(built.prompt).action_instruction }).toMatchSnapshot()
})

it('does not invent a cycle or expected value when evidence is absent, unaligned or outside the waveform', () => {
  expect(simulationFeedback(['Mismatches: 93 in 224 samples']).outputs).toEqual([])
  expect(withWaveform(wave.replace('1ps', '1ns'), simulationFeedback([log])).waveform.reason).toBe('UNSUPPORTED_TIME_ALIGNMENT')
  expect(withWaveform(wave, simulationFeedback([log.replace('time 15', 'time 999')])).waveform.reason).toBe('FAILURE_TIME_OUTSIDE_WAVEFORM')
  const feedback = simulationFeedback(Array.from({ length: 100 }, () => log))
  expect(feedback.raw_excerpt).toHaveLength(24); expect(feedback.omitted_lines).toBe(76); expect(feedback.outputs).toHaveLength(16)
})
