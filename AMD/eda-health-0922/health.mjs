import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { Config } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-preflight.ts';
import { publish } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/candidates.ts';
import { loadCompatAssets } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-compat.ts';
import { readDoctorConfig } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/doctor.ts';
import { VerificationRunner } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/verification.ts';
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts';

export { Config };
export const name = 'rtl-p10-full-eda-health';
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy'];
export function apply(ctx, config) {
  if (ctx.get('llm') || ctx.cmdlineArgs.get().join(' ') !== 'preflight') throw new Error('MODEL_FREE_HEALTH_REQUIRED');
  const controller = new AbortController(); let pending;
  ctx.effect(() => async () => { controller.abort(); await pending; });
  ctx.effect(() => ctx.appReady.onReady(() => {
    pending = run(ctx, config, controller.signal).then(() => ctx.get('appExit')(0)).catch(error => {
      process.stderr.write(String(error) + '\n'); ctx.get('appExit')(1);
    });
  }));
}
async function run(ctx, config, signal) {
  if (!config.allowUnisolatedPreflight || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('HEALTH_AUTHORITY_REQUIRED');
  const json = async path => JSON.parse(await readFile(path, 'utf8'));
  const root = config.campaignRoot;
  const plan = await json(join(root, 'plan.json'));
  const freeze = await json(config.freezeFile);
  async function check() {
    for (const [path, digest] of Object.entries(freeze.files)) if (sha256(await readFile(path)) !== digest) throw new Error('HEALTH_INPUT_CHANGED:' + path);
  }
  await check();
  await publish(root, 'claim.json', JSON.stringify({ at: new Date().toISOString(), pid: process.pid, model_calls: 0 }));
  const catalog = await json(join(plan.preflight, 'catalog.json'));
  const { config: eda } = await readDoctorConfig(config.settingsFile);
  const outputRoot = join(root, 'eda'); await mkdir(outputRoot);
  const runner = new VerificationRunner(ctx.subprocess, { ...eda, outputRoot }, config);
  const results = [];
  try {
    for (const taskId of plan.tasks) {
      await check();
      const task = catalog.find(task => task.task_id === taskId);
      const input = await loadCompatAssets(config.datasetRoot, task, join(plan.preflight, 'derived'), '1ps/1ps');
      const id = await runner.registerDataset(input.assets, input.evaluation, { experiment_id: randomUUID(), task_id: taskId, sample_id: results.length, mode: 'baseline' });
      const result = await runner.verify(id, signal, argv => argv);
      const row = { task_id: taskId, reference_control: true, model_candidate: false, ...result };
      await publish(root, taskId + '.json', JSON.stringify(row, null, 2));
      results.push(row);
      process.stdout.write(JSON.stringify({ task: taskId, status: result.status, run: result.artifacts, stages: result.stages.map(stage => ({ stage: stage.stage, status: stage.status, duration_ms: stage.duration_ms, errors: stage.errors })) }) + '\n');
    }
  } finally { await runner.close(); }
  await check();
  await publish(root, 'results.json', JSON.stringify(results, null, 2));
}
