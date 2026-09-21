import { readFile, readdir, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(fileURLToPath(import.meta.url));
const repo = 'D:/deepseek-harness';
const predecessor = 'D:/AMD/phase1-validation/p10-20260918-v8';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const files = {}, historical = {};
async function scan(path, output, copy = false) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) await scan(child, output, copy);
    else if (entry.isFile()) {
      const bytes = await readFile(child), digest = hash(bytes); output[child] = digest;
      if (copy) await writeFile(join(root, 'frozen-source', digest), bytes);
    }
  }
}
await mkdir(join(root, 'frozen-source'), { recursive: true });
const home = join(root, 'dsh-home/profiles/rtl-p10-compat');
await mkdir(home, { recursive: true });
for (const name of ['package.json', 'cordis.yml', 'cordis.patch.yml']) await copyFile(join(repo, 'rtl-tools/phase1/profiles/rtl-p10-preflight', name), join(home, name));
await scan(join(repo, 'rtl-tools/src'), files, true);
await scan(join(repo, 'packages/subprocess/subprocess-local/src'), files, true);
await scan(join(repo, 'packages/subprocess/subprocess/src'), files, true);
await scan(home, files, true);
await scan(predecessor, historical);
for (const path of [join(repo, 'pnpm-lock.yaml'), join(repo, 'rtl-tools/phase1/configs/dev.yaml'), join(root, 'prepare.mjs'), join(root, 'preflight.patch.yml')]) files[path] = hash(await readFile(path));
await writeFile(join(root, 'freeze.json'), JSON.stringify({ schema_version: 'p10-compat-freeze-1', created_at: new Date().toISOString(), predecessor, files, historical }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ root, files: Object.keys(files).length, historical: Object.keys(historical).length }));
