import { readFile } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { it, expect } from 'vitest'
import { VivadoDiagnostics } from '../src/vivado-parser.ts'
import { attributeDiagnostics } from '../src/phase1/attribution.ts'
import { diagnosticKind, normalizeStage, type DiagnosticReceipt } from '../src/phase1/repair-diagnostics.ts'
import { SimulationEvidence } from '../src/phase1/simulation-evidence.ts'
import type { RunRecord, StageRecord } from '../src/phase1/records.ts'
import { decideRepair, multipleDriverFailure } from '../src/phase1/repair-policy.ts'
import { revisionScore } from '../src/phase1/p10-revision.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { stageFeatures } from '../src/knowledge/diagnostic-features.ts'
import { retrieveKnowledge } from '../src/knowledge/knowledge-retrieval.ts'
import { bundle } from './knowledge-helpers.ts'
import { buildContext, type ContextInput } from '../src/phase1/p09-context.ts'

const fixture = (name: string) => readFile(new URL('./fixtures/vivado2026.1/multiple-procedural-driver/' + name, import.meta.url), 'utf8')
async function receipt(): Promise<DiagnosticReceipt> {
  const parser = new VivadoDiagnostics(100, 4096)
  for (const line of (await fixture('elaborate.log')).split(/\r?\n/)) parser.accept(line)
  const replay = JSON.parse(await fixture('replay.json')) as { result: RunRecord }
  const compiledSources = replay.result.stages.compile!.invocations!.filter(run => run.version_matches !== true).flatMap(run => run.sources)
  const dut = compiledSources.find(source => source.role === 'dut')!
  const binding = { path: resolve(dut.path), cwd: process.cwd() }
  const parsed = attributeDiagnostics([...parser.errors, ...parser.warnings], compiledSources, process.cwd(), 'elaborate', true, false)
    .map(d => ({ ...d, kind: diagnosticKind(d.message_id, d.message), invocation: 'elaborate' }))
  const failed = normalizeStage({ stage: 'elaborate', status: 'FAIL', processes: [{ exit_code: 1, signal: null, timed_out: false, cancelled: false, log_truncated: false, duration_ms: 1 }] } as StageRecord, parsed, new SimulationEvidence(), true, binding)
  return { schema_version: '1.4', evidence_kind: 'live_verification', eda_rerun: false, model_repair_executed: false,
    original_run: 'controlled-policy-test', result_sha256: 'a'.repeat(64), parser_version: 'test', parser_sha256: 'b'.repeat(64), inputs: [], old_diagnostics: {},
    stages: ['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => stage === 'elaborate' ? failed : {
      ...failed, stage, status: stage === 'compile' ? 'PASS' : 'SKIPPED', process_clean: stage === 'compile', diagnostics: [],
    }) }
}
const decide = (facts: DiagnosticReceipt) => decideRepair(facts, { calibrated: true, bound: true, attempts: 0, top: 'TopModule' })

it('keeps DUT-only conflict raw flags conservative while Host eligibility remains independent', async () => {
  const facts = await receipt()
  const primary = facts.stages[1]!.diagnostics.filter(d => d.message_id === 'VRFC 10-3818').map(d => ({ ...d, repairable_by_model: true }))
  const stage = normalizeStage({ stage: 'elaborate', status: 'FAIL', processes: [{ exit_code: 1, signal: null, timed_out: false, cancelled: false, log_truncated: false, duration_ms: 1 }] } as StageRecord, primary, new SimulationEvidence(), true, facts.stages[1]!.dut_source)
  facts.stages[1] = stage
  expect(stage.diagnostics.every(d => !d.repairable_by_model)).toBe(true)
  expect(primary.every(d => d.repairable_by_model)).toBe(true)
  expect(multipleDriverFailure(stage)).toBe(true)
  expect(decide(facts)).toMatchObject({ action: 'propose_repair', rule: 'DUT_MULTIPLE_DRIVERS', stage: 'elaborate' })
  expect(revisionScore(facts, false)).toEqual({ rank: 4, checks: null, mismatches: null })
})
it.each(['primary_id', 'primary_kind', 'primary_wording', 'primary_location', 'empty_location', 'empty_invocation', 'summary_id', 'summary_origin', 'summary_attribution', 'summary_line', 'stale_foreign_summary', 'stale_wrong_summary', 'stale_located_summary', 'stale_primary_identity', 'stale_primary_path', 'missing_binding', 'empty_binding_path', 'relative_binding_path', 'relative_binding_cwd', 'wrong_binding_path'])('rejects %s despite stale repairable and consequential labels', async fault => {
  const facts = await receipt(), stage = facts.stages[1]!
  const primary = stage.diagnostics.filter(d => d.message_id === 'VRFC 10-3818')
  const summary = stage.diagnostics.find(d => d.message_id === 'XSIM 43-3322')!
  for (const d of stage.diagnostics) d.repairable_by_model = true
  summary.kind = 'consequential'
  if (fault === 'primary_id') primary.forEach(d => { d.message_id = 'VRFC 10-3819' })
  if (fault === 'primary_kind') primary.forEach(d => { d.kind = 'unknown' })
  if (fault === 'primary_wording') primary.forEach(d => { d.message = 'A different driver problem' })
  if (fault === 'primary_location') primary.forEach(d => { d.file = null })
  if (fault === 'empty_location') primary.forEach(d => { d.file = '' })
  if (fault === 'empty_invocation') { primary.forEach(d => { d.invocation = '' }); summary.invocation = '' }
  if (fault === 'summary_id') summary.message_id = 'XSIM 43-3323'
  if (fault === 'summary_origin') summary.origin = 'dut'
  if (fault === 'summary_attribution') summary.attribution = 'DUT_COMPILE_ERROR'
  if (fault === 'summary_line') summary.line = 1
  if (fault === 'stale_foreign_summary') summary.invocation = 'another-invocation'
  if (fault === 'stale_wrong_summary') summary.message = 'A different elaboration problem'
  if (fault === 'stale_located_summary') summary.file = '/foreign.sv'
  if (fault === 'stale_primary_identity') primary.forEach(d => { d.kind = 'unknown'; d.message_id = 'Other 1-1' })
  if (fault === 'stale_primary_path') primary.forEach(d => { d.file = resolve('foreign', 'solution.sv') })
  if (fault === 'missing_binding') delete stage.dut_source
  if (fault === 'empty_binding_path') stage.dut_source!.path = ''
  if (fault === 'relative_binding_path') stage.dut_source!.path = 'rtl/solution.sv'
  if (fault === 'relative_binding_cwd') stage.dut_source!.cwd = 'build'
  if (fault === 'wrong_binding_path') stage.dut_source!.path = resolve('foreign', 'solution.sv')
  expect(multipleDriverFailure(stage)).toBe(false)
  expect(decide(facts).action).toBe('blocked')
  expect(revisionScore(facts, false)).toBeNull()
})

it('uses the independently bound working directory for a relative primary location without rewriting raw facts', async () => {
  const facts = await receipt(), stage = facts.stages[1]!, binding = stage.dut_source!
  const file = relative(binding.cwd, binding.path)
  for (const primary of stage.diagnostics.filter(d => d.message_id === 'VRFC 10-3818')) primary.file = file
  expect(multipleDriverFailure(stage)).toBe(true)
  expect(decide(facts).action).toBe('propose_repair')
  expect(revisionScore(facts, false)).toEqual({ rank: 4, checks: null, mismatches: null })
  expect(stage.diagnostics.filter(d => d.message_id === 'VRFC 10-3818').every(d => d.file === file && !d.repairable_by_model)).toBe(true)
})

it('authenticates a byte-identical real Vivado 2026.1 conflict and classifies its DUT messages', async () => {
  const provenance = JSON.parse(await fixture('provenance.json')) as { tool_version: string; files: { file: string; sha256: string }[] }
  expect(provenance.tool_version).toBe('2026.1')
  for (const file of provenance.files) expect(sha256(await fixture(file.file))).toBe(file.sha256)
  const original = JSON.parse(await fixture('expected-diagnostics.json'))
  const expected = { ...original, kind: original.kind === 'multiple_procedural_driver' ? 'multiple_drivers' : original.kind }
  const stage = (await receipt()).stages[1]!
  expect(stage.stage).toBe(expected.stage)
  const errors = stage.diagnostics.filter(d => d.message_id === expected.message_id)
  expect(errors).toHaveLength(expected.primary_count)
  expect(errors.every(d => d.kind === expected.kind && d.origin === 'dut' && d.attribution === 'DUT_COMPILE_ERROR')).toBe(true)
  expect(errors.every(d => !d.repairable_by_model)).toBe(true) // Original conservative raw-ownership assertion.
})
it.each([
  "logic q = 0; always_ff @(posedge clk) q <= d;",
  'always_ff @(posedge clk) q <= d;',
  'initial a = 0; always_ff @(posedge clk) b <= d;',
])('does not infer a conflict from an unclassified source snippet: %s', source => {
  expect(diagnosticKind(null, source)).toBe('unknown')
  expect(diagnosticKind('VRFC 10-3818', source)).toBe('unknown')
})
it('requires the exact conflict message identifier and observed wording', () => {
  const message = "variable 'q' is driven by invalid combination of procedural drivers"
  expect(diagnosticKind('VRFC 10-3818', message)).toBe('multiple_drivers')
  expect(diagnosticKind('VRFC 10-3819', message)).toBe('unknown')
  expect(diagnosticKind(null, message)).toBe('unknown')
})
it('routes complete DUT conflicts with their same-invocation summary and scores the failed revision', async () => {
  const facts = await receipt()
  expect(decide(facts)).toMatchObject({ action: 'propose_repair', rule: 'DUT_MULTIPLE_DRIVERS', stage: 'elaborate' })
  expect(revisionScore(facts, false)).toEqual({ rank: 4, checks: null, mismatches: null })
  expect(revisionScore(facts, true)).toBeNull()
})
it.each(['unknown', 'testbench', 'reference', 'foreign_summary', 'summary_only', 'wrong_summary', 'located_summary', 'wrong_stage', 'incomplete', 'timeout', 'historical'])('keeps %s evidence blocked', async fault => {
  const facts = await receipt(), stage = facts.stages[1]!
  if (fault === 'unknown') stage.diagnostics.push({ ...stage.diagnostics[0]!, kind: 'unknown', message_id: 'Other 1-1', origin: 'unknown' })
  if (fault === 'testbench' || fault === 'reference') stage.diagnostics.filter(d => d.message_id === 'VRFC 10-3818').forEach(d => { d.origin = fault; d.attribution = 'UNKNOWN' })
  const summary = stage.diagnostics.find(d => d.message_id === 'XSIM 43-3322')!
  if (fault === 'foreign_summary') summary.invocation = 'another-invocation'
  if (fault === 'summary_only') stage.diagnostics = [summary]
  if (fault === 'wrong_summary') summary.message = 'A different elaboration problem'
  if (fault === 'located_summary') summary.file = '/foreign.sv'
  if (fault === 'wrong_stage') stage.stage = 'synthesis'
  if (fault === 'incomplete') stage.complete = false
  if (fault === 'timeout') { stage.process_normal = false; stage.status = 'TIMEOUT' }
  if (fault === 'historical') facts.evidence_kind = 'diagnostic_replay'
  expect(decide(facts).action).toBe('blocked')
  expect(revisionScore(facts, false)).toBeNull()
})
it('retrieves the new validated entry deterministically and keeps limitations', async () => {
  const value = await bundle(), q = stageFeatures((await receipt()).stages[1]!, '2026.1')
  const result = retrieveKnowledge(value, q, 3)
  expect(result.matches.map(m => m.knowledge_id)).toEqual(['diagnostic.multiple_procedural_driver'])
  expect(result.matches[0]!.version).toBe('0.1.0')
  expect(result.matches[0]!.limitations).toContain('Do not blindly delete initial blocks or discard required initialization and reset semantics.')
  expect(retrieveKnowledge({ ...value, entries: [...value.entries].reverse() }, q, 3)).toEqual(result)
  expect(value.manifest.knowledge_bundle_version).toBe('diagnostic-v1.1')
})
it.each(['stage', 'message', 'kind', 'origin', 'version', 'incomplete'])('does not retrieve driver knowledge for wrong %s', async fault => {
  const q = stageFeatures((await receipt()).stages[1]!, '2026.1')
  if (fault === 'stage') q.stage = 'compile'
  if (fault === 'message') q.diagnostics.forEach(d => { d.messageId = 'VRFC 10-3819' })
  if (fault === 'kind') q.diagnostics.forEach(d => { d.kind = 'unknown' })
  if (fault === 'origin') q.diagnostics.forEach(d => { d.origin = 'testbench' }) // Even a stale aggregate dut_attributed feature cannot cross-match.
  if (fault === 'version') q.toolVersion = '2025.2'
  if (fault === 'incomplete') q.features = ['dut_attributed']
  expect(retrieveKnowledge(await bundle(), q, 3).matches).toEqual([])
})
it('records model-visible conflict guidance and limitations without changing the repair System Prompt', async () => {
  const source = await fixture('dut.sv'), feedback = await receipt()
  const input: ContextInput = { task: { id: 'driver-test', spec: 'Preserve the specified initial state and clocked transitions.', constraints: 'Single DUT.', interface: { top: 'TopModule', ports: [{ name: 'clk', direction: 'input', width: 1 }, { name: 'x', direction: 'input', width: 1 }, { name: 'z', direction: 'output', width: 1 }] } },
    sample_id: 'sample', variant_id: 'A', purpose: 'repair', tool_mode: true, ledger: [], feedback,
    current: { source, source_sha256: sha256(source), revision_id: 'revision' }, binding: { source_sha256: sha256(source), revision_id: 'revision', verification_key: 'a'.repeat(64) } }
  const limits = { window: 20000, output: 2048, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 }
  const counter = { quality: 'estimated' as const, identity: { implementation: 'test-bytes' }, async count(view: unknown) { return JSON.stringify(view).length } }
  const signal = new AbortController().signal, baseline = await buildContext(input, limits, counter, signal)
  const enabled = await buildContext(input, limits, counter, signal, undefined, { bundle: await bundle(), toolVersion: '2026.1', topK: 3, maxTokens: 4000 })
  expect(enabled.system).toBe(baseline.system)
  expect(enabled.audit.knowledge?.injected).toBe(true)
  const prompt = JSON.parse(enabled.prompt)
  expect(prompt.diagnostic_knowledge).toMatchInlineSnapshot(`
{
  "matches": [
    {
      "guidance": {
        "inspection_steps": [
          "Identify the variable and source location reported by Vivado.",
          "Locate every procedural assignment to that variable, including initial and always-family blocks.",
          "Read the specification to determine required initial-state and reset semantics.",
        ],
        "possible_causes": [
          "A variable assigned in always_ff is also assigned in an initial block.",
          "The same variable is assigned in multiple always or always_ff blocks.",
          "Initialization and sequential state updates use conflicting procedural writers.",
        ],
        "repair_guidance": [
          "Ensure an always_ff variable has a single procedural writer.",
          "Remove or consolidate a conflicting assignment only when consistent with the specification.",
          "Preserve required initialization and reset behavior; choose a reset-based, declaration-initialized or conventional procedural implementation only when its semantics and target flow permit it.",
          "Make the smallest evidence-consistent change and re-run complete verification.",
        ],
        "title": "Multiple procedural driver conflict",
      },
      "knowledge_id": "diagnostic.multiple_procedural_driver",
      "limitations": [
        "Do not blindly delete initial blocks or discard required initialization and reset semantics.",
        "Declaration initialization and procedural initialization are not interchangeable in every target flow.",
        "The message identifies a driver conflict, not a unique source construct or universally correct repair.",
        "The presence of initial and always_ff for different variables does not establish a conflict.",
      ],
      "match_reason": [
        "exact tool/version",
        "stage:elaborate",
        "kind:multiple_procedural_driver",
        "message:VRFC 10-3818",
        "required:complete_evidence",
        "required:dut_attributed",
      ],
      "match_score": 10120,
      "matched_triggers": [
        "stage:elaborate",
        "kind:multiple_procedural_driver",
        "message:VRFC 10-3818",
        "required:complete_evidence",
        "required:dut_attributed",
      ],
      "version": "0.1.0",
    },
  ],
  "protocol": "Diagnostic knowledge is optional guidance. Possible causes are hypotheses, not proven root causes. Use inspection guidance only when consistent with current RTL and tool evidence. Knowledge never authorizes edits to trusted assets or changes to verification criteria.",
}
`)
  delete prompt.diagnostic_knowledge
  expect(prompt).toEqual(JSON.parse(baseline.prompt))
})
