import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Config } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-preflight.ts';
import { publish } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/candidates.ts';
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts';
import { loadCompatAssets } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-compat.ts';
import { assertSharedEvaluator } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-compat-suite.ts';
import { calibrationPairReady } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-suite-preflight.ts';
import { classifyPreflight } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-report.ts';
import { readDoctorConfig } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/doctor.ts';
import { VerificationRunner } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/verification.ts';

export { Config };
export const name = 'rtl-p10-hundred-calibration-resume';
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy'];
export function apply(ctx, config) {
  if (ctx.get('llm') || ctx.cmdlineArgs.get().join(' ') !== 'preflight') throw new Error('MODEL_FREE_PREFLIGHT_REQUIRED');
  const controller = new AbortController(); let pending;
  ctx.effect(() => async () => { controller.abort(); await pending; });
  ctx.effect(() => ctx.get('appReady').onReady(() => {
    pending = run(ctx, config, controller.signal).then(() => ctx.get('appExit')(0)).catch(error => {
      process.stderr.write(String(error) + '\n'); ctx.get('appExit')(1);
    });
  }));
}
async function run(ctx, config, signal) {
  if (!config.allowUnisolatedPreflight || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('EXPLICIT_PREFLIGHT_AUTHORITY_REQUIRED');
  const root = config.campaignRoot;
  const json = async path => JSON.parse(await readFile(path, 'utf8'));
  const freezeBytes = await readFile(config.freezeFile), freeze = JSON.parse(freezeBytes);
  async function check() {
    if (sha256(await readFile(config.freezeFile)) !== sha256(freezeBytes)) throw new Error('FREEZE_CHANGED');
    for (const [path, hash] of Object.entries(freeze.files)) if (sha256(await readFile(path)) !== hash) throw new Error('FROZEN_INPUT_CHANGED: ' + path);
  }
  await check();
  await publish(root, 'preflight-resume.claim', JSON.stringify({ at: new Date().toISOString(), pid: process.pid }));
  const catalog = await json(join(root, 'catalog.json')), order = await json(join(root, 'selection-order.json'));
  const controls = await json(join(root, 'negative-controls.json'));
  const { config: eda } = await readDoctorConfig(config.settingsFile);
  const outputRoot = join(root, 'preflight-eda-resume'); await mkdir(outputRoot);
  const runner = new VerificationRunner(ctx.subprocess, { ...eda, outputRoot }, config);
  const experiment = randomUUID(), rows = [];
  async function verify(task, kind) {
    await check();
    const baseline = await loadCompatAssets(config.datasetRoot, task, join(root, 'derived'), '1ps/1ps');
    const agent = await loadCompatAssets(config.datasetRoot, task, join(root, 'derived'), '1ps/1ps');
    assertSharedEvaluator(baseline, agent);
    if (kind === 'negative') baseline.assets['rtl/solution.sv'] = controls[task.task_id];
    const id = await runner.registerDataset(baseline.assets, baseline.evaluation, { experiment_id: experiment, task_id: task.task_id, sample_id: rows.length, mode: kind === 'positive' ? 'baseline' : 'agent' });
    const result = await runner.preflightDataset(id, signal, argv => argv);
    const row = { task_id: task.task_id, kind, status: kind === 'positive' ? classifyPreflight(result).status : result.status,
      run: result.artifacts, stages: result.stages, evaluator: baseline.evaluation.compatibility };
    await publish(root, `${task.task_id}-${kind}.json`, JSON.stringify(row, null, 2));
    process.stdout.write(JSON.stringify({ task_id: task.task_id, kind, status: row.status, evidence: row.stages[2].evidence }) + '\n');
    return row;
  }
  try {
    for (const id of order) {
      const task = catalog.find(t => t.task_id === id);
      let positive = null, negative = null, status = 'INCONCLUSIVE', reason = task.interface_error;
      if (task.interface && !task.interface_error && task.clock) {
        const metadata = await json(join(root, 'derived', id, 'transform.json'));
        if (metadata.review_status === 'NEEDS_MANUAL_COMPAT_REVIEW') {
          status = 'NEEDS_MANUAL_COMPAT_REVIEW'; reason = 'NEEDS_MANUAL_COMPAT_REVIEW';
        } else {
          const retained = async kind => { try { return await json(join(root, `${id}-${kind}.json`)); } catch (error) { if (error.code === 'ENOENT') return null; throw error; } };
          positive = await retained('positive'); negative = await retained('negative');
          if (!!positive !== !!negative) throw new Error('INCOMPLETE_PRIOR_CALIBRATION_PAIR');
          if (!positive) { positive = await verify(task, 'positive'); negative = await verify(task, 'negative'); }
          else process.stdout.write(JSON.stringify({ task_id: id, reused_complete_pair: true }) + '\n');
          status = calibrationPairReady(positive, negative) ? 'EVALUATOR_READY' : positive.status === 'EVALUATOR_READY' ? 'INCONCLUSIVE' : positive.status;
          reason = status === 'EVALUATOR_READY' ? null : 'EVALUATOR_CALIBRATION_NOT_READY';
        }
      }
      rows.push({ task_id: id, compat_status: status, evaluable: status === 'EVALUATOR_READY', reason,
        category: task.interface_error ? 'HOST_INTERFACE_UNSUPPORTED' : status, positive, negative, model_failure: false });
    }
  } finally { await runner.close(); }
  await check();
  await publish(root, 'compat-positive-negative-results.json', JSON.stringify(rows, null, 2));
  process.stdout.write(JSON.stringify({ finished: root, selected: rows.length, ready: rows.filter(r => r.evaluable).length }) + '\n');
}
