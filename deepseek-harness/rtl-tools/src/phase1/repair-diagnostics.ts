/** Versioned observed diagnostics, shared by repair execution and historical replay. @module rtl-tools/phase1/repair-diagnostics */
import { readFile, stat, realpath } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { VivadoDiagnostics } from '../vivado-parser.ts'
import { attributeDiagnostics, type AttributedDiagnostic } from './attribution.ts'
import { SimulationEvidence } from './simulation-evidence.ts'
import { parseRecord, type RunRecord, type StageRecord } from './records.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import { simulationFeedback, withWaveform, type SimulationFeedback } from './waveform-feedback.ts'

/** Observed symptom, separate from source ownership or execution authorization. */
export function diagnosticKind(code: string | null, message: string): string {
  if (code === 'VRFC 10-8549' && /^SystemVerilog keyword '[A-Za-z_][A-Za-z_0-9]*' used in incorrect context$/.test(message)) return 'syntax'
  if (code === 'VRFC 10-3380') return 'declaration_order'
  if (code === 'VRFC 10-3818' && /^variable '[A-Za-z_$][\w$]*' is driven by invalid combination of procedural drivers$/.test(message)) return 'multiple_drivers'
  if (['VRFC 10-8530', 'Synth 8-6156', 'Common 17-69'].includes(code ?? '')) return 'consequential'
  if (/language_mode_error/.test(message)) return 'language_mode'
  if (/syntax error/i.test(message)) return 'syntax'
  if (/used before.*declaration|undeclared|not declared|cannot find.*identifier/i.test(message)) return 'name_resolution'
  if (/module .*not found|cannot find.*module|cannot open.*include|library .*not found/i.test(message)) return 'dependency'
  if (/type mismatch|port .*not found|width mismatch|incompatible type/i.test(message)) return 'type_or_port'
  if (/not supported|unsupported/i.test(message)) return 'unsupported_feature'
  if (/license|licensing|permission denied|out of memory|no space left/i.test(message)) return 'tool_environment'
  if (/budget exceeded|cancelled|timed out|truncat/i.test(message)) return 'execution_limit'
  return 'unknown'
}
/** Diagnostic evidence has no execution permit. */
export interface RepairStage {
  stage: string; status: string; complete: boolean; process_clean: boolean; process_normal: boolean
  diagnostics: (AttributedDiagnostic & { kind: string; invocation: string })[]
  verdict: { records: number; checks: number | null; mismatches: number | null; fatal: boolean; completed: boolean }
  functional_failure: boolean
  simulation_feedback?: SimulationFeedback
}
/** Pure combination of parsed lines and process facts. @param record - original stage. @param parsed - messages with ownership. @param verdict - observed completion. @param complete - retained input evidence. @returns normalized facts, not a repair permission. */
export function normalizeStage(record: StageRecord, parsed: RepairStage['diagnostics'], verdict: SimulationEvidence, complete: boolean): RepairStage {
  const processes = record.invocations?.filter(run => run.version_matches !== true).map(run => run.process) ?? record.processes ?? []
  const normal = processes.length > 0 && processes.every(p => p.exit_code !== null && !p.signal && !p.cancelled && !p.timed_out && !p.log_truncated)
  const clean = normal && processes.every(p => p.exit_code === 0)
  const functional = record.stage === 'simulation' && complete && clean && verdict.completed && verdict.mismatches! > 0 && !parsed.some(d => d.severity === 'ERROR')
  const observed = parsed.map(d => (['testbench', 'reference'].includes(d.origin) && !['declaration_order', 'unsupported_feature', 'consequential'].includes(d.kind))
    ? { ...d, attribution: 'UNKNOWN' as const, repairable_by_model: false } : { ...d })
  const errors = observed.filter(d => d.severity === 'ERROR')
  const primary = errors.filter(d => d.origin === 'dut' && d.attribution === 'DUT_COMPILE_ERROR' && d.kind === 'multiple_drivers')
  if (record.stage === 'elaborate' && complete && normal && primary.length && errors.every(d => primary.includes(d) || (
    d.origin === 'unknown' && d.file === null && d.message_id === 'XSIM 43-3322' &&
    d.message === 'Static elaboration of top level Verilog design unit(s) in library work failed.' && primary.some(p => p.invocation === d.invocation)))) {
    for (const d of errors) {
      if (primary.includes(d)) d.repairable_by_model = true
      else d.kind = 'consequential'
    }
  }
  if (record.stage === 'simulation' && record.status !== 'SKIPPED' && !verdict.passed) observed.push({ category: verdict.completed && verdict.mismatches! > 0 ? 'functional_mismatch' : 'simulation_evidence',
    kind: verdict.completed && verdict.mismatches! > 0 ? 'functional_mismatch' : 'simulation_evidence',
    message_id: null, file: null, line: null, origin: 'unknown', attribution: 'UNKNOWN', repairable_by_model: false,
    severity: 'ERROR', invocation: 'simulation',
    message: `Observed verdict: records=${verdict.records}, checks=${verdict.checks}, mismatches=${verdict.mismatches}, fatal=${verdict.fatal}; process_clean=${clean}.` })
  return { stage: record.stage, status: record.status, complete, process_clean: clean, process_normal: normal, diagnostics: observed,
    verdict: { records: verdict.records, checks: verdict.checks, mismatches: verdict.mismatches, fatal: verdict.fatal, completed: verdict.completed },
    functional_failure: functional }
}
/** Self-describing normalization receipt. Historical replay cannot become execution evidence. */
export interface DiagnosticReceipt {
  schema_version: '1.4'; evidence_kind: 'diagnostic_replay' | 'live_verification'; eda_rerun: false; model_repair_executed: false
  original_run: string; result_sha256: string; parser_version: string; parser_sha256: string
  inputs: { path: string; sha256: string | null; issue: string | null }[]
  stages: RepairStage[]; old_diagnostics: Record<string, unknown>
}
/** Parse a bounded existing run without editing its files. @param directory - host-selected run. @param kind - provenance selected by host. @param maxBytes - per-log cap. @returns receipt and validated historical record. */
export async function readDiagnostics(directory: string, kind: DiagnosticReceipt['evidence_kind'], maxBytes = 4194304): Promise<{ receipt: DiagnosticReceipt; record: RunRecord }> {
  const root = await realpath(directory)
  const bytes = await readFile(await checkedFile(root, 'result.json'))
  const record = parseRecord('RunResult', JSON.parse(bytes.toString('utf8'))) as RunRecord
  const parserFiles = ['repair-diagnostics.ts', 'simulation-evidence.ts', 'waveform-feedback.ts', 'attribution.ts', '../vivado-parser.ts']
  const parserBytes = []
  for (const path of parserFiles) parserBytes.push(await readFile(fileURLToPath(new URL(path, import.meta.url))))
  const receipt: DiagnosticReceipt = { schema_version: '1.4', evidence_kind: kind, eda_rerun: false, model_repair_executed: false,
    original_run: root, result_sha256: sha256(bytes), parser_version: 'counter-diagnostics-3', parser_sha256: sha256(Buffer.concat(parserBytes)), inputs: [], stages: [], old_diagnostics: {} }
  const manifestRef = record.artifact_manifest.find(path => /^snapshot-[^/]+\/manifest.json$/.test(path))
  let dataset = false, assetsValid = false
  if (manifestRef) {
    try {
      const manifestBytes = await readFile(await checkedFile(root, manifestRef))
      receipt.inputs.push({ path: manifestRef, sha256: sha256(manifestBytes), issue: null })
      const manifest = JSON.parse(manifestBytes.toString('utf8'))
      dataset = !!manifest.evaluation; assetsValid = true
      for (const [name, hash] of Object.entries(manifest.files as Record<string, string>)) {
        const path = dirname(manifestRef).replace(/\\/g, '/') + '/' + name
        const actual = sha256(await readFile(await checkedFile(root, path)))
        const issue = actual === hash ? null : 'asset_hash_mismatch'
        receipt.inputs.push({ path, sha256: actual, issue }); if (issue) assetsValid = false
      }
    } catch { assetsValid = false; receipt.inputs.push({ path: manifestRef, sha256: null, issue: 'manifest_or_asset_unavailable' }) }
  }
  for (const stage of Object.values(record.stages)) {
    if (!stage) continue
    const evidence = new SimulationEvidence(dataset), diagnostics: RepairStage['diagnostics'] = []
    const simulationLines: string[] = []
    let complete = assetsValid && !!stage.invocations
    for (const invocation of stage.invocations ?? []) {
      if (invocation.version_matches === true) continue
      const parser = new VivadoDiagnostics(100, 4096)
      for (const path of [invocation.stdout_log, invocation.stderr_log]) {
        try {
          const file = await checkedFile(root, path)
          if ((await stat(file)).size > maxBytes) throw new Error('Log byte limit')
          const log = await readFile(file)
          receipt.inputs.push({ path, sha256: sha256(log), issue: null })
          for (const line of new TextDecoder('utf-8', { fatal: true }).decode(log).split(/\r?\n/)) {
            parser.accept(line.slice(0, 4096), line.length > 4096)
            if (stage.stage === 'simulation') { evidence.accept(line); simulationLines.push(line) }
          }
        } catch { complete = false; receipt.inputs.push({ path, sha256: null, issue: 'log_unavailable_or_over_limit' }) }
      }
      complete &&= !parser.lineTruncated && !parser.omitted && !invocation.process.log_truncated
      const sources = Object.values(record.stages).flatMap(item => item?.invocations?.flatMap(run => run.sources) ?? [])
      diagnostics.push(...attributeDiagnostics([...parser.errors, ...parser.warnings], sources, join(root, 'build'), stage.stage, complete, parser.environmentFailure)
        .map(d => ({ ...d, kind: diagnosticKind(d.message_id, d.message), invocation: invocation.label })))
    }
    receipt.old_diagnostics[stage.stage] = stage.errors
    const normalized = normalizeStage(stage, diagnostics, evidence, complete)
    if (stage.stage === 'simulation') {
      let feedback = simulationFeedback(simulationLines)
      const path = 'build/wave.vcd'
      if (dataset && feedback.first_failure_time !== null) {
        try {
          const file = await checkedFile(root, path)
          if ((await stat(file)).size > maxBytes) throw new Error('Waveform byte limit')
          const wave = await readFile(file)
          feedback = withWaveform(new TextDecoder('utf-8', { fatal: true }).decode(wave), feedback)
          receipt.inputs.push({ path, sha256: sha256(wave), issue: null })
        } catch {
          // Optional waveform loss does not change the original process or verdict evidence.
          feedback.waveform.reason = 'WAVEFORM_UNAVAILABLE_OR_OVER_LIMIT'
          receipt.inputs.push({ path, sha256: null, issue: 'optional_waveform_unavailable_or_over_limit' })
        }
      }
      normalized.simulation_feedback = feedback
    }
    receipt.stages.push(normalized)
  }
  return { receipt, record }
}
