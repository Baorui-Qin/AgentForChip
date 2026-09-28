import { open } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
const [root, repo] = process.argv.slice(2);
const log = await open(join(root, 'runner.log'), 'wx');
try {
  const child = spawn(process.execPath, ['--import', 'tsx/esm', 'apps/cli/src/bin.ts', '--profile', 'rtl-p10-preflight', '--patch', join(root, 'preflight.patch.yml'), 'preflight'],
    { cwd: repo, env: { ...process.env, DSH_HOME: join(root, 'dsh-home') }, windowsHide: true, stdio: ['ignore', log.fd, log.fd] });
  process.exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => resolve(code ?? 1)); });
} finally { await log.close(); }
