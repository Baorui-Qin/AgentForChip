import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = 'D:/AMD/phase1-validation/p10-repair-v3-100-full-trace-20260922-v2';
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const optional = async path => { try { return await json(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
const tasks = (await json(join(root, 'manifest-100.json'))).task_ids;
const rows = [];
for (const task of tasks) {
  const generation = await json(join(root, `generate-${task}/result.json`));
  const comparison = await optional(join(root, `compare-${task}/result.json`));
  const started = (await readdir(root)).includes(`compare-${task}`);
  rows.push({ task_id: task, generation_status: generation.status, physical_dispatches: generation.physical_dispatches,
    comparison_started: started, comparison_terminal: !!comparison, comparison_status: comparison?.status ?? null,
    baseline_status: comparison?.initial_status ?? null, policy: comparison?.repair_decisions ?? [],
    comparison_stop_class: comparison ? 'terminal_environment_or_evidence_failure' : started ? 'interrupted_by_host_after_infrastructure_circuit_stop' : 'not_started' });
}
const report = { schema_version: 'p10-stability-interruption-1', state: 'INFRA_INTERRUPTED', generated_at: new Date().toISOString(),
  provenance: 'Derived after dispatcher termination; not a normal generation-stability runner completion report.',
  terminated_dispatcher_pid: 15376, original_exec_session: 70609, original_exit_code: 1,
  reason: 'First four completed comparisons hit synthesis timeout; a later result recorded Vivado Common 17-1257 directory C error. No model repair was dispatched.',
  process_inventory_after_stop: 'No matching campaign Node process was observed in elevated Win32_Process query.',
  authorization: 'User approved retaining all 100 generation records and candidates, repairing/calibrating EDA, then continuing in a separately identified comparison batch without regeneration or overwriting old results.',
  original_lock_retained: true, model_accuracy_available: false,
  summary: { selected: tasks.length, generation_terminal: rows.length,
    candidates: rows.filter(row => row.generation_status === 'GENERATED_UNVERIFIED').length,
    physical_dispatches: rows.reduce((sum, row) => sum + row.physical_dispatches, 0),
    comparison_terminal: rows.filter(row => row.comparison_terminal).length,
    comparison_interrupted: rows.filter(row => row.comparison_started && !row.comparison_terminal).length,
    comparison_unstarted: rows.filter(row => !row.comparison_started && row.generation_status === 'GENERATED_UNVERIFIED').length }, rows };
await writeFile(join(root, 'report/latest.json'), JSON.stringify(report, null, 2), { flag: 'wx' });
await writeFile(join(root, 'interruption.json'), JSON.stringify(report, null, 2), { flag: 'wx' });
console.log(JSON.stringify(report.summary));
