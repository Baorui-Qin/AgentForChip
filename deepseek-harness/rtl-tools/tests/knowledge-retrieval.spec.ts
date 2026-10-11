import { it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { bundle, query, repositoryRoot } from './knowledge-helpers.ts'
import { retrieveKnowledge } from '../src/knowledge/knowledge-retrieval.ts'
import { diagnosticFeatures, stageFeatures } from '../src/knowledge/diagnostic-features.ts'
import { VivadoDiagnostics } from '../src/vivado-parser.ts'
import { diagnosticKind } from '../src/phase1/repair-diagnostics.ts'
import { SimulationEvidence } from '../src/phase1/simulation-evidence.ts'
import type { RepairStage } from '../src/phase1/repair-diagnostics.ts'

function stage(diagnostics: RepairStage['diagnostics'], phase = 'elaborate'): RepairStage {
  return { stage: phase, status: 'FAIL', complete: true, process_clean: false, process_normal: true, diagnostics,
    verdict: { records: 0, checks: null, mismatches: null, fatal: false, completed: false }, functional_failure: false }
}

it('matches validated entries against their real tool evidence and rejects unrelated kinds', async () => {
  const value = await bundle()
  for (const entry of value.entries.filter(e => e.status === 'validated')) {
    const q = query(); q.diagnostics = []; q.features.push('functional_failure')
    for (const reference of entry.source.references.filter(r => r.path.endsWith('.log'))) {
      const text = await readFile(join(repositoryRoot, reference.path), 'utf8')
      const parser = new VivadoDiagnostics(100, 4096), simulation = new SimulationEvidence(true)
      for (const line of text.split(/\r?\n/)) { parser.accept(line); simulation.accept(line) }
      q.diagnostics.push(...stageFeatures(stage(parser.errors.map(d => ({ kind: diagnosticKind(d.code ?? null, d.message), message_id: d.code ?? null,
        category: d.type, severity: d.severity, origin: 'dut', attribution: 'DUT_COMPILE_ERROR', repairable_by_model: false,
        file: d.file ?? null, line: d.line ?? null, message: d.message, invocation: 'recorded-evidence' })), entry.stage[0]!), '2026.1').diagnostics)
      if (simulation.completed && (simulation.mismatches ?? 0) > 0) q.diagnostics.push({ ...query().diagnostics[0]!, kind: 'functional_mismatch' })
    }
    q.stage = entry.stage[0]!
    const matches = retrieveKnowledge(value, q, 3).matches
    expect(matches.map(m => m.knowledge_id), entry.id).toContain(entry.id)
    expect(matches.find(m => m.knowledge_id === entry.id)!.limitations).toEqual(entry.limitations)
    q.diagnostics = [{ ...query().diagnostics[0]!, kind: 'tool_environment' }]
    expect(retrieveKnowledge(value, q, 3).matches).toEqual([])
  }
})
it.each(['unknown', 'language_mode', 'consequential', 'execution_limit', 'tool_environment', 'simulation_evidence'])('has no generic fallback for %s', async kind => {
  expect(retrieveKnowledge(await bundle(), query(kind), 3).matches).toEqual([])
})
it.each(['version', 'stage', 'severity', 'required_feature', 'tool'])('does not match a wrong %s', async mismatch => {
  const q = query()
  if (mismatch === 'version') q.toolVersion = '2025.2'
  if (mismatch === 'stage') q.stage = 'simulation'
  if (mismatch === 'severity') q.diagnostics[0]!.severity = 'WARNING'
  if (mismatch === 'required_feature') q.features = []
  if (mismatch === 'tool') q.tool = 'other'
  expect(retrieveKnowledge(await bundle(), q, 3).matches).toEqual([])
})
it('excludes drafts and uses stable ordering and Top-K for overlapping diagnostics', async () => {
  const value = await bundle(), q = query()
  q.diagnostics.push({ ...q.diagnostics[0]!, kind: 'name_resolution' }, { ...q.diagnostics[0]!, kind: 'type_or_port' })
  const result = retrieveKnowledge(value, q, 2)
  expect(result.matches.map(m => m.knowledge_id)).toEqual(['diagnostic.name_resolution', 'diagnostic.syntax'])
  expect(result.eligibleCount).toBe(3)
  expect(retrieveKnowledge({ ...value, entries: [...value.entries].reverse() }, q, 2)).toEqual(result)
  expect(retrieveKnowledge(value, query('unsupported_feature'), 3).matches).toEqual([])
  expect(() => retrieveKnowledge(value, q, 4)).toThrow('INVALID_KNOWLEDGE_TOP_K')
})
it('does not cross-match message IDs from a different diagnostic kind', async () => {
  const q = query('declaration_order'); q.diagnostics.push({ ...q.diagnostics[0]!, kind: 'unknown', messageId: 'VRFC 10-3380' })
  expect(retrieveKnowledge(await bundle(), q, 3).matches).toEqual([])
})
it('represents absent evidence without invented time, cycle or root cause', () => {
  expect(diagnosticFeatures(null, '2026.1')).toEqual({ tool: 'vivado', toolVersion: '2026.1', stage: null, features: [], diagnostics: [], mismatchCount: null, firstFailureTime: null, signals: [] })
})
it('maps the exact DUT VRFC multiple-driver observation without changing parser facts', async () => {
  const diagnostic: RepairStage['diagnostics'][number] = { kind: 'multiple_drivers', message_id: 'VRFC 10-3818', category: 'verification', severity: 'ERROR',
    origin: 'dut', attribution: 'DUT_COMPILE_ERROR', repairable_by_model: true, file: 'rtl/solution.sv', line: 7,
    message: "variable 'q' is driven by invalid combination of procedural drivers", invocation: 'elaborate' }
  const original = JSON.stringify(diagnostic), q = stageFeatures(stage([diagnostic]), '2026.1')
  expect(q.diagnostics[0]!.kind).toBe('multiple_procedural_driver')
  expect(retrieveKnowledge(await bundle(), q, 3).matches.map(m => m.knowledge_id)).toEqual(['diagnostic.multiple_procedural_driver'])
  expect(JSON.stringify(diagnostic)).toBe(original)
})
it.each(['unknown', 'wrong-message-id', 'testbench', 'reference'] as const)('does not alias or retrieve an unqualified multiple-driver %s', async fault => {
  const diagnostic: RepairStage['diagnostics'][number] = { kind: fault === 'unknown' ? 'unknown' : 'multiple_drivers',
    message_id: fault === 'wrong-message-id' ? 'VRFC 10-3819' : 'VRFC 10-3818', category: 'verification', severity: 'ERROR',
    origin: fault === 'testbench' || fault === 'reference' ? fault : 'dut', attribution: 'UNKNOWN', repairable_by_model: false,
    file: 'rtl/solution.sv', line: 7, message: 'multiple driver observation', invocation: 'elaborate' }
  const q = stageFeatures(stage([diagnostic]), '2026.1')
  expect(q.diagnostics[0]!.kind).toBe(diagnostic.kind)
  expect(retrieveKnowledge(await bundle(), q, 3).matches).toEqual([])
})
