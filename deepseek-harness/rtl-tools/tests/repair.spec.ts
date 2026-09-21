import { mkdtemp, readFile, rm, readdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context } from '@deepseek-ai/cordis'
import LocalSubprocess from '@deepseek-ai/dsh-subprocess-local'
import { afterEach, expect, it, vi } from 'vitest'
import { RepairWorkflow, type RepairSettings } from '../src/phase1/repair-workflow.ts'
import { readDoctorConfig } from '../src/phase1/doctor.ts'
import { fixtureFiles } from '../src/phase1/fixtures.ts'
import type { ModelRuntime } from '../src/phase1/model.ts'
import { diagnosticKind, readDiagnostics, normalizeStage } from '../src/phase1/repair-diagnostics.ts'
import { SimulationEvidence } from '../src/phase1/simulation-evidence.ts'
import type { StageRecord } from '../src/phase1/records.ts'
import { decideRepair } from '../src/phase1/repair-policy.ts'
import { extractSource } from '../src/phase1/candidates.ts'
import { taskSpec } from '../src/phase1/p09-tasks.ts'

const roots: string[] = [], contexts: Context[] = [], workflows: RepairWorkflow[] = []
afterEach(async () => {
  for (const workflow of workflows.splice(0)) await workflow.close()
  for (const ctx of contexts.splice(0)) await ctx.fiber.dispose()
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
  vi.restoreAllMocks()
})
const good = fixtureFiles('counter')['rtl/solution.sv']!
async function setup(responses: (string | { error: string; status?: number; partial?: string })[] = [good], options = {}) {
  const root = await mkdtemp(join(tmpdir(), 'repair-')); roots.push(root)
  const ctx = new Context(); contexts.push(ctx); await ctx.plugin(LocalSubprocess)
  const { config: eda } = await readDoctorConfig(fileURLToPath(new URL('../phase1/configs/dev.yaml', import.meta.url)))
  eda.outputRoot = root; eda.tools = { vivado: process.execPath, xvlog: process.execPath, xelab: process.execPath, xsim: process.execPath }
  eda.limits = { ...eda.limits, timeoutMs: 5000, graceMs: 100, maxLogBytes: 8192 }
  const settings: RepairSettings = { eda, model: { model: 'mock', temperature: 0, maxTokens: 2048, timeoutMs: 5000, maxResponseBytes: 65536 },
    limits: { compileMs: 5000, elaborateMs: 5000, simulationMs: 5000, totalMs: 30000, maxArtifactBytes: 1000000, artifactPollMs: 20, maxEventBytes: 1048576 }, activeMs: 120000 }
  const spawn = ctx.subprocess.spawn.bind(ctx.subprocess)
  vi.spyOn(ctx.subprocess, 'spawn').mockImplementation(spec => spawn({ ...spec, argv: [process.execPath, fileURLToPath(new URL('./fake-verification.mjs', import.meta.url)), JSON.stringify(options), ...spec.argv.slice(1)] }))
  const prompts: string[] = []
  const runtime: ModelRuntime = { async prepareCall(config) { return { config, context: { contextWindow: 16384 }, retryPolicy: { mode: 'normal', maxRetries: 0, retryableCodes: [], initialDelayMs: 0, maxDelayMs: 0, jitterRatio: 0 }, adapterDefaults: {}, async *stream(request) {
    prompts.push(JSON.stringify(request.messages))
    const step = responses[prompts.length - 1] ?? ''
    if (typeof step !== 'string') {
      if (step.partial) {
        yield { type: 'block-start', index: 0, blockType: 'text' } as const
        yield { type: 'text-delta', index: 0, text: step.partial } as const
      }
      yield { type: 'finish', reason: { kind: 'error', failure: { code: step.error, message: 'SECRET_SENTINEL', ...(step.status ? { status: step.status } : {}) } } } as const
      return
    }
    const text = step
    yield { type: 'block-start', index: 0, blockType: 'text' } as const
    yield { type: 'text-delta', index: 0, text } as const
    yield { type: 'block-end', index: 0, block: { type: 'text', text } } as const
    yield { type: 'finish', reason: { kind: 'stop' } } as const
  } } } }
  const workflow = new RepairWorkflow(settings, ctx.subprocess, runtime); workflows.push(workflow)
  return { root, workflow, prompts, settings, runtime }
}
function withP09(s: Awaited<ReturnType<typeof setup>>, variant: 'A' | 'B' | 'C' = 'A') {
  s.settings.loop = { maxSemanticRepairs: 3, maxTransportRetries: 2, transportBackoffMs: [1, 2], maxRepeatedDiagnostic: 3 }
  s.settings.p09 = { variant, limits: { window: 16384, output: 2048, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 },
    tokenizer: { python: 'mock', root: s.root, manifestSha256: 'a'.repeat(64), timeoutMs: 5000 }, skillsFile: null, skillsSha256: null, maxRequests: 15 }
  const workflow = new RepairWorkflow(s.settings, contexts.at(-1)!.subprocess, s.runtime, async () => ({
    quality: 'estimated', identity: { implementation: 'explicit-mock-byte-counter' },
    async count(view) { return Buffer.byteLength(JSON.stringify(view)) + 10 },
  }))
  workflows.push(workflow); return workflow
}
it('P09 binds two real Mock verification rounds, audits sent text and exports only the approved version', async () => {
  const wrong = fixtureFiles('functional')['rtl/solution.sv']! + '// independent proposal\n'
  const s = await setup([wrong, good], { repairDiagnostics: true }), workflow = withP09(s, 'B')
  let state = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  for (let i = 0; i < 2; i++) {
    expect(state.phase, JSON.stringify(state)).toBe('AWAITING_REVIEW')
    expect(state.schema_version).toBe('1.6')
    const calls = s.prompts.length
    await workflow.resume(state.experiment_id, new AbortController().signal); expect(s.prompts).toHaveLength(calls)
    await workflow.review(state.experiment_id, state.current!.source_sha256, true)
    state = await workflow.resume(state.experiment_id, new AbortController().signal)
  }
  expect(state.outcome, JSON.stringify(state)).toBe('VERIFIED')
  expect(state.p09).toMatchObject({ model_requests_total: 2, initial_generation_requests: 0 })
  const audit = JSON.parse(await readFile(join(state.model_runs[1]!, 'context.audit.json'), 'utf8'))
  const wire = JSON.parse(await readFile(join(state.model_runs[1]!, 'context.messages.json'), 'utf8'))
  expect(audit.count_quality).toBe('estimated')
  expect(JSON.parse(wire.messages[1].content).history).toHaveLength(1)
  expect(JSON.parse(wire.messages[1].content).current.source).toBe(wrong)
  expect(s.prompts.join('')).not.toContain('PHASE1_COMPLETE checks=%0d')
  const events = await readFile(join(state.model_runs[1]!, 'events.jsonl'), 'utf8')
  expect(events).toContain('"type":"model_context"')
  expect(events).toContain('"type":"run_finished"')
})
it('P09 naturally generates a first candidate only after independent positive/negative calibration', async () => {
  const task = taskSpec('enable_counter')
  const s = await setup([task.good], { p09: true }), workflow = withP09(s)
  const waiting = await workflow.resume((await workflow.start('enable_counter')).experiment_id, new AbortController().signal)
  expect(waiting.phase, JSON.stringify(waiting)).toBe('AWAITING_REVIEW')
  expect(waiting.attempts).toBe(0)
  expect(waiting.p09).toMatchObject({ initial_generation_requests: 1, model_requests_total: 1 })
  expect(waiting.p09!.negative_calibration_run).not.toBeNull()
  const input = JSON.parse(await readFile(join(waiting.model_runs[0]!, 'context.input.json'), 'utf8'))
  expect(input.current).toBeNull(); expect(input.feedback).toBeNull()
  await workflow.review(waiting.experiment_id, waiting.current!.source_sha256, true)
  const result = await workflow.resume(waiting.experiment_id, new AbortController().signal)
  expect(result.outcome, JSON.stringify(result)).toBe('VERIFIED')
  expect(s.prompts).toHaveLength(1)
})
it('P09 limits format and transport recovery while retaining separate counters', async () => {
  const s = await setup([{ error: 'TRANSPORT' }, '[BEGIN]\n' + good, good], { repairDiagnostics: true }), workflow = withP09(s)
  const waiting = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(waiting.phase, JSON.stringify(waiting)).toBe('AWAITING_REVIEW')
  expect(waiting.attempts).toBe(1)
  expect(waiting.p09).toMatchObject({ model_requests_total: 3, transport_retries: 1, format_recovery_requests: 1 })
  expect(JSON.parse(s.prompts[0]!)[0].content).toEqual(JSON.parse(s.prompts[1]!)[0].content)
})
it('P09 never stops changed sources solely because they repeat a primary diagnostic', async () => {
  const bad = fixtureFiles('functional')['rtl/solution.sv']!
  const s = await setup([bad + '// one\n', bad + '// two\n', good], { repairDiagnostics: true }), workflow = withP09(s)
  let state = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  for (let i = 0; i < 3; i++) {
    expect(state.phase, JSON.stringify(state)).toBe('AWAITING_REVIEW')
    await workflow.review(state.experiment_id, state.current!.source_sha256, true)
    state = await workflow.resume(state.experiment_id, new AbortController().signal)
  }
  expect(state.outcome, JSON.stringify(state)).toBe('VERIFIED')
  expect(state.attempts).toBe(3)
})
it('P09 total-attempt limit stops recovery without a hidden request', async () => {
  const s = await setup([{ error: 'TRANSPORT' }, good]), workflow = withP09(s)
  s.settings.p09!.maxRequests = 1
  const state = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('MODEL_REQUEST_BUDGET_EXHAUSTED')
  expect(s.prompts).toHaveLength(1)
  expect(state.p09!.transport_retries).toBe(0)
})
it.each([false, true])('P09 context recovery is one-shot and drops only optional history; overflow again=%s', async twice => {
  const wrong = fixtureFiles('functional')['rtl/solution.sv']! + '// new proposal\n'
  const s = await setup([wrong, { error: 'CONTEXT_WINDOW_EXCEEDED' }, twice ? { error: 'CONTEXT_WINDOW_EXCEEDED' } : good], { repairDiagnostics: true })
  const workflow = withP09(s, 'B')
  let state = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  await workflow.review(state.experiment_id, state.current!.source_sha256, true)
  state = await workflow.resume(state.experiment_id, new AbortController().signal)
  expect(twice ? state.outcome : state.phase).toBe(twice ? 'CONTEXT_WINDOW_EXCEEDED' : 'AWAITING_REVIEW')
  expect(state.p09).toMatchObject({ context_recovery_requests: 1, model_requests_total: 3, transport_retries: 0 })
  const before = JSON.parse(await readFile(join(state.model_runs[1]!, 'context.audit.json'), 'utf8'))
  const after = JSON.parse(await readFile(join(state.model_runs[2]!, 'context.audit.json'), 'utf8'))
  expect(before.core_sha256).toBe(after.core_sha256)
  expect(before.prompt_sha256).not.toBe(after.prompt_sha256)
  expect(after.core_only).toBe(true)
  expect(s.prompts).toHaveLength(3)
})
it('P09 format recovery cannot reset the transport retry budget', async () => {
  const s = await setup([{ error: 'TRANSPORT' }, { error: 'TRANSPORT' }, '[BEGIN]\n' + good, { error: 'TRANSPORT' }, good])
  const workflow = withP09(s)
  const state = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('MODEL_RESPONSE_ERROR')
  expect(state.p09).toMatchObject({ transport_retries: 2, format_recovery_requests: 1, model_requests_total: 4 })
  expect(s.prompts).toHaveLength(4)
})
it.each([{ error: 'AUTH' }, { error: 'TRANSPORT', partial: good }, { error: 'CONTEXT_WINDOW_EXCEEDED' }])('P09 does not recover non-retryable or already-core responses: %j', async response => {
  const s = await setup([response, good]), workflow = withP09(s)
  const state = await workflow.resume((await workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.phase).toBe('TERMINAL')
  expect(state.p09).toMatchObject({ transport_retries: 0, context_recovery_requests: 0, format_recovery_requests: 0 })
  expect(s.prompts).toHaveLength(1)
})
it('P09 missing official tokenizer blocks dispatch and retains a terminal model record', async () => {
  const s = await setup(); withP09(s)
  const state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('TOKENIZER_UNAVAILABLE')
  expect(s.prompts).toHaveLength(0)
  const model = JSON.parse(await readFile(join(state.model_runs[0]!, 'model.json'), 'utf8'))
  expect(model.dispatched).toBe(false)
  expect(await readFile(join(state.model_runs[0]!, 'context.input.json'), 'utf8')).toContain('functional')
})
it('P09 detects negative calibration tampering rather than exporting a current PASS', async () => {
  const s = await setup([taskSpec('enable_counter').good], { p09: true }), workflow = withP09(s)
  const state = await workflow.resume((await workflow.start('enable_counter')).experiment_id, new AbortController().signal)
  await workflow.review(state.experiment_id, state.current!.source_sha256, true)
  const path = join(state.p09!.negative_calibration_run!, 'build', 'simulation.stdout.log')
  await writeFile(path, 'Mismatches: 0 in 128 samples\n')
  expect((await workflow.resume(state.experiment_id, new AbortController().signal)).outcome).toBe('HOST_OR_BINDING_BLOCKED')
  expect(s.prompts).toHaveLength(1)
})
it('classifies observed declaration and consequential errors without language-mode guesses', () => {
  expect(diagnosticKind('VRFC 10-3380', 'used before declaration')).toBe('declaration_order')
  expect(diagnosticKind('VRFC 10-8530', 'ignored')).toBe('consequential')
  expect(diagnosticKind(null, 'ERROR in TB assertion')).toBe('unknown')
})
it('keeps legacy records without process evidence inconclusive rather than crashing', () => {
  const stage = normalizeStage({ stage: 'simulation', status: 'FAIL' } as StageRecord, [], new SimulationEvidence(), false)
  expect(stage.complete).toBe(false)
  expect(stage.process_clean).toBe(false)
  expect(stage.functional_failure).toBe(false)
})
it('does not infer testbench compatibility from ownership of an arbitrary compile error', () => {
  const record = { stage: 'compile', status: 'FAIL', processes: [] } as unknown as StageRecord
  const result = normalizeStage(record, [{ category: 'error', kind: 'unknown', message_id: null, file: 'trusted/tb.sv', line: 1, message: 'unclassified error', origin: 'testbench', attribution: 'TESTBENCH_COMPATIBILITY', severity: 'ERROR', invocation: 'compile', repairable_by_model: false }], new SimulationEvidence(), true)
  expect(result.diagnostics[0]?.origin).toBe('testbench')
  expect(result.diagnostics[0]?.attribution).toBe('UNKNOWN')
})
it.each(['matched', 'foreign-file', 'foreign-invocation', 'unknown'])('bounds the real syntax consequential group: %s', variant => {
  const primary = { category: 'syntax_error', kind: 'syntax', message_id: 'VRFC 10-4982', file: 'rtl/solution.sv', line: 1, message: "syntax error near ';'", origin: 'dut' as const, attribution: 'DUT_COMPILE_ERROR' as const, severity: 'ERROR' as const, invocation: 'compile', repairable_by_model: true }
  const consequence = { ...primary, kind: 'consequential', message_id: variant === 'unknown' ? 'Unknown 1-1' : 'VRFC 10-8530', message: "module 'counter' is ignored due to previous errors", file: variant === 'foreign-file' ? 'other.sv' : primary.file, invocation: variant === 'foreign-invocation' ? 'other' : primary.invocation }
  const stage = normalizeStage({ stage: 'compile', status: 'FAIL', processes: [{ exit_code: 1, signal: null, timed_out: false, cancelled: false, log_truncated: false, duration_ms: 1 }] } as StageRecord, [primary, consequence], new SimulationEvidence(), true)
  const facts = { evidence_kind: 'live_verification', stages: [stage, ...['elaborate', 'simulation', 'synthesis'].map(name => ({ ...stage, stage: name, status: 'SKIPPED', diagnostics: [] }))] } as Parameters<typeof decideRepair>[0]
  expect(decideRepair(facts, { calibrated: true, bound: true, attempts: 0, top: 'counter' }).action).toBe(variant === 'matched' ? 'propose_repair' : 'blocked')
})
it('allows an unlisted but completely DUT-owned diagnostic and keeps unknown ownership blocked', () => {
  const owned = { category: 'error', kind: 'unknown', message_id: 'VRFC 10-9999', file: 'rtl/solution.sv', line: 2, message: 'unlisted DUT failure',
    origin: 'dut' as const, attribution: 'DUT_COMPILE_ERROR' as const, severity: 'ERROR' as const, invocation: 'compile', repairable_by_model: true }
  const failed = normalizeStage({ stage: 'compile', status: 'FAIL', processes: [{ exit_code: 1, signal: null, timed_out: false, cancelled: false, log_truncated: false, duration_ms: 1 }] } as StageRecord,
    [owned], new SimulationEvidence(), true)
  const trailing = ['elaborate', 'simulation', 'synthesis'].map(stage => ({ ...failed, stage, status: 'SKIPPED', diagnostics: [] }))
  const facts = { evidence_kind: 'live_verification', stages: [failed, ...trailing] } as Parameters<typeof decideRepair>[0]
  expect(decideRepair(facts, { calibrated: true, bound: true, attempts: 0, top: 'counter' })).toMatchObject({ action: 'propose_repair', rule: 'DUT_UNKNOWN_BUT_OWNED' })
  const unknown = { ...failed, diagnostics: [{ ...owned, origin: 'unknown' as const, attribution: 'UNKNOWN' as const, repairable_by_model: false }] }
  expect(decideRepair({ ...facts, stages: [unknown, ...trailing] }, { calibrated: true, bound: true, attempts: 0, top: 'counter' }).action).toBe('blocked')
})
it('keeps TopModule extraction compatible and permits a separately trusted counter interface', () => {
  expect(() => extractSource(good)).toThrow('TopModule')
  expect(extractSource(good, false, 65536, { top: 'counter', reset: 'rst', output: 'count' }).source).toBe(good)
})
it('requests a real proposal-shaped Mock response, pauses for review, then verifies a new snapshot and exports', async () => {
  const s = await setup([good.replace('count + 1', "count + 4'd1")])
  const initial = await s.workflow.start('functional')
  const waiting = await s.workflow.resume(initial.experiment_id, new AbortController().signal)
  expect(waiting.phase, JSON.stringify(waiting)).toBe('AWAITING_REVIEW')
  expect(waiting.attempts).toBe(1)
  expect(s.prompts).toHaveLength(1)
  expect(s.prompts[0]).toContain('mismatches')
  expect(s.prompts[0]).not.toContain('PHASE1_COMPLETE checks=%0d')
  expect(s.prompts[0]).not.toContain('failure-analysis')
  expect((await s.workflow.resume(initial.experiment_id, new AbortController().signal)).phase).toBe('AWAITING_REVIEW')
  await expect(s.workflow.review(initial.experiment_id, '0'.repeat(64), true)).rejects.toThrow('Review')
  await s.workflow.review(initial.experiment_id, waiting.current!.source_sha256, true)
  const result = await s.workflow.resume(initial.experiment_id, new AbortController().signal)
  expect(result.outcome, JSON.stringify(result)).toBe('VERIFIED')
  expect(result.verification_runs).toHaveLength(2)
  expect(s.prompts).toHaveLength(1)
  const exported = await readFile(join(s.root, 'repair-' + result.experiment_id, 'output', 'solution.sv'), 'utf8')
  expect(exported).not.toBe(good)
  const report = JSON.parse(await readFile(join(s.root, 'repair-' + result.experiment_id, 'repair-report.json'), 'utf8'))
  expect(report).toMatchObject({ design_repaired: true, proposal_attempts: 1, recorded_model_calls: 1, automatic_unattended_repair_verified: false, tokens: { input: null, output: null }, price: null })
  expect(report.time_ms.calibration_eda).toBeGreaterThan(0)
  expect(await readFile(join(s.root, 'repair-' + result.experiment_id, 'repair-report.md'), 'utf8')).toContain('"mismatch_count": 19')
  expect((await s.workflow.resume(result.experiment_id, new AbortController().signal)).outcome).toBe('VERIFIED')
})
it('replays actual captured evidence without overwriting it or granting repair eligibility', async () => {
  const s = await setup()
  const waiting = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  const path = join(waiting.verification_run!, 'result.json'), before = await readFile(path)
  const { receipt } = await readDiagnostics(waiting.verification_run!, 'diagnostic_replay')
  expect(receipt.stages[2]!.verdict).toMatchObject({ checks: 20, mismatches: 19, completed: true })
  expect(receipt.stages[2]!.functional_failure).toBe(true)
  expect(decideRepair(receipt, { calibrated: true, bound: true, attempts: 0, top: 'counter' }).action).toBe('blocked')
  expect(await readFile(path)).toEqual(before)
  expect(receipt).toMatchObject({ evidence_kind: 'diagnostic_replay', eda_rerun: false, model_repair_executed: false })
  const live = structuredClone(receipt); live.evidence_kind = 'live_verification'
  expect(decideRepair(live, { calibrated: true, bound: true, attempts: 0, top: 'counter' }).rule).toBe('FUNCTIONAL_MISMATCH')
  live.stages[2]!.complete = false
  expect(decideRepair(live, { calibrated: true, bound: true, attempts: 0, top: 'counter' }).action).toBe('blocked')
})
it('human rejection terminates without another model request or candidate execution', async () => {
  const s = await setup()
  const waiting = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  const result = await s.workflow.review(waiting.experiment_id, waiting.current!.source_sha256, false)
  expect(result.outcome).toBe('APPROVAL_REJECTED')
  expect((await s.workflow.resume(result.experiment_id, new AbortController().signal)).verification_runs).toHaveLength(1)
  expect(s.prompts).toHaveLength(1)
})
it('changed reviewed bytes block execution and do not produce another request', async () => {
  const s = await setup()
  const waiting = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  await s.workflow.review(waiting.experiment_id, waiting.current!.source_sha256, true)
  await writeFile(join(s.root, 'repair-' + waiting.experiment_id, 'revisions', waiting.current!.revision_id, 'rtl', 'solution.sv'), good + '// changed')
  expect((await s.workflow.resume(waiting.experiment_id, new AbortController().signal)).outcome).toBe('HOST_OR_BINDING_BLOCKED')
  expect(s.prompts).toHaveLength(1)
})
it('retains invalid model output and terminates without executing it', async () => {
  const s = await setup(['not HDL'])
  const result = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(result.outcome).toBe('INVALID_OUTPUT')
  expect(result.verification_runs).toHaveLength(1)
  expect(await readFile(join(result.model_runs[0]!, 'response.txt'), 'utf8')).toBe('not HDL')
  expect((await readdir(join(s.root, 'repair-' + result.experiment_id, 'revisions'))).length).toBe(1)
})

it.each(['syntax', 'synthesis-only'] as const)('offers a bounded repair for %s and restarts at compile after approval', async fixture => {
  const s = await setup([good], { repairDiagnostics: true })
  const waiting = await s.workflow.resume((await s.workflow.start(fixture)).experiment_id, new AbortController().signal)
  expect(waiting.phase, JSON.stringify(waiting)).toBe('AWAITING_REVIEW')
  await s.workflow.review(waiting.experiment_id, waiting.current!.source_sha256, true)
  const result = await s.workflow.resume(waiting.experiment_id, new AbortController().signal)
  expect(result.outcome).toBe('VERIFIED')
  const verified = await readDiagnostics(result.verification_run!, 'live_verification')
  expect(verified.receipt.stages.map(s => s.status)).toEqual(['PASS', 'PASS', 'PASS', 'PASS'])
})

it.each([true, false])('uses at most two requests; second candidate repaired=%s', async success => {
  const wrong = good.replace('count + 1', 'count + 2')
  const s = await setup([wrong + '// proposal 1\n', success ? good : wrong + '// proposal 2\n'], { repairDiagnostics: true })
  let state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  for (let round = 0; round < 2; round++) {
    expect(state.phase, JSON.stringify(state)).toBe('AWAITING_REVIEW')
    await s.workflow.review(state.experiment_id, state.current!.source_sha256, true)
    state = await s.workflow.resume(state.experiment_id, new AbortController().signal)
  }
  expect(state.outcome).toBe(success ? 'VERIFIED' : 'REPAIR_BUDGET')
  expect(state.attempts).toBe(2); expect(s.prompts).toHaveLength(2); expect(state.verification_runs).toHaveLength(3)
})

it('does not ignore additional unknown synthesis errors', async () => {
  const s = await setup([good], { repairDiagnostics: true })
  const state = await s.workflow.resume((await s.workflow.start('synthesis-only')).experiment_id, new AbortController().signal)
  const { receipt } = await readDiagnostics(state.verification_run!, 'live_verification')
  const stage = receipt.stages[3]!
  stage.diagnostics.push({ ...stage.diagnostics[0]!, message_id: 'Unknown 1-1', message: 'unknown failure', origin: 'unknown', kind: 'unknown' })
  expect(decideRepair(receipt, { calibrated: true, bound: true, attempts: 0, top: 'counter' }).action).toBe('blocked')
})

it.each(['exit', 'error', 'truncated', 'duplicate', 'fatal'])('preserves mismatch counts but blocks repair on %s evidence', kind => {
  const evidence = new SimulationEvidence(); evidence.accept('PHASE1_COMPLETE checks=20 mismatches=18')
  if (kind === 'duplicate') evidence.accept('PHASE1_COMPLETE checks=20 mismatches=18')
  if (kind === 'fatal') evidence.accept('Fatal: assertion')
  const record = { stage: 'simulation', status: 'FAIL', processes: [{ exit_code: kind === 'exit' ? 1 : 0, signal: null, timed_out: false, cancelled: false, log_truncated: false, duration_ms: 1 }] } as StageRecord
  const diagnostics = kind === 'error' ? [{ category: 'error', kind: 'unknown', message_id: null, file: null, line: null, message: 'assertion', origin: 'testbench' as const, attribution: 'UNKNOWN' as const, severity: 'ERROR' as const, invocation: 'simulation', repairable_by_model: false }] : []
  const result = normalizeStage(record, diagnostics, evidence, kind !== 'truncated')
  expect(result.verdict.mismatches).toBe(18); expect(result.functional_failure).toBe(false)
  if (kind === 'exit') expect({ verdict: result.verdict, functional_failure: result.functional_failure, diagnostics: result.diagnostics }).toMatchSnapshot()
})

it('marks persisted in-flight state interrupted without another request', async () => {
  const s = await setup()
  const state = await s.workflow.start('functional')
  state.phase = 'BUSY'; state.operation = 'model'; state.attempts = 1
  const root = join(s.root, 'repair-' + state.experiment_id)
  await writeFile(join(root, 'state.json'), JSON.stringify(state))
  await writeFile(join(root, 'event-00000.json'), JSON.stringify({ state }))
  expect((await s.workflow.resume(state.experiment_id, new AbortController().signal)).outcome).toBe('INTERRUPTED')
  expect(s.prompts).toHaveLength(0)
})

it('stops identical proposals without another verification', async () => {
  const s = await setup([fixtureFiles('functional')['rtl/solution.sv']!])
  const result = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(result.outcome).toBe('UNCHANGED_CANDIDATE'); expect(result.verification_runs).toHaveLength(1)
})

it('keeps API authentication errors terminal without retries or secret text', async () => {
  const s = await setup()
  vi.spyOn(s.runtime, 'prepareCall').mockRejectedValue(Object.assign(new Error('SECRET_SENTINEL'), { code: 'AUTH' }))
  const result = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(result.outcome).toBe('MODEL_AUTHENTICATION'); expect(result.attempts).toBe(1)
  expect(await readFile(join(result.model_runs[0]!, 'events.jsonl'), 'utf8')).not.toContain('SECRET_SENTINEL')
  expect((await s.workflow.resume(result.experiment_id, new AbortController().signal)).attempts).toBe(1)
})

it('cannot use another experiment approval to launch a candidate', async () => {
  const s = await setup()
  const state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  const root = join(s.root, 'repair-' + state.experiment_id)
  await s.workflow.review(state.experiment_id, state.current!.source_sha256, true)
  const approval = join(root, 'revisions', state.current!.revision_id, 'approval.json')
  const record = JSON.parse(await readFile(approval, 'utf8')); record.experiment_id = 'different-experiment'
  await writeFile(approval, JSON.stringify(record))
  expect((await s.workflow.resume(state.experiment_id, new AbortController().signal)).outcome).toBe('HOST_OR_BINDING_BLOCKED')
  expect(s.prompts).toHaveLength(1)
})

it('enforces the active operation budget before requesting a model proposal', async () => {
  const s = await setup(); s.settings.activeMs = 1
  const state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.phase).toBe('TERMINAL'); expect(s.prompts).toHaveLength(0)
  expect(state.outcome).toBe('ACTIVE_BUDGET')
})

function finiteLoop(settings: RepairSettings) {
  settings.loop = { maxSemanticRepairs: 3, maxTransportRetries: 2, transportBackoffMs: [1, 2], maxRepeatedDiagnostic: 3 }
}
it('keeps two transport retries in one semantic round with identical prompts and resolved request hashes', async () => {
  const s = await setup([{ error: 'TRANSPORT' }, { error: 'SERVER', status: 503 }, good], { repairDiagnostics: true }); finiteLoop(s.settings)
  const waiting = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(waiting.phase).toBe('AWAITING_REVIEW'); expect(waiting.attempts).toBe(1)
  const round = waiting.loop!.rounds[0]!
  expect(round.transport.map(t => t.transport_attempt)).toEqual([1, 2, 3])
  expect(new Set(round.transport.map(t => t.request_sha256)).size).toBe(1)
  const requestContent = s.prompts.map(prompt => JSON.stringify(JSON.parse(prompt).map((message: { role: string; content: unknown }) => ({ role: message.role, content: message.content }))))
  expect(new Set(requestContent).size).toBe(1)
  expect(round.transport.map(t => t.error_layer)).toEqual(['MODEL_TRANSPORT_ERROR', 'MODEL_TRANSPORT_ERROR', null])
  expect(round.transport[1]!.observation?.http_status).toBe(503)
  expect(JSON.stringify(waiting)).not.toContain('SECRET_SENTINEL')
  await s.workflow.review(waiting.experiment_id, waiting.current!.source_sha256, true)
  const result = await s.workflow.resume(waiting.experiment_id, new AbortController().signal)
  expect(result.outcome).toBe('VERIFIED'); expect(s.prompts).toHaveLength(3)
})
it.each([{ error: 'TRANSPORT' }, { error: 'TIMEOUT' }, { error: 'SERVER', status: 503 }])('stops after three transport attempts without calling it a semantic design failure: %j', async error => {
  const s = await setup([error, error, error, good]); finiteLoop(s.settings)
  const state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('MODEL_TRANSPORT_EXHAUSTED'); expect(state.attempts).toBe(1); expect(s.prompts).toHaveLength(3)
  expect(state.loop!.rounds[0]!.outcome).toBe('MODEL_TRANSPORT_ERROR')
  expect((await s.workflow.resume(state.experiment_id, new AbortController().signal)).outcome).toBe(state.outcome)
})
it.each([{ error: 'AUTH' }, { error: 'SERVER', status: 501 }, { error: 'TRANSPORT', partial: 'module counter(' }, { error: 'TIMEOUT', partial: good }])('does not retry authentication, non-temporary service errors or partial answers: %j', async error => {
  const s = await setup([error, good]); finiteLoop(s.settings)
  const state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('MODEL_RESPONSE_ERROR'); expect(state.attempts).toBe(1); expect(s.prompts).toHaveLength(1)
})
it('uses fresh feedback and the previous candidate in a two-round controlled loop', async () => {
  const wrong = good.replace('count + 1', 'count + 2')
  const s = await setup([wrong, good], { repairDiagnostics: true }); finiteLoop(s.settings)
  let state = await s.workflow.resume((await s.workflow.start('controlled_multi_round')).experiment_id, new AbortController().signal)
  const firstCandidate = state.current!
  expect(state.loop!.purpose).toBe('state_machine_acceptance')
  await s.workflow.review(state.experiment_id, firstCandidate.source_sha256, true)
  state = await s.workflow.resume(state.experiment_id, new AbortController().signal)
  expect(state.phase).toBe('AWAITING_REVIEW'); expect(state.attempts).toBe(2)
  expect(state.loop!.rounds[1]!.prompt_current_source_sha256).toBe(firstCandidate.source_sha256)
  expect(state.loop!.rounds[0]!.feedback_sha256).not.toBe(state.loop!.rounds[1]!.feedback_sha256)
  expect(s.prompts[1]).toContain('count + 2')
  expect(s.prompts[0]).toContain('syntax'); expect(s.prompts[1]).toContain('functional_mismatch')
  expect(s.prompts.join('')).not.toContain('PHASE1_COMPLETE checks=%0d')
  await s.workflow.review(state.experiment_id, state.current!.source_sha256, true)
  state = await s.workflow.resume(state.experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('VERIFIED'); expect(state.verification_runs).toHaveLength(3)
  expect(state.loop!.rounds.map(r => r.outcome)).toEqual(['MODEL_SEMANTIC_REPAIR_FAILURE', 'VERIFIED'])
  expect(state.loop!.rounds.map(r => r.transport.length)).toEqual([1, 1])
  expect((await readDiagnostics(state.verification_run!, 'live_verification')).record.final_source_sha256).toBe(state.current!.source_sha256)
})
it('stops semantic budget exhaustion, not transport retries, after three valid failed candidates', async () => {
  const wrong = good.replace('count + 1', 'count + 2')
  const s = await setup([wrong + '// 1', wrong + '// 2', wrong + '// 3'], { repairDiagnostics: true }); finiteLoop(s.settings)
  s.settings.loop!.maxRepeatedDiagnostic = 4
  let state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  for (let i = 0; i < 3; i++) {
    expect(state.phase).toBe('AWAITING_REVIEW')
    await s.workflow.review(state.experiment_id, state.current!.source_sha256, true)
    state = await s.workflow.resume(state.experiment_id, new AbortController().signal)
  }
  expect(state.outcome).toBe('REPAIR_BUDGET_EXHAUSTED'); expect(state.attempts).toBe(3); expect(s.prompts).toHaveLength(3)
  expect(state.loop!.rounds.flatMap(r => r.transport)).toHaveLength(3)
})
it('stops a candidate that repeats any earlier revision rather than only the parent', async () => {
  const first = good.replace('count + 1', 'count + 2') + '// first', second = good.replace('count + 1', 'count + 2') + '// second'
  const s = await setup([first, second, first], { repairDiagnostics: true }); finiteLoop(s.settings); s.settings.loop!.maxRepeatedDiagnostic = 4
  let state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  for (let i = 0; i < 2; i++) { await s.workflow.review(state.experiment_id, state.current!.source_sha256, true); state = await s.workflow.resume(state.experiment_id, new AbortController().signal) }
  expect(state.outcome).toBe('REPEATED_CANDIDATE'); expect(state.attempts).toBe(3); expect(state.verification_runs).toHaveLength(3)
})
it('stops repeated primary evidence before dispatching another proposal', async () => {
  const wrong = good.replace('count + 1', 'count + 2') + '// different'
  const s = await setup([wrong, good], { repairDiagnostics: true }); finiteLoop(s.settings); s.settings.loop!.maxRepeatedDiagnostic = 2
  let state = await s.workflow.resume((await s.workflow.start('functional')).experiment_id, new AbortController().signal)
  await s.workflow.review(state.experiment_id, state.current!.source_sha256, true)
  state = await s.workflow.resume(state.experiment_id, new AbortController().signal)
  expect(state.outcome).toBe('REPEATED_PRIMARY_DIAGNOSTIC'); expect(s.prompts).toHaveLength(1)
})
