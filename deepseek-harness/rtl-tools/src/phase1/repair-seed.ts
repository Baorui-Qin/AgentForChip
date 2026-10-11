/** Frozen historical RTL seeds require fresh source-bound Host verification. @module rtl-tools/phase1/repair-seed */
import { readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { sha256 } from './snapshots.ts'
import { checkAutoSource } from './p09-auto-policy.ts'
import type { DUTInterface } from './candidates.ts'
import type { readDiagnostics } from './repair-diagnostics.ts'

/** Load only the exact file and hash named by the campaign freeze. @param file - configured immutable seed file. @param expectedHash - pinned source digest. @param frozenFiles - campaign source manifest. @param dut - frozen public interface. @returns unchanged source bytes decoded as UTF-8. */
export async function loadRepairSeed(file: string, expectedHash: string, frozenFiles: Record<string, string>, dut: DUTInterface): Promise<string> {
  if (!file || !/^[a-f0-9]{64}$/.test(expectedHash) || frozenFiles[file] !== expectedHash) throw new Error('REPAIR_SEED_NOT_FROZEN')
  const bytes = await readFile(file)
  if (sha256(bytes) !== expectedHash) throw new Error('REPAIR_SEED_CHANGED')
  const source = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes)
  if (sha256(source) !== expectedHash) throw new Error('REPAIR_SEED_CHANGED')
  checkAutoSource(source, dut)
  return source
}

/** Bind fresh diagnostics to this Agent revision without equating Agent and EDA revision ids. @param source - submitted seed or edited source. @param revision - Agent revision id. @param run - newly executed Host verification directory. @param facts - parsed retained diagnostics and run result. @returns auditable source/key/physical evidence and observed origins, never repair authorization. */
export async function bindRepairSeedDiagnostics(source: string, revision: string, run: string, facts: Awaited<ReturnType<typeof readDiagnostics>>) {
  const hash = sha256(source), physical = facts.receipt.inputs.filter(item => /(?:^|\/)rtl\/solution\.sv$/.test(item.path.replaceAll('\\', '/')))
  if (facts.receipt.evidence_kind !== 'live_verification' || facts.receipt.original_run !== await realpath(run) ||
    facts.receipt.result_sha256 !== sha256(await readFile(join(run, 'result.json'))) || facts.record.final_source_sha256 !== hash ||
    !/^(?:sha256:)?[a-f0-9]{64}$/.test(facts.record.verification_key ?? '') ||
    physical.length !== 1 || physical[0]!.issue !== null || physical[0]!.sha256 !== hash) throw new Error('REPAIR_SEED_DIAGNOSTICS_BINDING_INVALID')
  return { revision_id: revision, source_sha256: hash, verification_key: facts.record.verification_key,
    verification_run: facts.receipt.original_run, diagnostics_sha256: sha256(JSON.stringify(facts.receipt)),
    result_sha256: facts.receipt.result_sha256, evidence_kind: facts.receipt.evidence_kind, physical_dut: physical[0]!,
    diagnostic_origins: [...new Set(facts.receipt.stages.flatMap(stage => stage.diagnostics.map(diagnostic => diagnostic.origin)))].sort() }
}
