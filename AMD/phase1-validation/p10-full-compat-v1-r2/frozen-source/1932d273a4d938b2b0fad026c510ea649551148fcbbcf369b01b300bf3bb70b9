/** Evidence-separated summaries for the frozen-defect campaign. @module rtl-tools/phase1/p09-auto-report */
import { mkdir, readdir, readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { checkedFile, sha256 } from './snapshots.ts'
import { publish } from './candidates.ts'
import { taskIds } from './p09-tasks.ts'
import type { RepairState, RepairSettings } from './repair-workflow.ts'
import type { ActionResponse } from './p09-action-call.ts'
import { readDiagnostics } from './repair-diagnostics.ts'
import { artifactFiles } from './artifact-manifest.ts'

interface AutomaticRow {
  task: string; variant: string; bucket: string; sample: string; experiment_id: string; directory: string; status: string
  evidence_kind: string; model_origin: string; bound_pass: boolean; semantic_repairs: number; verifications: number; tool_calls: number
  provider_attempts: number; preparation_attempts: number; transport_retries: number; input_tokens: number | null; completion_tokens: number | null
  active_ms: number; model_ms: number; full_os_isolation_verified: boolean; validation_skill: string | null
}

/** Audit completed model/EDA artifacts and report every planned cell. @param outputRoot - experiment root. @param campaignRoot - report destination. @returns new report directory. */
export async function reportAutomatic(outputRoot: string, campaignRoot: string): Promise<string> {
  const root = await realpath(outputRoot)
  const rows: AutomaticRow[] = [], manifests = []
  for (const name of (await readdir(root)).filter(name => /^repair-[a-f0-9-]{36}$/.test(name))) {
    const directory = join(root, name)
    const state = JSON.parse(await readFile(await checkedFile(directory, 'state.json'), 'utf8')) as RepairState
    if (!state.auto) continue
    const settings = JSON.parse(await readFile(await checkedFile(directory, 'configuration.json'), 'utf8')) as RepairSettings
    const event = JSON.parse(await readFile(await checkedFile(directory, 'event-' + String(state.seq).padStart(5, '0') + '.json'), 'utf8'))
    if (JSON.stringify(event.state) !== JSON.stringify(state)) throw new Error('Changed state evidence')
    const models: ActionResponse[] = []
    for (const path of state.model_runs) {
      if (!path.startsWith(directory + '\\') && !path.startsWith(directory + '/')) throw new Error('Foreign model record')
      models.push(JSON.parse(await readFile(await checkedFile(path, 'model.json'), 'utf8')) as ActionResponse)
    }
    let boundPass = false
    if (state.outcome === 'VERIFIED') {
      if (!state.verification_run || state.auto.pending_verification) throw new Error('Unverified PASS')
      const { record, receipt } = await readDiagnostics(state.verification_run, 'live_verification')
      const exported = await readFile(await checkedFile(directory, 'output/solution.sv'))
      if (!record.final_verified || record.final_source_sha256 !== state.current?.source_sha256 || sha256(exported) !== state.current.source_sha256 ||
        receipt.stages.some(s => s.status !== 'PASS' || !s.complete || !s.process_clean)) throw new Error('Unbound PASS')
      boundPass = true
    }
    for (const path of [...state.model_runs, ...state.verification_runs, ...(state.calibration_run ? [state.calibration_run] : [])]) {
      const manifest = JSON.parse(await readFile(await checkedFile(path, 'artifacts.json'), 'utf8')) as { files: { path: string; bytes: number; sha256?: string }[] }
      const errors = []
      const actual = await artifactFiles(path)
      if (JSON.stringify(actual.map(f => f.path).sort()) !== JSON.stringify(manifest.files.map(f => f.path).sort())) errors.push('MANIFEST_FILE_SET_MISMATCH')
      for (const file of manifest.files) {
        const bytes = await readFile(await checkedFile(path, file.path))
        if (bytes.length !== file.bytes || file.sha256 !== sha256(bytes)) errors.push(file.path)
      }
      manifests.push({ run: path, files: manifest.files.length, status: errors.length ? 'FAIL' : 'PASS', errors })
    }
    const sum = (field: 'prompt_tokens' | 'completion_tokens') => !models.length || models.some(m => m[field] === null) ? null : models.reduce((total, m) => total + m[field]!, 0)
    rows.push({ task: state.fixture, variant: state.p09!.variant_id, bucket: settings.auto!.bucket, sample: settings.auto!.sampleId,
      experiment_id: state.experiment_id, directory, status: state.outcome ?? state.phase, evidence_kind: 'controlled_repair_fixture',
      model_origin: models.some(m => m.dispatched) ? 'real_model_repair' : 'not_dispatched', bound_pass: boundPass,
      semantic_repairs: state.attempts, verifications: state.auto.verifications, tool_calls: state.auto.tool_steps,
      provider_attempts: models.filter(m => m.dispatched).length, preparation_attempts: models.length, transport_retries: state.p09!.transport_retries,
      input_tokens: sum('prompt_tokens'), completion_tokens: sum('completion_tokens'), active_ms: state.active_ms,
      model_ms: models.reduce((sum, m) => sum + m.request_wall_ms, 0), full_os_isolation_verified: false,
      validation_skill: settings.auto!.validationSkillId ?? null })
  }
  const cells = taskIds.flatMap(task => ['A', 'B', 'C'].map(variant => {
    const found = rows.filter(r => r.bucket === 'ablation' && r.task === task && r.variant === variant)
    if (found.length > 1) throw new Error('Duplicate ablation cell; no preferred sample selection')
    return found[0] ?? { task, variant, status: 'NOT_RUN', provider_attempts: 0, semantic_repairs: 0, input_tokens: null, completion_tokens: null, active_ms: null }
  }))
  const target = join(campaignRoot, 'report-' + randomUUID()); await mkdir(target)
  const ablation = { schema_version: '1.7', planned_cells: 15, starting_point: 'same_frozen_negative_dut_per_task', natural_generation_scores: false,
    statistically_significant: false, rows: cells }
  await publish(target, 'p09-ablation.json', JSON.stringify(ablation, null, 2))
  const keys = ['task', 'variant', 'status', 'provider_attempts', 'semantic_repairs', 'input_tokens', 'completion_tokens', 'active_ms'] as const
  await publish(target, 'p09-ablation.csv', keys.join(',') + '\n' + cells.map(row => keys.map(key => JSON.stringify(row[key])).join(',')).join('\n') + '\n')
  await publish(target, 'artifact-manifest-audit.json', JSON.stringify(manifests, null, 2))
  await publish(target, 'p09-real-loop-acceptance.json', JSON.stringify({ schema_version: '1.7', experiments: rows,
    real_api_attempts: rows.reduce((sum, r) => sum + r.provider_attempts, 0), verified_repairs: rows.filter(r => r.bound_pass).length,
    real_multi_round_observed: rows.some(r => r.bound_pass && r.semantic_repairs >= 2 && r.verifications >= 2),
    manifest_audit_passed: manifests.every(m => m.status === 'PASS'), prob038: 'BLOCKED_TESTBENCH_COMPATIBILITY', full_os_isolation_verified: false }, null, 2))
  return target
}
