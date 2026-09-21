import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, expect, it, vi } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { sha256 } from '../src/phase1/snapshots.ts'

const mock = vi.hoisted(() => ({ actions: [] as unknown[], sources: [] as string[], pendingStates: [] as boolean[], textSteps: [] as ('transport' | 'truncated' | 'cancelled' | 'success' | 'invalid')[], generation: 0, verified: false, closed: 0, outputRoot: '',
  agentSteps: [] as string[], agentInputs: [] as Record<string, unknown>[], mismatches: [] as number[] } ))
vi.mock('../src/phase1/p09-proposal.ts', () => ({ readP09Settings: async () => ({ variant: 'C', maxRequests: 15,
  limits: { window: 131072, output: 8192, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 } }), loadP09Skills: async () => [], retrieveP09Skills: async () => ({ skills: [] }) }))
vi.mock('../src/phase1/p09-claims.ts', () => ({ reserveDispatch: async () => ({ sequence: 1 }) }))
vi.mock('../src/phase1/p09-action-call.ts', () => ({ checkCounterRuntime: async () => ({}), countActionWire: async () => 1,
  callAction: async (args: { input: { current: { revision_id: string }; repair_control?: unknown }; model: unknown; p09: unknown; claim: (s: string) => Promise<void>; sequence: number }) => {
    await args.claim('model-' + args.sequence)
    mock.pendingStates.push((args.input as { pending_verification?: boolean }).pending_verification === true)
    mock.agentInputs.push(JSON.parse(JSON.stringify({ input: args.input, model: args.model, p09: args.p09 })))
    const step = mock.agentSteps.shift() ?? (args.sequence === 1 ? 'edit_dut' : 'verify_rtl')
    if (step === 'truncated' || step === 'context') return { dispatched: true, error_code: step === 'truncated' ? 'OUTPUT_TRUNCATED' : 'CONTEXT_LENGTH_EXCEEDED',
      retryable: false, prompt_sha256: sha256('request-' + args.sequence), request_wall_ms: 1, prompt_tokens: 10, completion_tokens: 5, message: null }
    const name = step === 'edit-bad' ? 'edit_dut' : step
    const source = step === 'edit-bad' ? 'module TopModule(input in, output out); assign out = 0; endmodule\n' : 'module TopModule(input in, output out); assign out = ~in; endmodule\n'
    const action = name === 'edit_dut' ? { expected_revision_id: args.input.current.revision_id, source } : name === 'verify_rtl' ? { revision_id: args.input.current.revision_id, test_suite_id: 'Prob005_notgate' } : {}
    mock.actions.push(action)
    return { dispatched: true, error_code: null, retryable: false, prompt_sha256: sha256('request-' + args.sequence), request_wall_ms: 1,
      prompt_tokens: 10, completion_tokens: 5, message: { role: 'assistant', id: 'test', source: { kind: 'model' }, content: [{ type: 'tool-call', id: 'call-' + args.sequence, name, arguments: JSON.stringify(action) }] } }
  } }))
vi.mock('../src/phase1/doctor.ts', () => ({ readDoctorConfig: async () => ({ config: {} }) }))
vi.mock('../src/phase1/p10-compat.ts', () => ({ loadCompatAssets: async () => ({ assets: { 'rtl/solution.sv': 'HOST_ONLY_WRAPPER', 'trusted/ref.sv': 'HOST_ONLY_REFERENCE' }, evaluation: {} }),
  negativeControl: () => 'module TopModule(input in, output out); assign out = in; endmodule\n' }))
vi.mock('../src/phase1/model.ts', () => ({ callText: async (_runtime: unknown, _settings: unknown, _prompt: string, _recorder: unknown, _link: unknown, signal: AbortSignal,
  observe: ((value: unknown) => void) | undefined, build: ((prepared: unknown, signal: AbortSignal) => Promise<unknown>) | undefined) => {
  mock.generation++
  if (build) await build({ config: { provider: 'deepseek-official', model: 'mock', maxTokens: 8192, temperature: 0 }, context: { contextWindow: 131072 }, adapterDefaults: {},
    retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 } }, signal)
  const step = mock.textSteps.shift() ?? 'success'
  const base = { schema_version: '1.1', dispatched: true, usage: { prompt_tokens: 10, completion_tokens: 5 }, timing: { request_wall_ms: 1 } }
  if (step === 'cancelled') {
    await new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('ABORTED')), { once: true }))
    throw new Error('UNREACHABLE')
  }
  if (step === 'transport') { observe?.({ code: 'TRANSPORT', http_status: null, network_code: 'ECONNRESET', response_bytes: 0, phase: 'stream' }); return { ...base, content: '', truncated: false, error: { category: 'connection' } } }
  observe?.({ code: null, http_status: null, network_code: null, response_bytes: step === 'truncated' ? 100 : 80, phase: 'stream' })
  return { ...base, content: step === 'invalid' ? 'not HDL' : step === 'truncated' ? 'module TopModule(' : 'module TopModule(input in, output out); assign out = ~in; endmodule\n', truncated: step === 'truncated', error: step === 'truncated' ? { category: 'truncated' } : null }
} }))
vi.mock('../src/phase1/verification.ts', () => ({ VerificationRunner: class {
  constructor(_subprocess: unknown, config: { outputRoot: string }) { mock.outputRoot = config.outputRoot }
  async registerDataset(assets: Record<string, string>) { mock.sources.push(assets['rtl/solution.sv']!); return 'snapshot' }
  async verify() { mock.verified = mock.sources.at(-1)!.includes('~in'); const artifacts = join(mock.outputRoot, 'run-' + mock.sources.length); await mkdir(artifacts, { recursive: true }); await writeFile(join(artifacts, 'result.json'), '{}'); return { status: mock.verified ? 'PASS' : 'FAIL', artifacts } }
  async close() { mock.closed++ }
} }))
vi.mock('../src/phase1/repair-diagnostics.ts', () => ({ readDiagnostics: async () => ({ record: { stages: {}, final_verified: mock.verified, final_source_sha256: sha256(mock.sources.at(-1)!), final_status: mock.verified ? 'PASS' : 'FAIL', verification_key: 'sha256:' + 'a'.repeat(64) },
  receipt: { inputs: [], original_run: join(mock.outputRoot, 'run-' + mock.sources.length), result_sha256: sha256('{}'), evidence_kind: 'live_verification',
    stages: ['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => ({ stage, status: mock.verified || stage === 'compile' || stage === 'elaborate' ? 'PASS' : stage === 'simulation' ? 'FAIL' : 'SKIPPED', complete: true, process_normal: true, process_clean: true, diagnostics: [], functional_failure: stage === 'simulation' && !mock.verified, verdict: { completed: true, checks: 224, mismatches: mock.verified ? 0 : mock.mismatches[mock.sources.length - 1] ?? 93 } })) } }) }))
vi.mock('../src/phase1/repair-policy.ts', () => ({ decideRepair: () => mock.verified ? { rule: 'VERIFIED', action: 'stop' } : { rule: 'FUNCTIONAL_MISMATCH', action: 'propose_repair' } }))

import { apply, Config } from '../src/phase1/p10-model.ts'
const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); mock.sources = []; mock.actions = []; mock.pendingStates = []; mock.textSteps = []; mock.generation = 0; mock.closed = 0; mock.verified = false; mock.outputRoot = ''; mock.agentSteps = []; mock.agentInputs = []; mock.mismatches = [] })

async function setup(command: string) {
  const root = await mkdtemp(join(tmpdir(), 'p10-model-')); roots.push(root)
  const preflight = join(root, 'preflight'); await mkdir(preflight)
  const task = { task_id: 'Prob005_notgate', spec: 'Implement a NOT gate.', interface: { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1 }, { name: 'out', direction: 'output', width: 1 }] } }
  for (const [name, value] of Object.entries({ 'catalog.json': [task], 'selection-order.json': [task.task_id], 'compat-positive-negative-results.json': [{ task_id: task.task_id, evaluable: true }], 'evaluator-policy.json': { defaultTimescale: '1ps/1ps' } })) await writeFile(join(preflight, name), JSON.stringify(value))
  await writeFile(join(root, 'freeze.json'), JSON.stringify({ files: {} }))
  await writeFile(join(root, 'auto.json'), JSON.stringify({ campaignRoot: root, bucket: 'preflight', registry: 'full', maxToolSteps: 15 }))
  const config = { campaignRoot: root, preflightRoot: preflight, datasetRoot: root, settingsFile: '', p09File: '', autoFile: join(root, 'auto.json'), freezeFile: join(root, 'freeze.json'), allowUnisolatedAutomatic: true,
    model: 'mock', maxTokens: 8192, temperature: 0, timeoutMs: 10000, activeMs: 10000, maxResponseBytes: 65536,
    maxTransportRetries: 2, transportBackoffMs: [1, 2], maxOutputRecoveryAttempts: 1, maxGenerationResumes: 1, selectedTaskCount: 10,
    repairMaxTokens: 16384, forcedActionMaxTokens: 4096, repairMaxResponseBytes: 262144, compactThreshold: 0.8, maxRepairRounds: 3,
    compileMs: 1000, elaborateMs: 1000, simulationMs: 1000, totalMs: 5000, maxArtifactBytes: 1000000, artifactPollMs: 100, maxEventBytes: 1048576 } as ReturnType<typeof Config>
  let ready: (() => void) | undefined
  let cleanup: (() => Promise<void>) | undefined
  let finish!: (code: number) => void
  let done: Promise<number>
  let invokedCommand = command
  const ctx = { cmdlineArgs: { get: () => [invokedCommand, task.task_id] }, llm: {}, subprocess: {}, sandboxPolicy: { resolve: () => ({ mode: 'danger-full-access' }) },
    get: (name: string) => name === 'appExit' ? finish : { onReady: (fn: () => void) => { ready = fn } }, effect: (fn: () => unknown) => {
      const value = fn(); if (typeof value === 'function') cleanup = value as () => Promise<void>
    } } as unknown as Context
  return { root, config, async execute(cancel = false, resume = false, exit = 0) { invokedCommand = resume ? 'resume-generate' : command; done = new Promise<number>(resolve => { finish = resolve }); apply(ctx, config); ready!(); if (cancel) setTimeout(() => void cleanup?.(), 0)
    expect(await done).toBe(exit); return JSON.parse(await readFile(join(root, `${command}-${task.task_id}`, 'result.json'), 'utf8')) } }
}

it('scores a shared candidate without regenerating it or charging a second initial dispatch', async () => {
  const s = await setup('compare'), initial = join(s.root, 'generate-Prob005_notgate'); await mkdir(initial)
  const source = 'module TopModule(input in, output out); assign out = ~in; endmodule\n'
  await writeFile(join(initial, 'initial.sv'), source)
  await writeFile(join(initial, 'result.json'), JSON.stringify({ status: 'GENERATED_UNVERIFIED', source_sha256: sha256(source) }))
  const result = await s.execute()
  expect(result.status).toBe('VERIFIED'); expect(result.physical_dispatches).toBe(0)
  expect(result.initial_generation_charged_again).toBe(false); expect(mock.generation).toBe(0)
  expect(result.final_exported_sha256).toBe(sha256(source)); expect(mock.closed).toBe(1)
})

it('allows the fortieth frozen task only with explicit forty-task configuration', async () => {
  const s = await setup('generate')
  const order = [...Array.from({ length: 39 }, (_, i) => 'fixed-' + i), 'Prob005_notgate']
  await writeFile(join(s.root, 'preflight/selection-order.json'), JSON.stringify(order))
  s.config.selectedTaskCount = 40
  expect((await s.execute()).status).toBe('GENERATED_UNVERIFIED')
  expect(() => Config({ ...s.config, selectedTaskCount: 41 })).toThrow()
})

it('does not expand the default ten-task authority to a later frozen task', async () => {
  const s = await setup('generate')
  await writeFile(join(s.root, 'preflight/selection-order.json'), JSON.stringify([...Array.from({ length: 10 }, (_, i) => 'fixed-' + i), 'Prob005_notgate']))
  await expect(s.execute(false, false, 1)).rejects.toMatchObject({ code: 'ENOENT' })
  expect(mock.generation).toBe(0)
})
it('keeps one logical initial request across bounded transport and output recovery', async () => {
  mock.textSteps = ['transport', 'truncated', 'success']
  const s = await setup('generate'), result = await s.execute()
  expect(result.status).toBe('GENERATED_UNVERIFIED')
  expect(result.logical_initial_requests).toBe(1); expect(result.initial_provider_dispatches).toBe(3)
  expect(result.transport_retries).toBe(1); expect(result.output_recovery_attempts).toBe(1)
  expect(result.transport_retry_records).toHaveLength(1); expect(result.output_recovery_records).toHaveLength(1)
  expect(mock.generation).toBe(3)
})
it('does not retry a user-cancelled initial request', async () => {
  mock.textSteps = ['cancelled']
  const s = await setup('generate'), result = await s.execute(true)
  expect(result.status).toBe('CANCELLED')
  expect(result.physical_dispatches).toBe(0); expect(result.transport_retries).toBe(0); expect(result.output_recovery_attempts).toBe(0)
  expect(mock.generation).toBe(1)
})
it('keeps faulty-seed model repair separate and verifies the new revision before export', async () => {
  const s = await setup('repair-control'), result = await s.execute()
  expect(result.status).toBe('VERIFIED'); expect(result.counted_in_model_score).toBe(false)
  expect(result.initial_status).toBe('FAIL'); expect(result.semantic_repairs).toBe(1)
  expect(result.physical_dispatches).toBe(2); expect(result.actions.map((a: { tool: string }) => a.tool)).toEqual(['edit_dut', 'verify_rtl'])
  expect(mock.pendingStates).toEqual([false, true]); expect(result.valid_repair_attempts).toBe(1)
  expect(result.repair_attempts[0]).toMatchObject({ valid: true, edit: { source_sha_changed: true }, verification: { persisted: true } })
  expect(mock.sources).toHaveLength(2); expect(mock.sources[0]).not.toEqual(mock.sources[1])
  expect(result.final_exported_sha256).toBe(result.verified_source_sha256)
  const trace = (await readFile(join(s.root, 'repair-control-Prob005_notgate', 'tool-trace.jsonl'), 'utf8')).trim().split('\n').map(line => JSON.parse(line))
  expect(trace.filter(item => item.event === 'verification').map(item => item.verification_trigger)).toEqual(['HOST_INITIAL', 'AGENT_TOOL'])
  expect(trace.filter(item => item.event === 'agent_tool').map(item => item.selected_tool)).toEqual(['edit_dut', 'verify_rtl'])
  expect(trace.find(item => item.selected_tool === 'verify_rtl').available_tools).toEqual(['verify_rtl'])
  expect(trace.filter(item => item.event === 'verification').every(item => item.xsim_executed === false)).toBe(true)
})

it('pauses after transport exhaustion and resumes the same request without losing attempts', async () => {
  mock.textSteps = ['transport', 'transport', 'transport']
  const s = await setup('generate'), first = await s.execute()
  expect(first.status).toBe('INFRA_PAUSED'); expect(first.physical_dispatches).toBe(3)
  await expect(readFile(join(s.root, 'generate-Prob005_notgate/initial.sv'))).rejects.toMatchObject({ code: 'ENOENT' })
  const final = await s.execute(false, true)
  expect(final.status).toBe('GENERATED_UNVERIFIED'); expect(final.logical_initial_requests).toBe(1)
  expect(final.physical_dispatches).toBe(4); expect(final.transport_retries).toBe(3)
  expect(final.generation_attempts).toHaveLength(4)
  expect(new Set(final.generation_attempts.map((a: { request_sha256: string }) => a.request_sha256)).size).toBe(1)
  expect(JSON.parse(await readFile(join(s.root, 'generate-Prob005_notgate/result-window-0.json'), 'utf8'))).toEqual(first)
  await s.execute(false, true, 1)
  expect(mock.generation).toBe(4)
})

it('refuses a second resume after the frozen cap', async () => {
  mock.textSteps = Array.from({ length: 6 }, () => 'transport' as const)
  const s = await setup('generate'); await s.execute(); await s.execute(false, true)
  await s.execute(false, true, 1); expect(mock.generation).toBe(6)
})

it('does not regenerate a complete but invalid response', async () => {
  mock.textSteps = ['invalid']
  const s = await setup('generate'), result = await s.execute()
  expect(result.status).not.toBe('INFRA_PAUSED'); expect(result.generation_attempts[0].response_complete).toBe(true)
  await s.execute(false, true, 1); expect(mock.generation).toBe(1)
})
it('rejects an altered shared initial source before EDA or a model call', async () => {
  const s = await setup('compare'), initial = join(s.root, 'generate-Prob005_notgate'); await mkdir(initial)
  await writeFile(join(initial, 'initial.sv'), 'altered')
  await writeFile(join(initial, 'result.json'), JSON.stringify({ status: 'GENERATED_UNVERIFIED', source_sha256: 'wrong' }))
  const result = await s.execute()
  expect(result.status).toBe('INITIAL_BINDING_INVALID'); expect(mock.sources).toEqual([]); expect(result.physical_dispatches).toBe(0)
})

it('recovers a truncated repair with a separate 4K forced action then verifies it', async () => {
  mock.agentSteps = ['truncated', 'edit_dut', 'verify_rtl']
  const s = await setup('repair-control'), result = await s.execute()
  expect(result.status).toBe('VERIFIED'); expect(result.output_recovery_attempts).toBe(1)
  expect(mock.agentInputs[0]).toMatchObject({ model: { maxTokens: 16384 }, p09: { limits: { output: 16384 } } })
  expect(mock.agentInputs[1]).toMatchObject({ model: { maxTokens: 4096 }, input: { repair_control: { mode: 'forced_action' } }, p09: { limits: { output: 4096 } } })
  expect(result.semantic_repairs).toBe(1); expect(result.physical_dispatches).toBe(3)
})

it('stops after the bounded forced recovery is also truncated', async () => {
  mock.agentSteps = ['truncated', 'truncated', 'edit_dut']
  const result = await (await setup('repair-control')).execute()
  expect(result.status).toBe('OUTPUT_TRUNCATED'); expect(result.physical_dispatches).toBe(2); expect(result.semantic_repairs).toBe(0)
})

it('compacts after provider context rejection without consuming a repair round', async () => {
  mock.agentSteps = ['context', 'edit_dut', 'verify_rtl']
  const result = await (await setup('repair-control')).execute()
  expect(result.status).toBe('VERIFIED'); expect(result.semantic_repairs).toBe(1)
  expect(mock.agentInputs[1]).toMatchObject({ input: { core_only: true } })
})

it('rolls 223/224 back to 93/224, rejects the same bad source and repairs from the best binding', async () => {
  mock.agentSteps = ['edit-bad', 'verify_rtl', 'edit-bad', 'edit_dut', 'verify_rtl']
  mock.mismatches = [93, 223]
  const result = await (await setup('repair-control')).execute()
  expect(result.status).toBe('VERIFIED'); expect(result.semantic_repairs).toBe(2)
  expect(result.revision_decisions[0]).toMatchObject({ decision: 'REGRESSION', rolled_back: true, best_score: { mismatches: 93 } })
  expect(result.actions[2]).toMatchObject({ accepted: false, observation: { error: 'REJECTED_REVISION' } })
  expect((mock.agentInputs[2]!.input as { current: unknown }).current).toEqual((mock.agentInputs[0]!.input as { current: unknown }).current)
  expect(result.repair_attempts.every((attempt: { valid: boolean }) => attempt.valid)).toBe(true)
})

it('exports no PASS and points to the best evidence after regression followed by finish', async () => {
  mock.agentSteps = ['edit-bad', 'verify_rtl', 'finish']; mock.mismatches = [93, 223]
  const s = await setup('repair-control'), result = await s.execute()
  expect(result.status).toBe('FINISHED_UNVERIFIED')
  expect(result.final_verification_run).toContain('run-1')
  expect(result.current_source_sha256).toBe(sha256(mock.sources[0]!))
  await expect(readFile(join(s.root, 'repair-control-Prob005_notgate/final.sv'))).rejects.toMatchObject({ code: 'ENOENT' })
})
