/** Reports execution evidence separately from model repair success. @module rtl-tools/phase1/repair-report */
import { readFile } from 'node:fs/promises'
import { parseRecord, type ModelRecord, type RunRecord } from './records.ts'
import { checkedFile } from './snapshots.ts'
import { publish } from './candidates.ts'
import type { RepairState } from './repair-workflow.ts'
import { taskIds, type TaskId } from './p09-tasks.ts'

/** Publish one terminal report without modifying existing run evidence. @param root - private experiment. @param state - terminal state. */
export async function repairReport(root: string, state: RepairState): Promise<void> {
  const models: ModelRecord[] = []
  for (const path of state.model_runs) models.push(parseRecord('ModelResult', JSON.parse(await readFile(await checkedFile(path, 'model.json'), 'utf8'))) as ModelRecord)
  const runs: RunRecord[] = []
  for (const path of state.verification_runs) runs.push(parseRecord('RunResult', JSON.parse(await readFile(await checkedFile(path, 'result.json'), 'utf8'))) as RunRecord)
  const calibration = state.calibration_run ? parseRecord('RunResult', JSON.parse(await readFile(await checkedFile(state.calibration_run, 'result.json'), 'utf8'))) as RunRecord : null
  const negative = state.p09?.negative_calibration_run ? parseRecord('RunResult', JSON.parse(await readFile(await checkedFile(state.p09.negative_calibration_run, 'result.json'), 'utf8'))) as RunRecord : null
  const duration = (run: RunRecord) => Object.values(run.stages).reduce((sum, stage) => sum + (stage?.duration_ms ?? 0), 0)
  const tokens = (key: 'prompt_tokens' | 'completion_tokens') => models.some(model => model.usage[key] === null) ? null : models.reduce((sum, model) => sum + model.usage[key]!, 0)
  const retries = state.p09?.transport_retries ?? state.loop?.rounds.flatMap(round => round.transport).filter(attempt => attempt.transport_attempt > 1 && models[state.model_runs.indexOf(attempt.directory)]?.dispatched).length ?? 0
  const natural = taskIds.includes(state.fixture as TaskId)
  const report = { schema_version: state.schema_version, experiment_id: state.experiment_id, fixture: state.fixture, experiment_kind: natural ? 'natural_generation_semi_automatic' : 'injected_defect_semi_automatic',
    outcome: state.outcome, design_repaired: state.outcome === 'VERIFIED', full_os_isolation_verified: false, automatic_unattended_repair_verified: false,
    proposal_attempts: state.attempts, recorded_model_calls: models.length, dispatched_calls: models.filter(model => model.dispatched).length, automatic_retries: retries,
    ...(state.loop ? { loop: state.loop } : {}),
    ...(state.p09 ? { p09: state.p09 } : {}),
    tokens: { input: tokens('prompt_tokens'), output: tokens('completion_tokens') }, price: null, ttft_ms: null,
    time_ms: { model: models.reduce((sum, model) => sum + model.timing.request_wall_ms, 0), candidate_eda: runs.reduce((sum, run) => sum + duration(run), 0), calibration_eda: calibration ? duration(calibration) + (negative ? duration(negative) : 0) : null, active: state.active_ms, human_wait: state.review_wait_ms },
    final_candidate: state.current, verification_runs: runs.map((run, index) => ({ path: state.verification_runs[index], source_sha256: run.final_source_sha256, verification_key: run.verification_key,
      status: run.final_status, stages: run.stages })), calibration_run: state.calibration_run, model_runs: state.model_runs, decisions: state.decisions,
    prob038: 'SEPARATE_UNRESOLVED_COMPATIBILITY', naturally_generated_defects_evaluated: natural && state.verification_runs.length > 0 }
  await publish(root, 'repair-report.json', JSON.stringify(report, null, 2))
  const rows = runs.map((run, i) => `| ${i} | ${run.final_source_sha256} | ${Object.values(run.stages).map(stage => stage?.status ?? 'null').join(' | ')} |`).join('\n')
  const diagnosticFacts = runs.map((run, revision) => ({ revision, stop_reason: run.stop_reason, stages: Object.values(run.stages).map(stage => stage && ({ stage: stage.stage, status: stage.status, evidence: stage.evidence, errors: stage.errors })) }))
  for (const zh of [false, true]) {
    const text = `# ${zh ? 'RTL 半自动修复实验' : 'RTL Semi-Automatic Repair'}\n\n${state.fixture}: ${state.outcome}\n\n` +
      (zh ? '流程终态与设计修复成功分别记录。固定负例未改写；每份模型候选需人工安全审批。没有完整 OS 隔离证明，不签收无人干预修复或 Prob038 兼容性。\n\n' : 'A recorded terminal state is not proof of a successful repair. Fixed negative fixtures remain unchanged. Each model candidate requires human safety review. This does not establish full OS isolation, unattended repair, or Prob038 compatibility.\n\n') +
      `| Revision | Source SHA256 | Compile | Elaborate | Simulation | Synthesis |\n| --- | --- | --- | --- | --- | --- |\n${rows}\n\n` +
      `Semantic proposals: ${state.attempts}; recorded calls: ${models.length}; transport retries: ${retries}; tokens: ${tokens('prompt_tokens')}/${tokens('completion_tokens')}; human wait: ${state.review_wait_ms} ms. TTFT and price: null.\n\n` +
      (zh ? '## 失败事实与宿主决策\n\n' : '## Failure Facts and Host Decisions\n\n') +
      '```json\n' + JSON.stringify({ decisions: state.decisions, observed: diagnosticFacts }, null, 2) + '\n```\n\n' +
      (zh ? '资源、综合后时序、失配计数、诊断和版本绑定见 ' : 'Resources, post-synthesis timing, mismatch counts, diagnostics and version bindings: ') + '[repair-report.json](repair-report.json).\n'
    await publish(root, zh ? 'repair-report.zh.md' : 'repair-report.md', text)
  }
}
