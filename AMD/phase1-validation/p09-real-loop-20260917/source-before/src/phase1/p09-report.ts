/** Fixed-denominator experiment manifest and immutable report snapshots. @module rtl-tools/phase1/p09-report */
import { mkdir, readdir, readFile, realpath } from 'node:fs/promises'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { taskIds, taskSpec } from './p09-tasks.ts'
import { publish } from './candidates.ts'
import { checkedFile, sha256 } from './snapshots.ts'
import type { RepairState } from './repair-workflow.ts'
import type { ModelRecord, RunRecord } from './records.ts'
import { parseRecord } from './records.ts'
import { readDiagnostics } from './repair-diagnostics.ts'

/** Publish all 15 planned cells before any request. @param root - dedicated experiment root. @returns frozen manifest path. */
export async function freezeP09(root: string): Promise<string> {
  await mkdir(root, { recursive: true })
  const tasks = taskIds.map(id => ({ id, task_sha256: taskSpec(id).hash, task: taskSpec(id).public }))
  const schedule = taskIds.flatMap((task, index) => ['ABC', 'BCA', 'CAB'][index % 3]!.split('').map(variant => ({ task, variant, max_provider_attempts: 15 })))
  await publish(root, 'p09-frozen-tasks.json', JSON.stringify({ schema_version: '1.0', tasks, schedule, max_provider_attempts: 225, candidate_execution: 'individual-human-review', task_manifest_sha256: sha256(JSON.stringify(tasks)) }, null, 2))
  return join(root, 'p09-frozen-tasks.json')
}
/** Report every planned cell, including blocked or unstarted ones. @param outputRoot - fixed profile root. @returns new report directory; prior reports are untouched. */
export async function reportP09(outputRoot: string): Promise<string> {
  const root = await realpath(outputRoot), states: { directory: string; state: RepairState }[] = []
  for (const directory of (await readdir(root)).filter(name => /^repair-[a-f0-9-]{36}$/.test(name))) {
    const state = JSON.parse(await readFile(await checkedFile(root, directory + '/state.json'), 'utf8')) as RepairState
    if (!state.p09 || state.p09.calibration_only || state.p09.calibration_only === undefined && state.p09.initial_generation_requests === 0) continue
    const event = JSON.parse(await readFile(await checkedFile(root, directory + '/event-' + String(state.seq).padStart(5, '0') + '.json'), 'utf8'))
    if (JSON.stringify(state) !== JSON.stringify(event.state)) throw new Error('State/event mismatch')
    states.push({ directory, state })
  }
  const rows = []
  for (const task of taskIds) for (const variant of ['A', 'B', 'C']) {
    const found = states.filter(s => s.state.fixture === task && s.state.p09!.variant_id === variant)
    if (found.length > 1) throw new Error('Duplicate ablation cell; preserve and report separately, never select a preferred sample')
    const selected = found[0], state = selected?.state
    const models: ModelRecord[] = []
    for (const directory of state?.model_runs ?? []) {
      if (!directory.startsWith(join(root, selected!.directory) + '\\') && !directory.startsWith(join(root, selected!.directory) + '/')) throw new Error('Foreign model evidence')
      models.push(parseRecord('ModelResult', JSON.parse(await readFile(await checkedFile(directory, 'model.json'), 'utf8'))) as ModelRecord)
    }
    if (state?.verification_run && !state.verification_run.startsWith(join(root, selected!.directory, 'eda') + '\\') && !state.verification_run.startsWith(join(root, selected!.directory, 'eda') + '/')) throw new Error('Foreign verification evidence')
    const verify: RunRecord | null = state?.verification_run ? parseRecord('RunResult', JSON.parse(await readFile(await checkedFile(state.verification_run, 'result.json'), 'utf8'))) as RunRecord : null
    if (state?.outcome === 'VERIFIED') {
      const exported = await readFile(await checkedFile(join(root, selected!.directory), 'output/solution.sv'))
      if (!verify?.final_verified || verify.final_source_sha256 !== state.current?.source_sha256 || sha256(exported) !== state.current.source_sha256) throw new Error('Unbound PASS')
      const live = await readDiagnostics(state.verification_run!, 'live_verification')
      const saved = JSON.parse(await readFile(await checkedFile(state.verification_run!, 'diagnostics-1.4.json'), 'utf8'))
      if (JSON.stringify(live.receipt) !== JSON.stringify(saved) || live.receipt.stages.some(s => s.status !== 'PASS' || !s.complete)) throw new Error('Changed PASS evidence')
    }
    const tokens = (key: 'prompt_tokens' | 'completion_tokens') => !models.length || models.some(m => m.usage[key] === null) ? null : models.reduce((sum, model) => sum + model.usage[key]!, 0)
    rows.push({ task, variant, status: state?.outcome ?? state?.phase ?? 'NOT_RUN', experiment_id: state?.experiment_id ?? null,
      source_sha256: state?.current?.source_sha256 ?? null, verification_key: verify?.verification_key ?? null,
      budget_reserved_attempts: state?.p09?.model_requests_total ?? 0, provider_attempts: models.filter(m => m.dispatched).length, semantic_repairs: state?.attempts ?? 0,
      initial_generation: state?.p09?.initial_generation_requests ?? 0, transport_retries: state?.p09?.transport_retries ?? 0,
      context_recoveries: state?.p09?.context_recovery_requests ?? 0, format_recoveries: state?.p09?.format_recovery_requests ?? 0,
      input_tokens: tokens('prompt_tokens'), output_tokens: tokens('completion_tokens'), active_ms: state?.active_ms ?? null, human_wait_ms: state?.review_wait_ms ?? null,
      model_ms: models.length ? models.reduce((sum, model) => sum + model.timing.request_wall_ms, 0) : null,
      stages: verify?.stages ?? null, ttft_ms: null, cloud_vram: null, price: null })
  }
  const target = join(root, 'report-' + randomUUID()); await mkdir(target)
  const report = { schema_version: '1.0', planned_cells: 15, verified_cells: rows.filter(row => row.status === 'VERIFIED').length,
    comparison: 'A/B/C repair context strategies, not a no-agent baseline', statistical_significance_claimed: false, rows }
  await publish(target, 'p09-ablation.json', JSON.stringify(report, null, 2))
  const keys = ['task', 'variant', 'status', 'provider_attempts', 'semantic_repairs', 'input_tokens', 'output_tokens', 'active_ms', 'human_wait_ms'] as const
  await publish(target, 'p09-ablation.csv', keys.join(',') + '\n' + rows.map(row => keys.map(key => row[key] === null ? 'null' : JSON.stringify(row[key])).join(',')).join('\n') + '\n')
  for (const zh of [false, true]) {
    const header = zh ? '# P09 五题上下文对照\n\n' : '# P09 Five-Task Context Comparison\n\n'
    const caution = zh ? '五题各组一次，不能据此声称统计显著收益；NOT_RUN、阻塞与设计失败分别保留。完整隔离与无人审批执行未验收。\n\n' : 'One sample per task/group does not establish statistical gains. NOT_RUN, blocked and design failures remain separate. Full isolation and unattended execution are not accepted.\n\n'
    await publish(target, zh ? 'p09-ablation.zh.md' : 'p09-ablation.md', header + caution + '| Task | Group | Status | Calls | Repairs |\n| --- | --- | --- | --- | --- |\n' + rows.map(r => '| ' + [r.task, r.variant, r.status, r.provider_attempts, r.semantic_repairs].join(' | ') + ' |').join('\n') + '\n')
  }
  return target
}
