import { readFile, writeFile, readdir, lstat, readlink, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(process.argv[2]);
assert.match(root, /^D:\\AMD\\phase1-validation\\p10-20260918(?:-v\d+)?$/);
const manifestName = 'campaign-artifact-manifest.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
if (process.argv.includes('--snapshot')) {
  const freeze = JSON.parse(await readFile(join(root, 'freeze.json'), 'utf8'));
  await mkdir(join(root, 'frozen-source'), { recursive: true });
  for (const [path, expected] of Object.entries(freeze.files)) {
    const bytes = await readFile(path);
    assert.equal(hash(bytes), expected, path);
    await writeFile(join(root, 'frozen-source', expected), bytes);
  }
}
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
    } else {
      assert.ok(stat.isFile(), path);
      const bytes = await readFile(join(root, path));
      files.push({ path, bytes: bytes.length, sha256: hash(bytes) });
    }
  }
  return { files, links };
}
const inventory = await scan();
if (process.argv.includes('--verify')) {
  const manifest = JSON.parse(await readFile(join(root, manifestName), 'utf8'));
  assert.deepEqual(inventory, { files: manifest.files, links: manifest.links });
} else {
  assert.deepEqual(await scan(), inventory);
  await writeFile(join(root, manifestName), JSON.stringify({ schema_version: 'p10-campaign-manifest-1',
    created_at: new Date().toISOString(), excludes: [manifestName], runtime_links_followed: false,
    runtime_link_note: 'Profile node_modules links record targets only, not archived dependency contents.', ...inventory,
  }, null, 2) + '\n', { flag: 'wx' });
  assert.deepEqual(await scan(), inventory);
}
console.log(JSON.stringify({ status: 'PASS', root, files: inventory.files.length, links: inventory.links.length }));
