import { readFile, writeFile, readdir, lstat, readlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = dirname(fileURLToPath(import.meta.url));
const manifestName = 'campaign-artifact-manifest.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function scan(relative = '') {
  const files = [], links = [];
  for (const name of (await readdir(join(root, relative))).sort()) {
    const path = relative ? relative + '/' + name : name;
    if (path === manifestName) continue;
    const stat = await lstat(join(root, path));
    if (stat.isSymbolicLink()) {
      assert.ok(path.startsWith('dsh-home/profiles/node_modules/'), path);
      const target = await readlink(join(root, path));
      links.push({ path, target, target_text_sha256: hash(target) });
    } else if (stat.isDirectory()) {
      const child = await scan(path);
      files.push(...child.files); links.push(...child.links);
    }
    else {
      assert.ok(stat.isFile(), path);
      const bytes = await readFile(join(root, path));
      files.push({ path, bytes: bytes.length, sha256: hash(bytes) });
    }
  }
  return { files, links };
}
const inventory = await scan();
assert.deepEqual(await scan(), inventory);
await writeFile(join(root, manifestName), JSON.stringify({
  schema_version: 'p09-campaign-manifest-2',
  created_at: new Date().toISOString(),
  excludes: [manifestName],
  runtime_links_followed: false,
  runtime_link_note: 'Only dsh profile node_modules links are allowed. Link targets are recorded, not traversed or claimed to be archived dependency contents.',
  ...inventory,
}, null, 2) + '\n', { flag: 'wx' });
assert.deepEqual(await scan(), inventory);
console.log(JSON.stringify({ status: 'PASS', files: inventory.files.length, runtime_links: inventory.links.length,
  bytes: inventory.files.reduce((n, f) => n + f.bytes, 0), manifest: join(root, manifestName) }));
