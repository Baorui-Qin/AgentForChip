import { open, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
const [root, repo] = process.argv.slice(2);
const workers = [];
let failure;
try {
  for (const i of [1, 2]) {
    const group = join(root, `g${i}`);
    const log = await open(join(root, `g${i}.log`), 'wx');
    const child = spawn(process.execPath, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', '--profile', 'rtl-p10-preflight', '--patch', join(group, 'preflight.patch.yml'), 'preflight'],
      { cwd: repo, env: { ...process.env, DSH_HOME: join(group, 'dsh-home') }, windowsHide: true, stdio: ['ignore', log.fd, log.fd] });
    const done = new Promise(resolve => { child.once('error', error => resolve({ error: error.message })); child.once('exit', (code, signal) => resolve({ code, signal })); });
    workers.push({ i, child, log, done });
  }
} catch (error) { failure = error; }
const exits = [];
for (const worker of workers) {
  const exit = await worker.done; await worker.log.close(); exits.push({ group: worker.i, ...exit });
  process.stdout.write(JSON.stringify(exits.at(-1)) + '\n');
}
await writeFile(join(root, 'worker-exits.json'), JSON.stringify(exits, null, 2), { flag: 'wx' });
if (failure) throw failure;
if (exits.length !== 2 || exits.some(exit => exit.code !== 0 || exit.signal || exit.error)) throw new Error('CALIBRATION_WORKER_FAILED');
const rows = [];
for (const i of [1, 2]) rows.push(...JSON.parse(await readFile(join(root, `g${i}`, 'compat-positive-negative-results.json'), 'utf8')));
await writeFile(join(root, 'compat-positive-negative-results.json'), JSON.stringify(rows, null, 2), { flag: 'wx' });
process.stdout.write(JSON.stringify({ state: 'CALIBRATION_FINISHED', selected: rows.length, ready: rows.filter(row => row.evaluable).length, excluded: rows.filter(row => !row.evaluable).map(row => ({ task_id: row.task_id, reason: row.reason, category: row.category })) }) + '\n');
