import { mkdtemp, readFile, rm, writeFile, mkdir, link } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { ToolCallId, type StreamChunk } from '@deepseek-ai/dsh-llm'
import { afterEach, expect, it, vi } from 'vitest'
import { checkAutoSource, parseAutoAction, autoTools } from '../src/phase1/p09-auto-policy.ts'
import { claimExperiment, reserveDispatch } from '../src/phase1/p09-claims.ts'
import { finalArtifactManifest } from '../src/phase1/artifact-manifest.ts'
import { RepairWorkflow, type RepairSettings } from '../src/phase1/repair-workflow.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import { fixtureFiles } from '../src/phase1/fixtures.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import type { ModelRuntime } from '../src/phase1/model.ts'
import { taskSpec } from '../src/phase1/p09-tasks.ts'
import { checkCounterRuntime } from '../src/phase1/p09-action-call.ts'
import { skillHash, type SkillEntry } from '../src/phase1/p09-context.ts'

const roots: string[] = [], contexts: Context[] = [], workflows: RepairWorkflow[] = []
afterEach(async () => {
  for (const workflow of workflows.splice(0)) await workflow.close()
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
async function temp() { const root = await mkdtemp(join(tmpdir(), 'p09-auto-')); roots.push(root); return root }
it.each(['$fopen("x","w");', '$system("cmd");', '`include "x"', 'import "DPI-C" function x();', 'force tb.dut.q = 1;', 'assign q = tb.q;', '\\evil identifier;', '$finish;'])('rejects unsafe source without running it: %s', body => {
  expect(() => checkAutoSource('module enable_counter(input clk, rst, en, output reg [3:0] q); ' + body + ' endmodule', taskSpec('enable_counter').public.interface)).toThrow()
})
it('accepts the calibrated single DUT and rejects action path injection', () => {
  const task = taskSpec('enable_counter'); expect(() => checkAutoSource(task.good, task.public.interface)).not.toThrow()
  expect(() => parseAutoAction('edit_dut', JSON.stringify({ expected_revision_id: 'r', source: task.good, path: '../trusted/tb.sv' }))).toThrow('INVALID_ACTION')
  expect(autoTools('minimal').map(t => t.name)).toEqual(['edit_dut', 'verify_rtl'])
  expect(autoTools('full')).toHaveLength(5)
})
it('atomically claims one cell and retains completed claims', async () => {
  const root = await temp()
  const results = await Promise.allSettled([claimExperiment(root, { task: 'x' }, 'one'), claimExperiment(root, { task: 'x' }, 'two')])
  expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1)
  await expect(claimExperiment(root, { task: 'x' }, 'three')).rejects.toThrow('EXPERIMENT_ALREADY_CLAIMED')
})
it('serializes claims and dispatch reservations across independent processes', async () => {
  const root = await temp(), module = new URL('../src/phase1/p09-claims.ts', import.meta.url).href
  const script = `import {claimExperiment,reserveDispatch} from ${JSON.stringify(module)};
    const root=process.argv[1]; let claimed=false;
    try { await claimExperiment(root,{task:'same'},String(process.pid)); claimed=true } catch(e) { if(e.message!=='EXPERIMENT_ALREADY_CLAIMED') throw e }
    const ticket=await reserveDispatch(root,'preflight',{pid:process.pid},new AbortController().signal);
    console.log(JSON.stringify({claimed,ticket}));`
  const results = await Promise.all([1, 2].map(() => promisify(execFile)(process.execPath, ['--import', 'tsx/esm', '--input-type=module', '-e', script, root])))
  const records = results.map(r => JSON.parse(r.stdout))
  expect(records.filter(r => r.claimed)).toHaveLength(1)
  expect(new Set(records.map(r => r.ticket)).size).toBe(2)
}, 30000)
it('reserves shared dispatch tickets without duplicate allocation and stops at the partition cap', async () => {
  const root = await temp(), signal = new AbortController().signal
  const tickets = await Promise.all(Array.from({ length: 4 }, (_, i) => reserveDispatch(root, 'preflight', { i }, signal)))
  expect(new Set(tickets).size).toBe(4)
  for (let i = 4; i < 150; i++) await writeFile(join(root, 'dispatches', String(i + 1).padStart(4, '0') + '.json'), JSON.stringify({ bucket: 'preflight' }))
  await expect(reserveDispatch(root, 'preflight', {}, signal)).rejects.toThrow('CAMPAIGN_BUDGET_EXHAUSTED')
})
it('indexes terminal event bytes and hashes, excluding only its own manifest', async () => {
  const root = await temp()
  await writeFile(join(root, 'events.jsonl'), '{"type":"run_finished"}\n')
  await writeFile(join(root, 'result.json'), '{}')
  const manifest = await finalArtifactManifest(root)
  expect(manifest.files).toHaveLength(2)
  for (const file of manifest.files) { const bytes = await readFile(join(root, file.path)); expect(file.bytes).toBe(bytes.length); expect(file.sha256).toBe(sha256(bytes)) }
})

type Step = 'edit-bad' | 'edit-good' | 'verify' | 'read' | 'retrieve' | 'finish' | '503' | 'partial' | 'stale' | 'suite' | 'multiple' | 'auth' | 'truncated'
async function setup(steps: Step[]) {
  const root = await temp(), runtimeRoot = join(root, 'runtime'); await mkdir(runtimeRoot)
  await writeFile(join(runtimeRoot, 'counter.exe'), 'explicit test double, never executed')
  await writeFile(join(runtimeRoot, 'tokenizer.json'), '{}')
  const manifest = { revision: 'a'.repeat(40), compiler: 'mock-test', executable: 'counter.exe', tokenizer: 'tokenizer.json', files: {
    'counter.exe': sha256(await readFile(join(runtimeRoot, 'counter.exe'))), 'tokenizer.json': sha256('{}') } }
  const manifestBytes = JSON.stringify(manifest); await writeFile(join(runtimeRoot, 'manifest.json'), manifestBytes)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const { config: eda } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  eda.outputRoot = root; eda.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  eda.limits = { ...eda.limits, timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192 }
  const settings: RepairSettings = { eda, model: { model: 'deepseek-flash', temperature: 0, maxTokens: 2048, timeoutMs: 10000, maxResponseBytes: 65536 },
    limits: { compileMs: 5000, elaborateMs: 5000, simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 8000000, artifactPollMs: 20, maxEventBytes: 1048576 }, activeMs: 120000,
    loop: { maxSemanticRepairs: 3, maxTransportRetries: 2, transportBackoffMs: [1, 2], maxRepeatedDiagnostic: 3 },
    p09: { variant: 'B', limits: { window: 16384, output: 2048, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 },
      tokenizer: { python: 'unused', root, manifestSha256: 'a'.repeat(64), timeoutMs: 1000 }, skillsFile: null, skillsSha256: null, maxRequests: 15 },
    auto: { registry: 'full', campaignRoot: root, bucket: 'preflight', sampleId: 'test', runtimeRoot, runtimeManifestSha256: sha256(manifestBytes), maxToolSteps: 15 } }
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: spec.argv[0]!.endsWith('counter.exe')
    ? [process.execPath, '-e', 'console.log(JSON.stringify({tokens:100}))']
    : [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify({ repairDiagnostics: true }), ...spec.argv.slice(1)] }))
  const prompts: Record<string, unknown>[] = []
  const runtime: ModelRuntime = { async prepareCall(config) { return { config, context: { contextWindow: 16384 }, adapterDefaults: {},
    retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 },
    async *stream(request): AsyncGenerator<StreamChunk> {
      const first = request.messages[0]!.content[0]!; if (first.type !== 'text') throw new Error('test input')
      const prompt = JSON.parse(first.text) as { current: { revision_id: string }; task: { id: string } }; prompts.push(prompt)
      const step = steps[prompts.length - 1] ?? 'finish'
      if (step === '503' || step === 'partial' || step === 'auth') {
        if (step === 'partial') yield { type: 'tool-call-delta', index: 0, id: ToolCallId('partial'), name: 'edit_dut', argumentsDelta: '{' }
        yield { type: 'finish', reason: { kind: 'error', failure: { code: step === 'auth' ? 'AUTH' : 'SERVER', status: step === 'auth' ? 401 : 503, message: 'SECRET_SENTINEL' } } }; return
      }
      if (step === 'truncated') {
        yield { type: 'tool-call-delta', index: 0, id: ToolCallId('truncated'), name: 'edit_dut', argumentsDelta: '{"source":' }
        yield { type: 'finish', reason: { kind: 'max-tokens' } }; return
      }
      const name = step.startsWith('edit') || step === 'multiple' ? 'edit_dut' : ['verify', 'stale', 'suite'].includes(step) ? 'verify_rtl' : step === 'read' ? 'read_current_rtl' : step === 'retrieve' ? 'retrieve_skill' : 'finish'
      const args = name === 'edit_dut' ? { expected_revision_id: prompt.current.revision_id, source: fixtureFiles(step === 'edit-bad' ? 'functional' : 'counter')['rtl/solution.sv']! + '// proposed\n' }
        : name === 'verify_rtl' ? { revision_id: step === 'stale' ? 'wrong' : prompt.current.revision_id, test_suite_id: step === 'suite' ? 'unknown' : prompt.task.id } : {}
      yield { type: 'tool-call-delta', index: 0, id: ToolCallId('call-' + prompts.length), name, argumentsDelta: JSON.stringify(args) }
      if (step === 'multiple') yield { type: 'tool-call-delta', index: 1, id: ToolCallId('extra'), name: 'finish', argumentsDelta: '{}' }
      yield { type: 'usage', usage: { inputTokens: 100, outputTokens: 50 } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
    } } } }
  const workflow = new RepairWorkflow(settings, ctx.subprocess, runtime); workflows.push(workflow)
  return { root, workflow, settings, prompts, runtime, async run() { return workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal) } }
}
it('automatically repairs twice using fresh revisions and observations, without human approvals', async () => {
  const s = await setup(['503', 'edit-bad', 'verify', 'edit-good', 'verify']), state = await s.run()
  expect(state.outcome, JSON.stringify(state)).toBe('VERIFIED')
  expect(state.attempts).toBe(2); expect(state.auto?.verifications).toBe(2)
  expect(state.p09).toMatchObject({ transport_retries: 1, initial_generation_requests: 0, model_requests_total: 5 })
  expect(s.prompts[0]).toEqual(s.prompts[1])
  expect(s.prompts[2]).toMatchObject({ verification_state: 'UNVERIFIED', verification_key: null, observed: null })
  expect(s.prompts[3]).toMatchObject({ verification_state: 'VERIFIED_OBSERVATION' })
  expect(state.review_wait_ms).toBe(0)
  const audit = JSON.parse(await readFile(join(state.model_runs[3]!, 'context-audit.json'), 'utf8'))
  expect(audit.verification_key).not.toBeNull()
  expect(await readFile(join(state.model_runs[0]!, 'stream.json'), 'utf8')).not.toContain('SECRET_SENTINEL')
  const wire = JSON.parse(await readFile(join(state.model_runs[2]!, 'prompt-final.txt'), 'utf8'))
  expect(wire.tools).toHaveLength(5)
  expect(wire.messages.some((m: { role: string }) => m.role === 'tool')).toBe(true)
  expect(wire.messages.some((m: { tool_calls?: unknown[] }) => m.tool_calls?.length === 1)).toBe(true)
}, 60000)
it('rejects stale revision and unknown suite without verification and then accepts the correct request', async () => {
  const s = await setup(['edit-good', 'stale', 'suite', 'verify']), state = await s.run()
  expect(state.outcome, JSON.stringify(state)).toBe('VERIFIED'); expect(state.auto?.verifications).toBe(1)
  expect(state.attempts).toBe(1)
}, 60000)
it('never turns finish into PASS', async () => {
  const s = await setup(['finish']), state = await s.run()
  expect(state.outcome).toBe('FINISHED_UNVERIFIED'); expect(state.attempts).toBe(0)
}, 60000)
it('does not export an edited but unverified candidate on finish', async () => {
  const s = await setup(['edit-good', 'finish']), state = await s.run()
  expect(state.outcome).toBe('FINISHED_UNVERIFIED'); expect(state.attempts).toBe(1)
  expect(state.auto?.pending_verification).toBe(true); expect(state.verification_run).toBeNull()
  await expect(readFile(join(s.root, 'repair-' + state.experiment_id, 'output/solution.sv'))).rejects.toMatchObject({ code: 'ENOENT' })
}, 60000)
it('does not open skill content for a disabled B-group retrieval', async () => {
  const s = await setup(['retrieve', 'finish'])
  s.settings.p09!.skillsFile = join(s.root, 'must-not-be-read.json'); s.settings.p09!.skillsSha256 = 'a'.repeat(64)
  const state = await s.run()
  expect(state.outcome).toBe('FINISHED_UNVERIFIED')
  const action = JSON.parse(await readFile(join(s.root, 'repair-' + state.experiment_id, 'action-1.json'), 'utf8'))
  expect(action).toMatchObject({ accepted: true, observation: { enabled: false, skills: [] } })
}, 60000)
it('returns validated C-group guidance through a native retrieve_skill call', async () => {
  const s = await setup(['retrieve', 'finish'])
  s.settings.p09!.variant = 'C'
  await writeFile(join(s.root, 'evidence.json'), 'mock')
  const entry: SkillEntry = { id: 'test.functional', version: '1', status: 'validated', trigger_tags: ['functional_mismatch'],
    scope: 'Mock counter', rule: 'Check specification.', limitations: 'Not a diagnosis.', source_cases: ['mock'],
    validation_records: [{ path: 'evidence.json', sha256: sha256('mock') }], content_hash: '' }
  entry.content_hash = skillHash(entry)
  const bytes = JSON.stringify([entry]); await writeFile(join(s.root, 'skills.json'), bytes)
  s.settings.p09!.skillsFile = join(s.root, 'skills.json'); s.settings.p09!.skillsSha256 = sha256(bytes)
  const state = await s.run()
  expect(state.outcome).toBe('FINISHED_UNVERIFIED')
  const action = JSON.parse(await readFile(join(s.root, 'repair-' + state.experiment_id, 'action-1.json'), 'utf8'))
  expect(action).toMatchObject({ tool: 'retrieve_skill', accepted: true, observation: { enabled: true, skills: [{ id: entry.id }] } })
}, 60000)
it('blocks missing C-group skill evidence before EDA calibration and model dispatch', async () => {
  const s = await setup(['retrieve'])
  s.settings.p09!.variant = 'C'; s.settings.p09!.skillsFile = join(s.root, 'missing.json'); s.settings.p09!.skillsSha256 = 'a'.repeat(64)
  const state = await s.run()
  expect(state.outcome).toBe('SKILL_EVIDENCE_INVALID')
  expect(state.calibration_run).toBeNull(); expect(state.verification_runs).toEqual([])
  expect(state.model_runs).toEqual([]); expect(s.prompts).toEqual([])
})
it('does not execute or retry a partial tool response', async () => {
  const s = await setup(['partial', 'edit-good']), state = await s.run()
  expect(state.attempts).toBe(0); expect(state.p09?.model_requests_total).toBe(1); expect(state.outcome).not.toBe('VERIFIED')
}, 60000)
it('rejects a multi-action response as a whole', async () => {
  const s = await setup(['multiple', 'finish']), state = await s.run()
  expect(state.attempts).toBe(0); expect(state.p09?.format_recovery_requests).toBe(1)
  expect(s.prompts[1]).toMatchObject({ host_action_error: 'EXACTLY_ONE_ACTION_REQUIRED' })
}, 60000)
it('normalizes the pinned runtime root but refuses hardlinked executables', async () => {
  const s = await setup([]), auto = s.settings.auto!
  await expect(checkCounterRuntime({ ...auto, runtimeRoot: auto.runtimeRoot.replaceAll('\\', '/') })).resolves.toMatchObject({ compiler: 'mock-test' })
  await link(join(auto.runtimeRoot, 'counter.exe'), join(auto.runtimeRoot, 'counter-hardlink.exe'))
  await expect(checkCounterRuntime(auto)).rejects.toThrow()
  s.settings.activeMs = 1200001
  expect(() => new RepairWorkflow(s.settings, contexts.at(-1)!.subprocess, s.runtime)).toThrow('Invalid automatic experiment configuration')
})
it.each(['auth', 'truncated'] as const)('does not retry or execute %s responses', async step => {
  const s = await setup([step, 'edit-good']), state = await s.run()
  expect(state.attempts).toBe(0); expect(state.p09?.model_requests_total).toBe(1)
  expect(state.outcome).not.toBe('VERIFIED')
}, 60000)
it('stops a repeated candidate without consuming another repair', async () => {
  const s = await setup(['edit-bad', 'verify', 'edit-bad']), state = await s.run()
  expect(state.outcome).toBe('REPEATED_CANDIDATE'); expect(state.attempts).toBe(1)
}, 60000)
it('counts rejected edits but never skips verification of a candidate', async () => {
  const s = await setup(['edit-bad', 'edit-good', 'verify', 'finish']), state = await s.run()
  expect(state.attempts).toBe(1); expect(state.auto?.tool_steps).toBe(4)
  expect(s.prompts[2]).toMatchObject({ host_action_error: 'VERIFY_CURRENT_REVISION_FIRST', verification_state: 'UNVERIFIED' })
}, 60000)
it('enforces the tool budget independently of accepted repairs', async () => {
  const s = await setup(Array(16).fill('read')), state = await s.run()
  expect(state.outcome).toBe('TOOL_STEP_BUDGET_EXHAUSTED')
  expect(state.auto?.tool_steps).toBe(15); expect(state.attempts).toBe(0); expect(s.prompts).toHaveLength(15)
}, 60000)
it('never replays a durable interrupted operation', async () => {
  const s = await setup(['edit-good']), state = await s.workflow.start('functional')
  state.phase = 'BUSY'; state.operation = 'model-action'
  const path = join(s.root, 'repair-' + state.experiment_id)
  await writeFile(join(path, 'state.json'), JSON.stringify(state))
  await writeFile(join(path, 'event-00000.json'), JSON.stringify({ state }))
  const recovered = await s.workflow.resume(state.experiment_id, new AbortController().signal)
  expect(recovered.outcome).toBe('INTERRUPTED'); expect(s.prompts).toHaveLength(0)
})
it('blocks providers with an independent retry layer', async () => {
  const s = await setup(['edit-good']), prepare = s.runtime.prepareCall.bind(s.runtime)
  vi.spyOn(s.runtime, 'prepareCall').mockImplementation(async (...args) => {
    const call = await prepare(...args); return { ...call, retryPolicy: { ...call.retryPolicy, maxRetries: 1 } }
  })
  const state = await s.run()
  expect(state.outcome).toBe('LOWER_LEVEL_RETRY_ENABLED'); expect(s.prompts).toHaveLength(0)
}, 60000)
