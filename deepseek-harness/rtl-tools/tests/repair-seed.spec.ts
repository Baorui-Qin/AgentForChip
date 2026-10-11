import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { afterEach, expect, it } from 'vitest'
import { bindRepairSeedDiagnostics, loadRepairSeed } from '../src/phase1/repair-seed.ts'
import { sha256 } from '../src/phase1/snapshots.ts'
import { decideRepair } from '../src/phase1/repair-policy.ts'
import { parseRecord, type RunRecord } from '../src/phase1/records.ts'
import type { PhaseId } from '../src/phase1/contracts.ts'
import type { DiagnosticReceipt, readDiagnostics } from '../src/phase1/repair-diagnostics.ts'

const source = 'module TopModule(input in, output out); assign out=in; endmodule\r\n'
const dut = { top: 'TopModule', ports: [{ name: 'in', direction: 'input' as const, width: 1 }, { name: 'out', direction: 'output' as const, width: 1 }] }
const roots: string[] = []
afterEach(async () => { for (const root of roots.splice(0)) { if (await realpath(root) !== root || !root.startsWith(resolve(tmpdir()) + '\\') && !root.startsWith(resolve(tmpdir()) + '/')) throw new Error('SEED_CLEANUP_ROOT_CHANGED'); await rm(root, { recursive: true, force: true }) } })
async function setup() {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'repair-seed-'))); roots.push(root)
  const file = join(root, 'frozen.sv'); await writeFile(file, source)
  const run = join(root, 'run'); await mkdir(run); await writeFile(join(run, 'result.json'), '{}')
  const record: RunRecord = { schema_version: '1.1', experiment_id: 'synthetic-seed-binding' as PhaseId, task_id: 'synthetic-seed-task' as PhaseId,
    sample_id: 0, mode: 'baseline', final_status: 'FAIL', final_revision_id: 'synthetic-snapshot' as PhaseId,
    final_source_sha256: sha256(source), verification_key: 'sha256:' + 'a'.repeat(64), final_verified: false,
    stages: { compile: null, elaborate: null, simulation: null, synthesis: null }, semantic_repairs: 0,
    model_requests_total: 0, transport_retries: 0, stop_reason: 'Synthetic binding-only fixture; not EDA evidence.', artifact_manifest: [] }
  parseRecord('RunResult', record)
  const facts: Awaited<ReturnType<typeof readDiagnostics>> = { record,
    receipt: { schema_version: '1.4', evidence_kind: 'live_verification', eda_rerun: false, model_repair_executed: false,
      original_run: await realpath(run), result_sha256: sha256('{}'), parser_version: 'synthetic_binding_only', parser_sha256: 'b'.repeat(64),
      inputs: [{ path: 'snapshot-synthetic/rtl/solution.sv', sha256: sha256(source), issue: null }], old_diagnostics: {},
      stages: ['compile', 'elaborate', 'simulation', 'synthesis'].map(stage => ({ stage, status: stage === 'compile' || stage === 'elaborate' ? 'PASS' : stage === 'simulation' ? 'FAIL' : 'SKIPPED',
        complete: true, process_clean: true, process_normal: true, diagnostics: [], functional_failure: stage === 'simulation',
        verdict: { records: 1, completed: true, checks: 1, mismatches: 1, fatal: false } })) } }
  return { root, file, run, facts }
}
it('loads unchanged frozen source bytes and never synthesizes a negative control', async () => {
  const s = await setup()
  expect(await loadRepairSeed(s.file, sha256(source), { [s.file]: sha256(source) }, dut)).toBe(source)
  expect(await readFile(s.file, 'utf8')).toBe(source)
})
it.each(['missing-file', 'invalid-hash', 'unfrozen', 'changed'] as const)('rejects a %s seed before verification', async fault => {
  const s = await setup(), hash = sha256(source), files = { [s.file]: hash }
  if (fault === 'changed') await writeFile(s.file, source.replace('out=in', 'out=~in'))
  await expect(loadRepairSeed(fault === 'missing-file' ? '' : s.file, fault === 'invalid-hash' ? 'wrong' : hash, fault === 'unfrozen' ? {} : files, dut))
    .rejects.toThrow(fault === 'changed' ? 'REPAIR_SEED_CHANGED' : 'REPAIR_SEED_NOT_FROZEN')
})
it('keeps fresh physical source, diagnostics, result and verification-key identities separate from Agent revision ids', async () => {
  const s = await setup(), binding = await bindRepairSeedDiagnostics(source, 'agent-revision', s.run, s.facts)
  expect(binding).toMatchObject({ revision_id: 'agent-revision', source_sha256: sha256(source), evidence_kind: 'live_verification',
    verification_key: s.facts.record.verification_key, verification_run: await realpath(s.run), result_sha256: sha256('{}'),
    diagnostics_sha256: sha256(JSON.stringify(s.facts.receipt)), physical_dut: { sha256: sha256(source), issue: null }, diagnostic_origins: [] })
  expect(binding.physical_dut.path).not.toContain(binding.revision_id)
})
it.each(['replay', 'missing-physical', 'duplicate-physical', 'physical-issue', 'wrong-source', 'wrong-run', 'wrong-result', 'missing-key', 'wrong-key'] as const)('rejects %s diagnostics without promoting old evidence', async fault => {
  const s = await setup()
  if (fault === 'replay') s.facts.receipt.evidence_kind = 'diagnostic_replay'
  if (fault === 'missing-physical') s.facts.receipt.inputs = []
  if (fault === 'duplicate-physical') s.facts.receipt.inputs.push({ ...s.facts.receipt.inputs[0]! })
  if (fault === 'physical-issue') s.facts.receipt.inputs[0]!.issue = 'asset_hash_mismatch'
  if (fault === 'wrong-source') s.facts.receipt.inputs[0]!.sha256 = '0'.repeat(64)
  if (fault === 'wrong-run') s.facts.receipt.original_run = s.root
  if (fault === 'wrong-result') s.facts.receipt.result_sha256 = '0'.repeat(64)
  if (fault === 'missing-key') s.facts.record.verification_key = null
  if (fault === 'wrong-key') s.facts.record.verification_key = 'old-key'
  await expect(bindRepairSeedDiagnostics(source, 'agent-revision', s.run, s.facts)).rejects.toThrow('REPAIR_SEED_DIAGNOSTICS_BINDING_INVALID')
})
it('records diagnostic origins while leaving non-DUT repair rejection to the current Host policy', async () => {
  const s = await setup(), compile = s.facts.receipt.stages[0]!
  compile.status = 'FAIL'; compile.functional_failure = false
  compile.diagnostics = [{ kind: 'syntax', category: 'compile', message_id: 'synthetic', origin: 'reference', attribution: 'UNKNOWN',
    repairable_by_model: false, severity: 'ERROR', file: 'trusted/ref.sv', line: 1, message: 'Synthetic non-DUT diagnostic', invocation: 'compile' }]
  const binding = await bindRepairSeedDiagnostics(source, 'agent-revision', s.run, s.facts)
  expect(binding.diagnostic_origins).toEqual(['reference'])
  expect(decideRepair(s.facts.receipt as DiagnosticReceipt, { calibrated: true, bound: true, attempts: 0, top: 'TopModule' })).toMatchObject({ action: 'blocked', rule: 'UNCLASSIFIED_FAILURE' })
})
