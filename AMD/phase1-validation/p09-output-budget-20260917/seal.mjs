import { readFile, writeFile, readdir, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const report = JSON.parse(await readFile(join(root, 'output-budget-comparison.json'), 'utf8'));
assert.equal(report.rows.length, 8);
const files = [];
async function visit(relative = '') {
  for (const name of (await readdir(join(root, relative))).sort()) {
    const path = relative ? relative + '/' + name : name;
    if (path === 'campaign-artifact-manifest.json') continue;
    const info = await lstat(join(root, path));
    assert.ok(!info.isSymbolicLink(), path);
    if (info.isDirectory()) await visit(path);
    else if (info.isFile()) { const bytes = await readFile(join(root, path)); files.push({ path, bytes: bytes.length, sha256: hash(bytes) }); }
  }
}
await visit();
for (const entry of files) { const bytes = await readFile(join(root, entry.path)); assert.equal(bytes.length, entry.bytes); assert.equal(hash(bytes), entry.sha256); }
await writeFile(join(root, 'campaign-artifact-manifest.json'), JSON.stringify({ schema_version: report.schema_version, excluded: ['campaign-artifact-manifest.json'], second_read_verified: true, files }, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ files: files.length, bytes: files.reduce((s, f) => s + f.bytes, 0), second_read_verified: true }));
