import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import { afterEach, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import Loader from '@deepseek-ai/cordis-plugin-loader'
import Include from '@deepseek-ai/cordis-plugin-include'
import Llm from '@deepseek-ai/dsh-llm'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import Projections from '@deepseek-ai/dsh-session-projection'
import SandboxPolicy from '@deepseek-ai/dsh-sandbox-policy'
import { provideCmdline } from '@deepseek-ai/dsh-cmdline'
import { sha256 } from '../src/phase1/snapshots.ts'
import type { P10Task } from '../src/phase1/p10-dataset.ts'
import { applyPublicInterfaceErratum } from '../src/phase1/p10-interface-errata.ts'
import { originalErratumTask } from './fixtures/p10-interface-errata.ts'
import { bundle, bundleFile, repositoryRoot } from './knowledge-helpers.ts'
import { buildContext, type ContextAudit, type ContextInput, type ContextLimits } from '../src/phase1/p09-context.ts'
import type { KnowledgeContextOptions, KnowledgeUsage } from '../src/knowledge/knowledge-context.ts'
import type { P09Settings } from '../src/phase1/p09-proposal.ts'
import type { Skill01Audit, Skill01Options } from '../src/phase1/skill01.ts'

const mock = vi.hoisted(() => ({ actions: [] as unknown[], sources: [] as string[], pendingStates: [] as boolean[], textSteps: [] as string[], generation: 0, verified: false, closed: 0, outputRoot: '',
  agentSteps: [] as string[], agentInputs: [] as Record<string, unknown>[], generationInputs: [] as Record<string, unknown>[], mismatches: [] as number[], netlistStatus: 'PASS', netlistCalls: 0,
  knowledgeContexts: [] as { prompt: string; audit: ContextAudit }[], knowledgeFunctionalDiagnostic: false, knowledgeFixturePassed: false,
  seedPhysicalEvidence: false, seedBindingFault: '', migrationFixtureActive: false, migrationFixturePassed: false } ))
vi.mock('../src/phase1/p10-netlist.ts', () => ({ acceptanceProtocol: 'p10-netlist-1', acceptNetlist: async () => {
  mock.netlistCalls++; return { path: 'mock-acceptance.json', sha256: 'a'.repeat(64), status: mock.netlistStatus }
} }))
vi.mock('../phase1/p10/acceptance-audit.mjs', () => ({ assertAcceptance: async (reference: { status: string }) => { if (reference?.status !== 'PASS') throw new Error('P10_ACCEPTANCE_INVALID') } }))
vi.mock('../src/phase1/p09-proposal.ts', async importOriginal => {
  const actual = await importOriginal<typeof import('../src/phase1/p09-proposal.ts')>()
  return { readP09Settings: async () => ({ variant: 'C', maxRequests: 15,
    limits: { window: 131072, output: 8192, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 } }),
    loadP09Skills: async (settings: P09Settings) => settings.skillsFile ? actual.loadP09Skills(settings) : [], retrieveP09Skills: async () => ({ skills: [] }) }
})
vi.mock('../src/phase1/p09-claims.ts', () => ({ reserveDispatch: async () => ({ sequence: 1 }) }))
vi.mock('../src/phase1/p09-action-call.ts', () => ({ checkCounterRuntime: async () => ({}), countActionWire: async () => 1,
  callAction: async (args: { input: ContextInput; history: unknown[]; model: unknown; p09: { limits: ContextLimits }; claim: (s: string) => Promise<void>; sequence: number; knowledge?: KnowledgeContextOptions; experimentalSkill01?: Skill01Options }) => {
    await args.claim('model-' + args.sequence)
    mock.pendingStates.push((args.input as { pending_verification?: boolean }).pending_verification === true)
    mock.agentInputs.push(JSON.parse(JSON.stringify({ input: args.input, history: args.history, model: args.model, p09: args.p09 })))
    let knowledge: KnowledgeUsage | undefined
    let skill01: Skill01Audit | undefined
    if (args.knowledge || args.experimentalSkill01) {
      const built = await buildContext(args.input, args.p09.limits, { quality: 'estimated', identity: { implementation: 'p10-knowledge-mock-bytes' },
        async count(view) { return args.experimentalSkill01 ? Math.ceil(Buffer.byteLength(JSON.stringify(view)) / 4) : Buffer.byteLength(JSON.stringify(view)) } }, new AbortController().signal, undefined, args.knowledge, args.experimentalSkill01)
      mock.knowledgeContexts.push({ prompt: built.prompt, audit: built.audit }); knowledge = built.audit.knowledge; skill01 = built.audit.experimental_skill_01
    }
    const step = mock.agentSteps.shift() ?? (args.sequence === 1 ? 'edit_dut' : 'verify_rtl')
    if (step === 'truncated' || step === 'context') return { dispatched: true, error_code: step === 'truncated' ? 'OUTPUT_TRUNCATED' : 'CONTEXT_LENGTH_EXCEEDED',
      retryable: false, prompt_sha256: sha256('request-' + args.sequence), request_wall_ms: 1, prompt_tokens: 10, completion_tokens: 5, message: null,
      ...(knowledge ? { knowledge } : {}), ...(skill01 ? { experimental_skill_01: skill01 } : {}) }
    const name = step.startsWith('edit-') ? 'edit_dut' : step
    let source = step === 'edit-directive' ? 'module TopModule(input in, output out);\n// synthesis off\nassign out=~in;\n// synthesis on\nendmodule' : step === 'edit-same' ? mock.sources.at(-1)! : step === 'edit-whitespace' ? '\n' + mock.sources.at(-1)! + '\n' : step.startsWith('edit-bad') ? 'module TopModule(input in, output out); assign out = 0; endmodule\n//' + step + '\n' : 'module TopModule(input in, output out); assign out = ~in; endmodule\n'
    if (step === 'edit-summary' || step === 'edit-array-summary') source = '// SKILL01_SUMMARY: ' + JSON.stringify({
      rules: { initial: 'UNSPECIFIED', reset: 'NOT_OBSERVED', edge: step === 'edit-array-summary' ? ['SPECIFIED'] : 'SPECIFIED', enable: 'UNSPECIFIED', state: 'SPECIFIED', output: 'SPECIFIED' },
      spec_quote: args.input.task.spec, rtl_quote: args.input.current!.source, hypothesis: 'Synthetic fixture update', action: 'One candidate edit', limitations: 'Fixture evidence only' }) + '\n' + source
    const action = name === 'edit_dut' ? { expected_revision_id: args.input.current!.revision_id, source } : name === 'verify_rtl' ? { revision_id: args.input.current!.revision_id, test_suite_id: 'Prob005_notgate' } : {}
    mock.actions.push(action)
    return { dispatched: true, error_code: null, retryable: false, prompt_sha256: sha256('request-' + args.sequence), request_wall_ms: 1, ...(knowledge ? { knowledge } : {}),
      ...(skill01 ? { experimental_skill_01: skill01 } : {}),
      prompt_tokens: 10, completion_tokens: 5, message: { role: 'assistant', id: 'test', source: { kind: 'model' }, content: [{ type: 'tool-call', id: 'call-' + args.sequence, name, arguments: JSON.stringify(action) }] } }
  } }))
vi.mock('../src/phase1/doctor.ts', () => ({ readDoctorConfig: async () => ({ config: { expectedVivadoVersion: '2026.1' } }) }))
vi.mock('../src/phase1/p10-compat.ts', () => ({ loadCompatAssets: async () => ({ assets: { 'rtl/solution.sv': 'HOST_ONLY_WRAPPER', 'trusted/ref.sv': 'HOST_ONLY_REFERENCE' }, evaluation: {} }),
  negativeControl: () => 'module TopModule(input in, output out); assign out = in; endmodule\n' }))
vi.mock('../src/phase1/model.ts', () => ({ callText: async (_runtime: unknown, settings: { maxTokens: number; reasoningEffort?: string }, _prompt: string, recorder: { directory: string }, _link: unknown, signal: AbortSignal,
  observe: ((value: unknown) => void) | undefined, build: ((prepared: unknown, signal: AbortSignal) => Promise<unknown>) | undefined) => {
  mock.generation++
  if (build) {
    const built = await build({ config: { provider: 'deepseek-official', model: 'mock', maxTokens: settings.maxTokens, temperature: 0, reasoningEffort: settings.reasoningEffort }, context: { contextWindow: 131072 }, adapterDefaults: {},
      retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 } }, signal) as { prompt: string }
    mock.generationInputs.push({ settings, input: JSON.parse(built.prompt) })
  }
  await writeFile(join(recorder.directory, 'reasoning.txt'), 'Prior draft analysis, not a final answer.')
  const step = mock.textSteps.shift() ?? 'success'
  const base = { schema_version: '1.1', dispatched: true, usage: { prompt_tokens: 10, completion_tokens: 5 }, timing: { request_wall_ms: 1 } }
  if (step === 'not-dispatched') {
    observe?.({ code: 'MODEL_CONFIGURATION_ERROR', response_bytes: 0, phase: 'prepare' })
    return { ...base, dispatched: false, usage: { prompt_tokens: null, completion_tokens: null }, content: '', truncated: false, error: { category: 'configuration' } }
  }
  if (step === 'cancelled') {
    await new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('ABORTED')), { once: true }))
    throw new Error('UNREACHABLE')
  }
  if (step === 'transport') { observe?.({ code: 'TRANSPORT', http_status: null, network_code: 'ECONNRESET', response_bytes: 0, phase: 'stream' }); return { ...base, content: '', truncated: false, error: { category: 'connection' } } }
  if (step === 'partial') { observe?.({ code: 'TRANSPORT', http_status: 200, response_bytes: 42, model_output_observed: true }); return { ...base, content: 'module TopModule(', truncated: false, error: { category: 'connection' } } }
  if (step === 'reasoning-only') { observe?.({ code: null, http_status: 200, response_bytes: 42, model_output_observed: true }); return { ...base, content: '', truncated: true, error: { category: 'truncated' } } }
  observe?.({ code: null, http_status: null, network_code: null, response_bytes: step === 'truncated' ? 100 : 80, phase: 'stream' })
  return { ...base, content: step === 'directive' ? 'module TopModule(input in, output out);\n// synthesis translate_off\nassign out=~in;\n// synthesis translate_on\nendmodule' : step === 'invalid' ? 'not HDL' : step === 'truncated' ? 'module TopModule(' : 'module TopModule(input in, output out); assign out = ~in; endmodule\n', truncated: step === 'truncated', error: step === 'truncated' ? { category: 'truncated' } : null }
} }))
vi.mock('../src/phase1/verification.ts', () => ({ VerificationRunner: class {
  constructor(_subprocess: unknown, config: { outputRoot: string }) { mock.outputRoot = config.outputRoot }
  async registerDataset(assets: Record<string, string>) { mock.sources.push(assets['rtl/solution.sv']!); return 'snapshot' }
  async verify() { mock.verified = mock.sources.at(-1)!.includes('~in'); const artifacts = join(mock.outputRoot, 'run-' + mock.sources.length); await mkdir(artifacts, { recursive: true }); await writeFile(join(artifacts, 'result.json'), '{}'); return { status: mock.verified ? 'PASS' : 'FAIL', artifacts } }
  async close() { mock.closed++ }
} }))
vi.mock('../src/phase1/repair-diagnostics.ts', () => ({ readDiagnostics: async () => ({ record: { stages: {}, final_verified: mock.verified, final_source_sha256: sha256(mock.sources.at(-1)!), final_status: mock.verified ? 'PASS' : 'FAIL', verification_key: mock.seedBindingFault === 'key' ? 'wrong-key' : 'sha256:' + 'a'.repeat(64) },
  receipt: { inputs: mock.seedPhysicalEvidence ? [{ path: 'snapshot-synthetic/rtl/solution.sv', sha256: mock.seedBindingFault === 'physical' ? '0'.repeat(64) : sha256(mock.sources.at(-1)!), issue: null }] : [], original_run: join(mock.outputRoot, 'run-' + mock.sources.length), result_sha256: sha256('{}'), evidence_kind: mock.seedBindingFault === 'replay' ? 'diagnostic_replay' : 'live_verification',
    stages: ['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => ({ stage, status: mock.verified || stage === 'compile' || stage === 'elaborate' ? 'PASS' : stage === 'simulation' ? 'FAIL' : 'SKIPPED', complete: true, process_normal: true, process_clean: true,
      diagnostics: mock.knowledgeFunctionalDiagnostic && stage === 'simulation' && !mock.verified ? [{ kind: 'functional_mismatch', category: 'functional_mismatch',
        message_id: null, severity: 'ERROR', origin: 'unknown', attribution: 'UNKNOWN', repairable_by_model: false, file: null, line: null,
        message: 'Observed verdict: records=1, checks=224, mismatches=93, fatal=false; process_clean=true.', invocation: 'simulation' }] : [],
      functional_failure: stage === 'simulation' && !mock.verified, verdict: { completed: true, checks: 224, mismatches: mock.verified ? 0 : mock.mismatches[mock.sources.length - 1] ?? 93 } })) } }) }))
vi.mock('../src/phase1/repair-policy.ts', () => ({ decideRepair: (_facts: unknown, context: { attempts: number; maxAttempts: number }) => mock.verified ? { rule: 'VERIFIED', action: 'stop' }
  : context.attempts >= context.maxAttempts ? { rule: 'REPAIR_BUDGET', action: 'stop' } : { rule: 'FUNCTIONAL_MISMATCH', action: 'propose_repair' } }))

import { apply, Config } from '../src/phase1/p10-model.ts'
import * as P10Model from '../src/phase1/p10-model.ts'
const roots: string[] = []
const loaderContexts: Context[] = []
afterEach(async () => {
  for (const ctx of loaderContexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) {
    if (mock.knowledgeFunctionalDiagnostic && !mock.knowledgeFixturePassed || mock.migrationFixtureActive && !mock.migrationFixturePassed) console.error('P10 Loader failure artifacts: ' + root)
    else await rm(root, { recursive: true, force: true })
  }
  mock.sources = []; mock.actions = []; mock.pendingStates = []; mock.textSteps = []; mock.generation = 0; mock.closed = 0; mock.verified = false; mock.outputRoot = ''; mock.agentSteps = []; mock.agentInputs = []; mock.generationInputs = []; mock.mismatches = []; mock.netlistStatus = 'PASS'; mock.netlistCalls = 0; mock.knowledgeContexts = []
  mock.knowledgeFunctionalDiagnostic = false; mock.knowledgeFixturePassed = false
  mock.seedPhysicalEvidence = false; mock.seedBindingFault = ''; mock.migrationFixtureActive = false; mock.migrationFixturePassed = false
})

async function setup(command: string, task: Pick<P10Task, 'task_id' | 'spec' | 'interface' | 'public_interface_erratum'> = { task_id: 'Prob005_notgate', spec: 'Implement a NOT gate.', interface: { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1 }, { name: 'out', direction: 'output', width: 1 }] } }, throughLoader = false) {
  const root = await mkdtemp(join(tmpdir(), 'p10-model-')); roots.push(root)
  const preflight = join(root, 'preflight'); await mkdir(preflight)
  for (const [name, value] of Object.entries({ 'catalog.json': [task], 'selection-order.json': [task.task_id], 'compat-positive-negative-results.json': [{ task_id: task.task_id, evaluable: true }], 'evaluator-policy.json': { defaultTimescale: '1ps/1ps' } })) await writeFile(join(preflight, name), JSON.stringify(value))
  await writeFile(join(root, 'freeze.json'), JSON.stringify({ files: {} }))
  await writeFile(join(root, 'auto.json'), JSON.stringify({ campaignRoot: root, bucket: 'preflight', registry: 'full', maxToolSteps: 15 }))
  const config = { campaignRoot: root, preflightRoot: preflight, datasetRoot: root, settingsFile: '', p09File: '', autoFile: join(root, 'auto.json'), freezeFile: join(root, 'freeze.json'), allowUnisolatedAutomatic: true,
    model: 'mock', maxTokens: 8192, temperature: 0, timeoutMs: 10000, activeMs: 10000, maxResponseBytes: 65536,
    maxTransportRetries: 2, transportBackoffMs: [1, 2], maxOutputRecoveryAttempts: 1, maxGenerationResumes: 1, selectedTaskCount: 10,
    repairMaxTokens: 16384, forcedActionMaxTokens: 4096, repairMaxResponseBytes: 262144, compactThreshold: 0.8, maxRepairRounds: 3,
    maxAgentRequests: 14, campaignMaxDispatches: 375, maxCandidateRecoveryAttempts: 1, generationRecoveryMaxTokens: 16384, generationRecoveryMaxResponseBytes: 262144,
    compileMs: 1000, elaborateMs: 1000, simulationMs: 1000, totalMs: 5000, netlistMs: 1000, maxArtifactBytes: 1000000, artifactPollMs: 100, maxEventBytes: 1048576 } as ReturnType<typeof Config>
  let ready: (() => void) | undefined
  let cleanup: (() => Promise<void>) | undefined
  let finish!: (code: number) => void
  let done: Promise<number>
  let invokedCommand = command
  let runningLoader: Context | undefined
  const ctx = { cmdlineArgs: { get: () => [invokedCommand, task.task_id] }, llm: {}, subprocess: {}, sandboxPolicy: { resolve: () => ({ mode: 'danger-full-access' }) },
    get: (name: string) => name === 'appExit' ? finish : { onReady: (fn: () => void) => { ready = fn } }, effect: (fn: () => unknown) => {
      const value = fn(); if (typeof value === 'function') cleanup = value as () => Promise<void>
    } } as unknown as Context
  return { root, config, async execute(cancel = false, resume = false, exit = 0) { invokedCommand = resume ? 'resume-generate' : command; done = new Promise<number>(resolve => { finish = resolve })
    if (throughLoader) {
      await runningLoader?.fiber.dispose()
      const loader = new Context(); loaderContexts.push(loader); loader.baseUrl = pathToFileURL(root).href + '/'
      runningLoader = loader
      provideCmdline(loader, { args: [invokedCommand, task.task_id], exit: finish, ready: { onReady(fn) { ready = fn; return () => { ready = undefined } } } })
      await loader.plugin(Loader); loader.loader.builtins.include = Include
      const modules = new Map<string, unknown>([['llm', Llm], ['subprocess', LocalSubprocess], ['projections', Projections], ['policy', SandboxPolicy], ['p10', P10Model]])
      loader.loader.internal = { version: 'v2', async import(name: string) { if (!modules.has(name)) throw new Error('Unknown test plugin'); return modules.get(name) } } as unknown as NonNullable<typeof loader.loader.internal>
      const file = join(root, 'loader.json')
      await writeFile(file, JSON.stringify([{ name: 'llm' }, { name: 'subprocess' }, { name: 'projections' },
        { name: 'policy', config: { mode: 'danger-full-access', workspaceRoot: root } }, { name: 'p10', config }]))
      await loader.loader.create({ name: 'cordis:include', config: { path: pathToFileURL(file).href } }); await loader.loader.await()
    } else apply(ctx, config)
    ready!(); if (cancel) setTimeout(() => void cleanup?.(), 0)
    expect(await done).toBe(exit); return JSON.parse(await readFile(join(root, `${command}-${task.task_id}`, 'result.json'), 'utf8')) } }
}

async function frozenSeed(s: Awaited<ReturnType<typeof setup>>) {
  const file = join(s.root, 'frozen-historical.sv'), source = 'module TopModule(input in, output out); assign out=in; endmodule\r\n// Frozen historical fixture\r\n'
  await writeFile(file, source)
  Object.assign(s.config, { repairSeedFile: file, repairSeedSha256: sha256(source) })
  await writeFile(s.config.freezeFile, JSON.stringify({ files: { [file]: sha256(source) } }))
  mock.seedPhysicalEvidence = true; mock.migrationFixtureActive = true
  return source
}
it('runs the frozen historical seed command through Loader with fresh physical diagnostics and the existing netlist gate', async () => {
  const s = await setup('repair-seed', undefined, true), source = await frozenSeed(s)
  mock.knowledgeFunctionalDiagnostic = true
  const result = await s.execute()
  expect(result).toMatchObject({ status: 'VERIFIED', evaluation_population: 'FIXED_HISTORICAL_REPAIR_SEED', counted_in_model_score: false,
    initial_generation_logical_requests: 0, seed_sha256: sha256(source), physical_dispatches: 2, semantic_repairs: 1 })
  expect(mock.sources[0]).toBe(source); expect(mock.generation).toBe(0); expect(result.control_seed).toBeUndefined()
  expect(result.seed_binding).toMatchObject({ source_sha256: sha256(source), evidence_kind: 'live_verification', verification_key: 'sha256:' + 'a'.repeat(64),
    physical_dut: { sha256: sha256(source), issue: null }, diagnostic_origins: ['unknown'] })
  expect(mock.netlistCalls).toBe(1)
  const diagnostic = JSON.parse(await readFile(join(s.root, 'repair-seed-Prob005_notgate/seed-diagnostics-1.json'), 'utf8'))
  expect(result.seed_binding.diagnostics_sha256).toBe(sha256(JSON.stringify(diagnostic)))
  mock.migrationFixturePassed = true; mock.knowledgeFixturePassed = true
})
it.each(['unfrozen', 'wrong-config-hash'] as const)('refuses a %s historical seed instead of replacing it with a negative control', async fault => {
  const s = await setup('repair-seed', undefined, true); await frozenSeed(s)
  if (fault === 'unfrozen') await writeFile(s.config.freezeFile, JSON.stringify({ files: {} }))
  else s.config.repairSeedSha256 = '0'.repeat(64)
  const result = await s.execute()
  expect(result.status).toBe('REPAIR_SEED_NOT_FROZEN'); expect(result.physical_dispatches).toBe(0)
  expect(mock.sources).toEqual([]); expect(mock.agentInputs).toEqual([]); expect(mock.generation).toBe(0)
  mock.migrationFixturePassed = true
})
it.each(['physical', 'key', 'replay'] as const)('preserves and rejects a seed %s receipt before model repair', async fault => {
  const s = await setup('repair-seed', undefined, true); await frozenSeed(s); mock.seedBindingFault = fault
  const result = await s.execute()
  expect(result.status).toBe('REPAIR_SEED_DIAGNOSTICS_BINDING_INVALID'); expect(result.physical_dispatches).toBe(0)
  expect(mock.sources).toHaveLength(1); expect(mock.agentInputs).toEqual([])
  expect(JSON.parse(await readFile(join(s.root, 'repair-seed-Prob005_notgate/seed-diagnostics-1.json'), 'utf8')).evidence_kind).toBe(fault === 'replay' ? 'diagnostic_replay' : 'live_verification')
  mock.migrationFixturePassed = true
})
it.each(['complete', 'absent', 'array'] as const)('audits the %s submitted summary through the Skill01 Loader entry while preserving Host source acceptance', async form => {
  const task = { task_id: 'Prob005_notgate', spec: 'Invert in. Update the output on the positive edge of the clock.',
    interface: { top: 'TopModule', ports: [{ name: 'in', direction: 'input' as const, width: 1 }, { name: 'out', direction: 'output' as const, width: 1 }] } }
  const s = await setup('repair-seed', task, true); await frozenSeed(s)
  const file = resolve(import.meta.dirname, '../phase3/skill01/skills.draft-v5.json'), stored = await bundle()
  Object.assign(s.config, { experimentalSkill01: true, skill01File: file, skill01BundleHash: sha256(await readFile(file)), skill01MaxTokens: 512,
    knowledgeFile: bundleFile, knowledgeBundleHash: stored.manifest.bundle_sha256, knowledgeEvidenceRoot: repositoryRoot, knowledgeTopK: 3, knowledgeMaxTokens: 768 })
  mock.knowledgeFunctionalDiagnostic = true
  mock.agentSteps = [form === 'complete' ? 'edit-summary' : form === 'array' ? 'edit-array-summary' : 'edit_dut', 'verify_rtl']
  const result = await s.execute(), procedure = result.experimental_skill_01, edit = procedure.accepted_changed_edits[0]
  expect(result.status).toBe('VERIFIED'); expect(result.semantic_repairs).toBe(1)
  expect(procedure).toMatchObject({ enabled: true, version: '0.5.0', status: 'draft', max_tokens: 512, combined_skills_max_tokens: 768, injected: true })
  expect(procedure.requests).toHaveLength(2); expect(procedure.requests[0]).toMatchObject({ dispatched: true, usage: { injected: true } })
  expect(procedure.requests[0].usage.token_count).toBeLessThanOrEqual(512)
  expect(procedure.requests[1].usage.injected).toBe(false)
  expect(edit).toMatchObject({ dispatched: true, injected: true, host_accepted: true, source_sha_changed: true, binding_complete: true,
    pre_edit_source_sha256: result.seed_sha256, verification: { accepted: true, persisted: true }, summary: { strict: form === 'complete' } })
  expect(edit.submitted_source_sha256).toBe(sha256(mock.sources[1]!))
  expect(edit.summary.reason).toBe(form === 'complete' ? 'STRICT_BOUND_SUMMARY_OBSERVED_NOT_CAUSAL_PROOF' : form === 'array' ? 'NON_SCALAR_RULE_SUMMARY' : 'NO_SUMMARY')
  expect(mock.sources[1]!.includes('SKILL01_SUMMARY')).toBe(form !== 'absent')
  expect(result.knowledge.enabled).toBe(true); expect(result.knowledge.requests).toHaveLength(2)
  mock.migrationFixturePassed = true; mock.knowledgeFixturePassed = true
})
it.each(['missing-file', 'wrong-hash', 'historical-version'] as const)('refuses Skill01 %s at Loader before EDA or a model call', async fault => {
  const s = await setup('repair-seed', undefined, true); await frozenSeed(s)
  const file = resolve(import.meta.dirname, fault === 'historical-version' ? 'fixtures/skill01/skills.draft-v4.json' : '../phase3/skill01/skills.draft-v5.json')
  Object.assign(s.config, { experimentalSkill01: true, skill01File: file, skill01BundleHash: sha256(await readFile(file)), skill01MaxTokens: 512 })
  if (fault === 'missing-file') s.config.skill01File = ''
  if (fault === 'wrong-hash') s.config.skill01BundleHash = '0'.repeat(64)
  await expect(s.execute(false, false, 1)).rejects.toMatchObject({ code: 'ENOENT' })
  expect(mock.sources).toEqual([]); expect(mock.agentInputs).toEqual([]); expect(mock.generation).toBe(0)
  mock.migrationFixturePassed = true
})
it('rejects a Skill01 cap above the frozen 512-token limit at configuration parsing', async () => {
  const s = await setup('repair-seed')
  expect(() => Config({ ...s.config, skill01MaxTokens: 513 })).toThrow()
  expect(mock.sources).toEqual([]); expect(mock.agentInputs).toEqual([]); expect(mock.generation).toBe(0)
})

it('runs the P10 entry with Knowledge disabled by default and preserves the generated request', async () => {
  const s = await setup('generate', undefined, true); Object.assign(s.config, Config(s.config))
  const result = await s.execute()
  expect(s.config).toMatchObject({ knowledgeFile: '', knowledgeBundleHash: '', knowledgeEvidenceRoot: '' })
  expect(s.config.experimentalSkill01).toBe(false); expect(result.experimental_skill_01).toBeUndefined()
  expect(result.knowledge).toMatchObject({ enabled: false, bundle_hash: null, injected: false, retrieval_count: 0, token_count: 0, requests: [] })
  expect(mock.generationInputs).toHaveLength(1)
  expect(mock.generationInputs[0]!.input).not.toHaveProperty('diagnostic_knowledge')
  expect(mock.knowledgeContexts).toEqual([])
})
it('loads the pinned Knowledge bundle through the P10 entry and retains its repair injection audit', async () => {
  const s = await setup('repair-control', undefined, true), stored = await bundle()
  mock.knowledgeFunctionalDiagnostic = true
  Object.assign(s.config, { knowledgeFile: bundleFile, knowledgeBundleHash: stored.manifest.bundle_sha256, knowledgeEvidenceRoot: repositoryRoot, knowledgeTopK: 3, knowledgeMaxTokens: 3000 })
  const result = await s.execute()
  expect(result.status).toBe('VERIFIED')
  expect(result.knowledge).toMatchObject({ enabled: true, bundle_hash: stored.manifest.bundle_sha256, eligible: true, retrieved: true, injected: true,
    ids: ['diagnostic.functional_mismatch'], versions: ['0.1.0'] })
  expect(result.knowledge.token_count).toBeGreaterThan(0)
  expect(result.knowledge.requests).toHaveLength(2)
  expect(result.knowledge.requests[0]).toMatchObject({ dispatched: true, usage: { bundle_hash: stored.manifest.bundle_sha256, injected: true, count_quality: 'estimated' } })
  const injected = JSON.parse(mock.knowledgeContexts[0]!.prompt).diagnostic_knowledge
  expect(injected.matches[0]).toMatchObject({ knowledge_id: 'diagnostic.functional_mismatch', limitations: expect.any(Array) })
  expect(injected.matches[0].limitations.length).toBeGreaterThan(0)
  expect(mock.knowledgeContexts[1]!.audit.knowledge?.injected).toBe(false)
  mock.knowledgeFixturePassed = true
})
it.each(['missing-file', 'missing-hash', 'missing-evidence-root', 'wrong-hash'] as const)('refuses Knowledge %s at the P10 entry before any model or EDA operation', async fault => {
  const s = await setup('repair-control', undefined, true), stored = await bundle()
  Object.assign(s.config, { knowledgeFile: bundleFile, knowledgeBundleHash: stored.manifest.bundle_sha256, knowledgeEvidenceRoot: repositoryRoot, knowledgeTopK: 3, knowledgeMaxTokens: 768 })
  if (fault === 'missing-file') s.config.knowledgeFile = ''
  if (fault === 'missing-hash') s.config.knowledgeBundleHash = ''
  if (fault === 'missing-evidence-root') s.config.knowledgeEvidenceRoot = ''
  if (fault === 'wrong-hash') s.config.knowledgeBundleHash = '0'.repeat(64)
  await expect(s.execute(false, false, 1)).rejects.toMatchObject({ code: 'ENOENT' })
  expect(mock.generation).toBe(0); expect(mock.agentInputs).toEqual([]); expect(mock.sources).toEqual([])
})
it('keeps a successfully built Knowledge context undispatched when the model call never starts', async () => {
  const s = await setup('generate', undefined, true), stored = await bundle()
  Object.assign(s.config, { knowledgeFile: bundleFile, knowledgeBundleHash: stored.manifest.bundle_sha256, knowledgeEvidenceRoot: repositoryRoot, knowledgeTopK: 3, knowledgeMaxTokens: 768 })
  mock.textSteps = ['not-dispatched']
  const result = await s.execute()
  expect(mock.generationInputs).toHaveLength(1)
  expect(result.physical_dispatches).toBe(0)
  expect(result.knowledge).toMatchObject({ enabled: true, retrieval_count: 1, injected: false, token_count: 0 })
  expect(result.knowledge.requests).toHaveLength(1)
  expect(result.knowledge.requests[0]).toMatchObject({ dispatched: false, usage: { bundle_hash: stored.manifest.bundle_sha256 } })
  const audit = JSON.parse(await readFile(join(result.model_runs[0], 'context-audit.json'), 'utf8'))
  expect(result.knowledge.requests[0].usage).toEqual(audit.knowledge)
})
it('preserves all Knowledge request audits when a transport-paused generation resumes through Loader', async () => {
  const s = await setup('generate', undefined, true), stored = await bundle()
  Object.assign(s.config, { knowledgeFile: bundleFile, knowledgeBundleHash: stored.manifest.bundle_sha256, knowledgeEvidenceRoot: repositoryRoot, knowledgeTopK: 3, knowledgeMaxTokens: 768 })
  mock.textSteps = ['transport', 'transport', 'transport']
  const paused = await s.execute()
  expect(paused.status).toBe('INFRA_PAUSED')
  expect(paused.knowledge.requests).toHaveLength(3)
  expect(paused.knowledge.requests.every((receipt: { dispatched: boolean }) => receipt.dispatched)).toBe(true)
  const checkpoint = JSON.parse(await readFile(join(s.root, 'generate-Prob005_notgate/result-window-0.json'), 'utf8'))
  expect(checkpoint.knowledge.requests).toEqual(paused.knowledge.requests)
  mock.textSteps = ['success']
  const resumed = await s.execute(false, true)
  expect(resumed.status).toBe('GENERATED_UNVERIFIED')
  expect(resumed.physical_dispatches).toBe(4)
  expect(resumed.knowledge).toMatchObject({ enabled: true, bundle_hash: stored.manifest.bundle_sha256, retrieval_count: 4, token_count: 0 })
  expect(resumed.knowledge.requests).toHaveLength(4)
  expect(resumed.knowledge.requests.slice(0, 3)).toEqual(paused.knowledge.requests)
  for (const [index, directory] of resumed.model_runs.entries()) {
    const audit = JSON.parse(await readFile(join(directory, 'context-audit.json'), 'utf8'))
    expect(resumed.knowledge.requests[index]).toEqual({ dispatched: true, usage: audit.knowledge })
  }
})

it.each(['Prob031_dff', 'Prob062_bugs_mux2'] as const)('records the same approved %s public interface and erratum for generation and agent repair', async id => {
  const task = applyPublicInterfaceErratum(originalErratumTask(id))
  await (await setup('generate', task)).execute()
  const generatedTask = (mock.generationInputs[0]!.input as { task: unknown }).task
  expect(generatedTask).toMatchSnapshot()
  const comparison = await setup('compare', task), initial = join(comparison.root, `generate-${id}`)
  await mkdir(initial)
  const source = id === 'Prob031_dff' ? 'module TopModule(input clk, d, output q); assign q=d; endmodule' : 'module TopModule(input sel, input [7:0] a,b, output [7:0] out); assign out=a; endmodule'
  await writeFile(join(initial, 'initial.sv'), source)
  await writeFile(join(initial, 'result.json'), JSON.stringify({ status: 'GENERATED_UNVERIFIED', source_sha256: sha256(source) }))
  mock.agentSteps = ['finish']
  await comparison.execute()
  expect((mock.agentInputs[0]!.input as { task: unknown }).task).toEqual(generatedTask)
  expect(generatedTask).toMatchObject({ spec: task.spec, interface: task.interface, constraints: expect.stringContaining(task.public_interface_erratum!.explanation) })
})

it.each(['NETLIST_MISMATCH', 'NETLIST_TIMEOUT', 'NETLIST_TOOL_ERROR', 'NETLIST_EVIDENCE_MISSING', 'NETLIST_NOT_CALIBRATED'])('never exports a four-stage repair pass with %s', async status => {
  const s = await setup('repair-control'); mock.netlistStatus = status
  const result = await s.execute()
  expect(result.status).toBe(status); expect(result.recovered_by_agent).toBe(false)
  expect(result.verified_source_sha256).toBeNull(); expect(mock.netlistCalls).toBe(1)
  expect(result.revision_decisions[0]).toMatchObject({ decision: 'NETLIST_REJECTED', rolled_back: false })
  expect(result.actions[1].revision).toBe(result.repair_attempts[0].edit.revision_id)
  await expect(readFile(join(s.root, 'repair-control-Prob005_notgate/final.sv'))).rejects.toMatchObject({ code: 'ENOENT' })
})
it('applies the same netlist gate to the shared Baseline without model requests', async () => {
  const s = await setup('compare'), directory = join(s.root, 'generate-Prob005_notgate'); await mkdir(directory)
  const source = 'module TopModule(input in, output out); assign out=~in; endmodule'
  await writeFile(join(directory, 'initial.sv'), source)
  await writeFile(join(directory, 'result.json'), JSON.stringify({ status: 'GENERATED_UNVERIFIED', source_sha256: sha256(source) }))
  mock.netlistStatus = 'NETLIST_MISMATCH'
  const result = await s.execute()
  expect(result.initial_status).toBe('NETLIST_MISMATCH'); expect(result.status).toBe('NETLIST_MISMATCH')
  expect(result.physical_dispatches).toBe(0); expect(mock.netlistCalls).toBe(1)
})
it('rejects directives during generation and bounded recovery with source identity and location', async () => {
  const s = await setup('generate'); mock.textSteps = ['directive', 'directive']
  const result = await s.execute()
  expect(result.status).toBe('RTL_SYNTHESIS_DIRECTIVE_REJECTED'); expect(mock.sources).toHaveLength(0)
  expect(result.generation_attempts).toHaveLength(2)
  expect(result.generation_attempts[0]).toMatchObject({ source_sha256: expect.any(String), candidate_rejection: { stage: 'rtl_policy', detail: 'line=2; directive=translate_off' } })
})
it('rejects directive edits without charging semantic repairs or executing EDA', async () => {
  const s = await setup('repair-control'); mock.agentSteps = ['edit-directive', 'finish']
  const result = await s.execute()
  expect(result.semantic_repairs).toBe(0); expect(mock.sources).toHaveLength(1)
  expect(result.actions[0]).toMatchObject({ accepted: false, observation: { error: 'RTL_SYNTHESIS_DIRECTIVE_REJECTED', line: 2 } })
})
it('rechecks a stored candidate before its first EDA invocation', async () => {
  const s = await setup('compare'), directory = join(s.root, 'generate-Prob005_notgate'); await mkdir(directory)
  const source = 'module TopModule(input in, output out);\n// synthesis off\nassign out=~in; endmodule'
  await writeFile(join(directory, 'initial.sv'), source)
  await writeFile(join(directory, 'result.json'), JSON.stringify({ status: 'GENERATED_UNVERIFIED', source_sha256: sha256(source) }))
  expect((await s.execute()).status).toBe('RTL_SYNTHESIS_DIRECTIVE_REJECTED'); expect(mock.sources).toHaveLength(0)
})
it('reports the request budget when the last request would need another recovery', async () => {
  const s = await setup('repair-control')
  s.config.maxRepairRounds = 1; s.config.maxAgentRequests = 2
  mock.agentSteps = ['read_current_rtl', 'truncated']
  const result = await s.execute()
  expect(result.status).toBe('MODEL_REQUEST_BUDGET_EXHAUSTED')
  expect(result.physical_dispatches).toBe(2); expect(result.semantic_repairs).toBe(0)
  expect(mock.agentInputs).toHaveLength(2)
})

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

it.each([40, 100, 156])('allows frozen task %i only with explicit task-count configuration', async count => {
  const s = await setup('generate')
  const order = [...Array.from({ length: count - 1 }, (_, i) => 'fixed-' + i), 'Prob005_notgate']
  await writeFile(join(s.root, 'preflight/selection-order.json'), JSON.stringify(order))
  s.config.selectedTaskCount = count
  expect((await s.execute()).status).toBe('GENERATED_UNVERIFIED')
  expect(() => Config({ ...s.config, selectedTaskCount: 157 })).toThrow()
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

it('preserves an invalid terminal response when candidate recovery is explicitly disabled', async () => {
  mock.textSteps = ['invalid']
  const s = await setup('generate'); s.config.maxCandidateRecoveryAttempts = 0
  const result = await s.execute()
  expect(result.status).not.toBe('INFRA_PAUSED'); expect(result.generation_attempts[0].response_complete).toBe(true)
  expect(result.candidate_rejection).toEqual({ stage: 'extraction_or_interface', code: 'INVALID_OUTPUT', detail: 'Expected one TopModule' })
  expect(result.generation_attempts[0].candidate_rejection).toEqual(result.candidate_rejection)
  await s.execute(false, true, 1); expect(mock.generation).toBe(1)
})

it.each(['invalid', 'reasoning-only', 'partial'])('recovers %s with logged rejection, prior reasoning and an output-only request', async failure => {
  mock.textSteps = [failure, 'success']
  const result = await (await setup('generate')).execute()
  expect(result.status).toBe('GENERATED_UNVERIFIED'); expect(result.candidate_rejection).toBeNull()
  expect(result.generation_attempts).toHaveLength(2); expect(result.generation_attempts[0].candidate_valid).toBe(false)
  expect(result.generation_attempts[0].candidate_rejection).toBeTruthy()
  expect(result.output_recovery_attempts).toBe(1); expect(result.transport_retries).toBe(0)
  expect(mock.generationInputs[1]).toMatchObject({ settings: { maxTokens: 16384, reasoningEffort: 'off' },
    input: { generation_recovery: { attempt: 1, limit: 1, previous_reasoning: 'Prior draft analysis, not a final answer.' } } })
  expect(result.budget_limits).toMatchObject({ candidate_recoveries: 1, agent_requests: 14 })
})

it('stops candidate recovery at its separate cap without executing a rejected source', async () => {
  mock.textSteps = ['invalid', 'invalid', 'invalid', 'success']
  const s = await setup('generate'); s.config.maxCandidateRecoveryAttempts = 2
  const result = await s.execute()
  expect(result.status).toBe('INVALID_OUTPUT'); expect(result.output_recovery_attempts).toBe(2)
  expect(mock.generation).toBe(3); expect(mock.sources).toHaveLength(0)
  expect(result.generation_attempts.every((attempt: { candidate_valid: boolean }) => !attempt.candidate_valid)).toBe(true)
})

it('generates without evaluator calibration but still refuses to score that task', async () => {
  const s = await setup('generate')
  await writeFile(join(s.root, 'preflight/compat-positive-negative-results.json'), JSON.stringify([{ task_id: 'Prob005_notgate', evaluable: false }]))
  expect(await s.execute()).toMatchObject({ status: 'GENERATED_UNVERIFIED', evaluator_calibrated: false })
  const comparison = await setup('compare')
  await writeFile(join(comparison.root, 'preflight/compat-positive-negative-results.json'), JSON.stringify([{ task_id: 'Prob005_notgate', evaluable: false }]))
  await expect(comparison.execute(false, false, 1)).rejects.toMatchObject({ code: 'ENOENT' })
  expect(mock.sources).toHaveLength(0)
})

it('allows fifteen verified modifications plus forced recovery without the legacy request cap', async () => {
  const s = await setup('repair-control')
  s.config.maxRepairRounds = 15; s.config.maxAgentRequests = 120
  await writeFile(s.config.autoFile, JSON.stringify({ campaignRoot: s.root, bucket: 'preflight', registry: 'full', maxToolSteps: 60 }))
  mock.agentSteps = Array.from({ length: 15 }, (_, index) => ['truncated', `edit-bad-${index}`, 'verify_rtl']).flat()
  const result = await s.execute()
  expect(result.status).toBe('REPAIR_BUDGET'); expect(result.semantic_repairs).toBe(15)
  expect(result.valid_repair_attempts).toBe(15); expect(result.physical_dispatches).toBe(45)
  expect(result.actions).toHaveLength(30); expect(result.output_recovery_attempts).toBe(15)
  expect(result.revision_decisions).toHaveLength(15)
  expect(() => Config({ ...s.config, maxRepairRounds: 16 })).toThrow()
})

it('rejects a tool budget too small for fifteen edit-and-verify rounds before dispatch', async () => {
  const s = await setup('repair-control'); s.config.maxRepairRounds = 15; s.config.maxAgentRequests = 120
  await expect(s.execute(false, false, 1)).rejects.toMatchObject({ code: 'ENOENT' })
  expect(mock.generation).toBe(0); expect(mock.agentInputs).toHaveLength(0)
})

it('reports tool-step exhaustion separately from modification and model-request exhaustion', async () => {
  const s = await setup('repair-control'); s.config.maxAgentRequests = 120
  mock.agentSteps = Array.from({ length: 15 }, () => 'read_current_rtl')
  const result = await s.execute()
  expect(result.status).toBe('TOOL_STEP_BUDGET_EXHAUSTED'); expect(result.semantic_repairs).toBe(0)
  expect(result.physical_dispatches).toBe(15)
})

it('rejects surrounding-whitespace variants of a rejected revision without consuming a modification round', async () => {
  mock.agentSteps = ['edit-bad', 'verify_rtl', 'edit-whitespace', 'edit_dut', 'verify_rtl']
  const result = await (await setup('repair-control')).execute()
  expect(result.status).toBe('VERIFIED'); expect(result.semantic_repairs).toBe(2)
  expect(result.actions[2]).toMatchObject({ accepted: false, observation: { error: 'REJECTED_REVISION' } })
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
  expect(mock.agentInputs[2]).toMatchObject({ history: [], input: { previous_tool_result: { tool: 'edit_dut', accepted: true } } })
})

it('does not replay a thinking-disabled tool turn after rejection and retains its host result', async () => {
  mock.agentSteps = ['truncated', 'edit-same', 'edit_dut', 'verify_rtl']
  const result = await (await setup('repair-control')).execute()
  expect(result.status).toBe('VERIFIED'); expect(result.semantic_repairs).toBe(1)
  expect(mock.agentInputs[2]).toMatchObject({ history: [], input: { previous_tool_result: { tool: 'edit_dut', accepted: false, observation: { error: 'REPEATED_CANDIDATE' } } } })
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
