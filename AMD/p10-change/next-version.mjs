import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
const previous = 'D:/AMD/phase1-validation/p10-20260918-v7';
const next = 'D:/AMD/phase1-validation/p10-20260918-v8';
await mkdir(next);
for (const name of ['prepare.mjs', 'run.ps1', 'preflight.patch.yml']) {
  const source = await readFile(join(previous, name), 'utf8');
  await writeFile(join(next, name), source.replaceAll('p10-20260918-v7', 'p10-20260918-v8'), { flag: 'wx' });
}
await copyFile(join(previous, 'earlier-launches.json'), join(next, 'earlier-launches.json'));
await copyFile(join(previous, 'predecessor.json'), join(next, 'parser-defect-predecessor.json'));
await writeFile(join(next, 'predecessor.json'), JSON.stringify({ path: previous, status: 'INTERRUPTED_NO_CAMPAIGN_TERMINAL',
  reason: 'User interruption; full independent preflight rerun with unchanged code, no result pooling.', model_requests: 0 }, null, 2) + '\n', { flag: 'wx' });
