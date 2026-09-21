import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url)), parent = dirname(root);
const archives = [];
for (const suffix of ['', '-v2', '-v3', '-v4', '-v5', '-v6', '-v7', '-v8']) {
  const directory = join(parent, 'p10-20260918' + suffix);
  const stdout = execFileSync(process.execPath, [join(root, 'seal.mjs'), directory, '--verify'], { encoding: 'utf8', windowsHide: true });
  const result = JSON.parse(stdout); assert.equal(result.status, 'PASS');
  const bytes = await readFile(join(directory, 'campaign-artifact-manifest.json'));
  archives.push({ ...result, manifest_sha256: createHash('sha256').update(bytes).digest('hex') });
}
const receipt = { status: 'PASS', verified_at: new Date().toISOString(), scope: 'post-seal file-set/size/SHA256 and runtime-link target verification',
  archives, current_decision: 'NO_GO', provider_dispatches: 0, model_comparison: 'NOT_RUN' };
await writeFile(join(parent, 'p10-20260918-v8.receipt.json'), JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(receipt));
