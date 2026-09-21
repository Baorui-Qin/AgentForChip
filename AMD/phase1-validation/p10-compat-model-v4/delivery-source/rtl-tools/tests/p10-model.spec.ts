import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, expect, it, vi } from 'vitest'
import type { Context } from '@deepseek-ai/cordis'
import { sha256 } from '../src/phase1/snapshots.ts'

const mock = vi.hoisted(() => ({ actions: [] as unknown[], sources: [] as string[], generation: 0, verified: false, closed: 0 }))
vi.mock('../src/phase1/p09-proposal.ts', () => ({ readP09Settings: async () => ({ variant: 'C', maxRequests: 15 }), loadP09Skills: async () => [], retrieveP09Skills: async () => ({ skills: [] }) }))
vi.mock('../src/phase1/p09-action-call.ts', () => ({ checkCounterRuntime: async () => ({}), countActionWire: async () => 1,
  callAction: async (args: { input: { current: { revision_id: string } }; claim: (s: string) => Promise<void>; sequence: number }) => {
    await args.claim('model-' + args.sequence)
    const name = args.sequence === 1 ? 'edit_dut' : 'verify_rtl'
    const source = 'module TopModule(input in, output out); assign out = ~in; endmodule\n'
    const action = name === 'edit_dut' ? { expected_revision_id: args.input.current.revision_id, source } : { revision_id: args.input.current.revision_id, test_suite_id: 'Prob005_notgate' }
    mock.actions.push(action)
    return { dispatched: true, error_code: null, message: { role: 'assistant', id: 'test', source: { kind: 'model' }, content: [{ type: 'tool-call', id: 'call-' + args.sequence, name, arguments: JSON.stringify(action) }] } }
  } }))
vi.mock('../src/phase1/doctor.ts', () => ({ readDoctorConfig: async () => ({ config: {} }) }))
vi.mock('../src/phase1/p10-compat.ts', () => ({ loadCompatAssets: async () => ({ assets: { 'rtl/solution.sv': 'HOST_ONLY_WRAPPER', 'trusted/ref.sv': 'HOST_ONLY_REFERENCE' }, evaluation: {} }),
  negativeControl: () => 'module TopModule(input in, output out); assign out = in; endmodule\n' }))
vi.mock('../src/phase1/model.ts', () => ({ callText: async () => { mock.generation++; return { content: 'module TopModule(input in, output out); assign out = ~in; endmodule\n', truncated: false, error: null } } }))
vi.mock('../src/phase1/verification.ts', () => ({ VerificationRunner: class {
  async registerDataset(assets: Record<string, string>) { mock.sources.push(assets['rtl/solution.sv']!); return 'snapshot' }
  async verify() { mock.verified = mock.sources.at(-1)!.includes('~in'); return { status: mock.verified ? 'PASS' : 'FAIL', artifacts: 'run-' + mock.sources.length } }
  async close() { mock.closed++ }
} }))
vi.mock('../src/phase1/repair-diagnostics.ts', () => ({ readDiagnostics: async () => ({ record: { final_verified: mock.verified, final_source_sha256: sha256(mock.sources.at(-1)!), final_status: mock.verified ? 'PASS' : 'FAIL', verification_key: 'sha256:' + 'a'.repeat(64) },
  receipt: { evidence_kind: 'live_verification', stages: [{ stage: 'simulation', status: mock.verified ? 'PASS' : 'FAIL', functional_failure: !mock.verified, verdict: { checks: 10, mismatches: mock.verified ? 0 : 10 } }] } }) }))
vi.mock('../src/phase1/repair-policy.ts', () => ({ decideRepair: () => mock.verified ? { rule: 'VERIFIED', action: 'stop' } : { rule: 'FUNCTIONAL_MISMATCH', action: 'propose_repair' } }))

import { apply, Config } from '../src/phase1/p10-model.ts'
const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); mock.sources = []; mock.actions = []; mock.generation = 0; mock.closed = 0; mock.verified = false })

async function setup(command: string) {
  const root = await mkdtemp(join(tmpdir(), 'p10-model-')); roots.push(root)
  const preflight = join(root, 'preflight'); await mkdir(preflight)
  const task = { task_id: 'Prob005_notgate', spec: 'Implement a NOT gate.', interface: { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1 }, { name: 'out', direction: 'output', width: 1 }] } }
  for (const [name, value] of Object.entries({ 'catalog.json': [task], 'selection-order.json': [task.task_id], 'compat-positive-negative-results.json': [{ task_id: task.task_id, evaluable: true }], 'evaluator-policy.json': { defaultTimescale: '1ps/1ps' } })) await writeFile(join(preflight, name), JSON.stringify(value))
  await writeFile(join(root, 'freeze.json'), JSON.stringify({ files: {} }))
  await writeFile(join(root, 'auto.json'), JSON.stringify({ campaignRoot: root, maxToolSteps: 15 }))
  const config = { campaignRoot: root, preflightRoot: preflight, datasetRoot: root, settingsFile: '', p09File: '', autoFile: join(root, 'auto.json'), freezeFile: join(root, 'freeze.json'), allowUnisolatedAutomatic: true,
    model: 'mock', maxTokens: 8192, temperature: 0, timeoutMs: 10000, activeMs: 10000, maxResponseBytes: 65536, compileMs: 1000, elaborateMs: 1000, simulationMs: 1000, totalMs: 5000, maxArtifactBytes: 1000000, artifactPollMs: 100, maxEventBytes: 1048576 } as ReturnType<typeof Config>
  let ready: (() => void) | undefined
  let finish!: (code: number) => void
  const done = new Promise<number>(resolve => { finish = resolve })
  const ctx = { cmdlineArgs: { get: () => [command, task.task_id] }, llm: {}, subprocess: {}, sandboxPolicy: { resolve: () => ({ mode: 'danger-full-access' }) },
    get: (name: string) => name === 'appExit' ? finish : { onReady: (fn: () => void) => { ready = fn } }, effect: (fn: () => unknown) => { fn() } } as unknown as Context
  return { root, config, async execute() { apply(ctx, config); ready!(); expect(await done).toBe(0); return JSON.parse(await readFile(join(root, `${command}-${task.task_id}`, 'result.json'), 'utf8')) } }
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
it('keeps faulty-seed model repair separate and verifies the new revision before export', async () => {
  const s = await setup('repair-control'), result = await s.execute()
  expect(result.status).toBe('VERIFIED'); expect(result.counted_in_model_score).toBe(false)
  expect(result.initial_status).toBe('FAIL'); expect(result.semantic_repairs).toBe(1)
  expect(result.physical_dispatches).toBe(2); expect(result.actions.map((a: { tool: string }) => a.tool)).toEqual(['edit_dut', 'verify_rtl'])
  expect(mock.sources).toHaveLength(2); expect(mock.sources[0]).not.toEqual(mock.sources[1])
  expect(result.final_exported_sha256).toBe(result.verified_source_sha256)
})
it('rejects an altered shared initial source before EDA or a model call', async () => {
  const s = await setup('compare'), initial = join(s.root, 'generate-Prob005_notgate'); await mkdir(initial)
  await writeFile(join(initial, 'initial.sv'), 'altered')
  await writeFile(join(initial, 'result.json'), JSON.stringify({ status: 'GENERATED_UNVERIFIED', source_sha256: 'wrong' }))
  const result = await s.execute()
  expect(result.status).toBe('INITIAL_BINDING_INVALID'); expect(mock.sources).toEqual([]); expect(result.physical_dispatches).toBe(0)
})
