import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Config } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-preflight.ts';
import { loadP10Dataset } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-dataset.ts';
import { runCommand } from 'file:///D:/deepseek-harness/rtl-tools/src/process.ts';
import { publish } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/candidates.ts';
export { Config };
export const name = 'rtl-p10-all-catalog';
export const inject = ['cmdlineArgs', 'appReady', 'subprocess', 'sandboxPolicy'];
export function apply(ctx, config) {
  if (ctx.get('llm') || ctx.cmdlineArgs.get().join(' ') !== 'catalog') throw new Error('MODEL_FREE_CATALOG_REQUIRED');
  const controller = new AbortController(); let pending;
  ctx.effect(() => async () => { controller.abort(); await pending; });
  ctx.effect(() => ctx.get('appReady').onReady(() => {
    pending = run(ctx, config, controller.signal).then(() => ctx.get('appExit')(0)).catch(error => {
      process.stderr.write(String(error) + '\n'); ctx.get('appExit')(1);
    });
  }));
}
async function run(ctx, config, signal) {
  if (!config.allowUnisolatedPreflight || ctx.sandboxPolicy.resolve({}).mode !== 'danger-full-access') throw new Error('EXPLICIT_CATALOG_AUTHORITY_REQUIRED');
  const root = config.campaignRoot, directory = join(root, 'git-catalog'); await mkdir(directory);
  const git = await ctx.subprocess.resolveExecutable('git', undefined, signal);
  async function inspect(label, args) {
    const result = await runCommand(ctx.subprocess, { timeoutMs: 30000, graceMs: 1000, maxLogBytes: 1048576, maxLineChars: 4096, stopOnLogLimit: true },
      [git, '-C', config.datasetRoot, ...args], directory, label, signal, { accept() {} });
    if (result.exitCode !== 0 || result.aborted || result.timedOut || result.logTruncated) throw new Error('DATASET_GIT_INSPECTION_FAILED');
    return readFile(result.stdoutLog, 'utf8');
  }
  const revision = (await inspect('head', ['rev-parse', 'HEAD'])).trim();
  if ((await inspect('status', ['status', '--porcelain=v1', '--untracked-files=all'])).trim()) throw new Error('DATASET_WORKTREE_CHANGED');
  if ((await inspect('origin', ['remote', 'get-url', 'origin'])).trim() !== 'https://github.com/NVlabs/verilog-eval.git') throw new Error('DATASET_ORIGIN_CHANGED');
  const tree = await inspect('tree', ['ls-tree', '-r', '--full-tree', revision, 'dataset_spec-to-rtl']);
  const eol = await inspect('eol', ['ls-files', '--eol', '--', 'dataset_spec-to-rtl']);
  const catalog = await loadP10Dataset(config.datasetRoot, revision, tree, eol);
  await publish(root, 'catalog.json', JSON.stringify(catalog, null, 2));
  await publish(root, 'selection-order.json', JSON.stringify(catalog.map(task => task.task_id), null, 2));
  await publish(root, 'manifest-156.json', JSON.stringify({ dataset_revision: revision, selection: 'all-pinned-tasks-in-task-id-order-before-model-results', task_ids: catalog.map(task => task.task_id) }, null, 2));
  process.stdout.write(JSON.stringify({ tasks: catalog.length, interface_errors: catalog.filter(task => task.interface_error).map(task => ({ task_id: task.task_id, reason: task.interface_error })) }) + '\n');
}
