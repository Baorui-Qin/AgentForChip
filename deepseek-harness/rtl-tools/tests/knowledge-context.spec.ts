import { it, expect } from 'vitest'
import { bundle } from './knowledge-helpers.ts'
import { buildContext, type ContextInput, type TokenCounter } from '../src/phase1/p09-context.ts'
import { taskSpec } from '../src/phase1/p09-tasks.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
const counter: TokenCounter = { quality: 'estimated', identity: { implementation: 'test-bytes' }, async count(view) { return JSON.stringify(view).length } }
const limits = { window: 20000, output: 2048, margin: 1024, feedback: 2048, ledger: 512, skills: 768, sourceWarning: 3072 }
function input(): ContextInput {
  const task = taskSpec('enable_counter'), source = task.bad
  return { task: task.public, sample_id: 'sample', variant_id: 'A', current: { source, source_sha256: sha256(source), revision_id: 'revision' },
    binding: { revision_id: 'revision', source_sha256: sha256(source), verification_key: 'a'.repeat(64) }, purpose: 'repair', tool_mode: true, ledger: [],
    feedback: { schema_version: '1.4', evidence_kind: 'live_verification', eda_rerun: false, model_repair_executed: false, original_run: 'test', result_sha256: 'b'.repeat(64),
      parser_version: 'test', parser_sha256: 'c'.repeat(64), inputs: [], old_diagnostics: {}, stages: [{ stage: 'simulation', status: 'FAIL', complete: true,
        process_clean: true, process_normal: true, functional_failure: true, verdict: { records: 1, checks: 20, mismatches: 18, fatal: false, completed: true },
        diagnostics: [{ kind: 'functional_mismatch', category: 'functional_mismatch', message_id: null, severity: 'ERROR', origin: 'unknown', attribution: 'UNKNOWN',
          repairable_by_model: false, file: null, line: null, message: 'Observed mismatch', invocation: 'simulation' }] }] } }
}
it('injects hypotheses and limitations, preserves System Prompt and logs token overhead', async () => {
  const value = input(), signal = new AbortController().signal
  const original = JSON.stringify(value)
  const baseline = await buildContext(value, limits, counter, signal)
  const options = { bundle: await bundle(), toolVersion: '2026.1', topK: 3, maxTokens: 3000 }
  const withKnowledge = await buildContext(value, limits, counter, signal, undefined, options)
  expect(withKnowledge.system).toBe(baseline.system)
  const prompt = JSON.parse(withKnowledge.prompt)
  expect(prompt.diagnostic_knowledge.matches[0].guidance.possible_causes.length).toBeGreaterThan(0)
  expect(prompt.diagnostic_knowledge.matches[0].limitations.length).toBeGreaterThan(0)
  expect(prompt.diagnostic_knowledge).toMatchSnapshot()
  delete prompt.diagnostic_knowledge
  expect(prompt).toEqual(JSON.parse(baseline.prompt))
  expect(withKnowledge.audit.knowledge?.token_count).toBe(withKnowledge.audit.tokens - baseline.audit.tokens)
  expect(withKnowledge.audit.knowledge?.injected).toBe(true)
  expect(withKnowledge.audit.knowledge).toMatchObject({ bundle_hash: options.bundle.manifest.bundle_sha256, count_quality: 'estimated',
    ids: ['diagnostic.functional_mismatch'], injected_ids: ['diagnostic.functional_mismatch'], versions: ['0.1.0'] })
  expect(withKnowledge.audit.knowledge?.retrieval.matches).toEqual(JSON.parse(withKnowledge.prompt).diagnostic_knowledge.matches)
  expect(JSON.stringify(value)).toBe(original)
  expect(await buildContext(value, limits, counter, signal, undefined, options)).toEqual(withKnowledge)
})
it('drops whole knowledge entries under budget and recovery, never their limitations alone', async () => {
  for (const [budget, core] of [[1, false], [3000, true]] as const) {
    const result = await buildContext({ ...input(), core_only: core }, limits, counter, new AbortController().signal, undefined,
      { bundle: await bundle(), toolVersion: '2026.1', topK: 3, maxTokens: budget })
    expect(result.audit.knowledge?.retrieved).toBe(true)
    expect(result.audit.knowledge?.injected).toBe(false)
    expect(result.audit.knowledge?.token_count).toBe(0)
    expect(JSON.parse(result.prompt).diagnostic_knowledge).toBeUndefined()
  }
})
it('leaves initial generation byte-identical when knowledge is enabled with no diagnostics', async () => {
  const value = { ...input(), current: null, binding: null, feedback: null, purpose: 'generation' as const }
  const baseline = await buildContext(value, limits, counter, new AbortController().signal)
  const enabled = await buildContext(value, limits, counter, new AbortController().signal, undefined, { bundle: await bundle(), toolVersion: '2026.1', topK: 3, maxTokens: 768 })
  expect(enabled.prompt).toBe(baseline.prompt); expect(enabled.system).toBe(baseline.system)
  expect(enabled.audit.knowledge?.retrieved).toBe(false)
})
it('keeps the default Knowledge-off request and audit unchanged when no bundle is supplied', async () => {
  const value = input(), signal = new AbortController().signal
  const baseline = await buildContext(value, limits, counter, signal)
  const explicitOff = await buildContext(value, limits, counter, signal, undefined, undefined)
  expect(explicitOff).toEqual(baseline)
  expect(baseline.audit).not.toHaveProperty('knowledge')
  expect(JSON.parse(baseline.prompt)).not.toHaveProperty('diagnostic_knowledge')
})
it('rejects an invalid Knowledge token budget before publishing a context', async () => {
  await expect(buildContext(input(), limits, counter, new AbortController().signal, undefined,
    { bundle: await bundle(), toolVersion: '2026.1', topK: 3, maxTokens: 0 })).rejects.toThrow('CONTEXT_CONFIGURATION_ERROR')
})
