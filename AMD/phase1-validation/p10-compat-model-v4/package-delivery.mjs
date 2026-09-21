import { mkdir, copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(fileURLToPath(import.meta.url)), repo = 'D:/deepseek-harness';
const files = [
  'rtl-tools/src/phase1/p10-compat.ts', 'rtl-tools/src/phase1/p10-compat-preflight.ts', 'rtl-tools/src/phase1/p10-model.ts',
  'rtl-tools/src/phase1/snapshots.ts', 'rtl-tools/src/phase1/verification.ts', 'rtl-tools/src/phase1/p09-auto-policy.ts',
  'rtl-tools/tests/p10-compat.spec.ts', 'rtl-tools/tests/p10-model.spec.ts', 'rtl-tools/tests/phase1-verification.spec.ts',
  'rtl-tools/phase1/p10/README.md', 'rtl-tools/phase1/p10/README.zh.md', 'rtl-tools/phase1/p10/README.i18n.yaml',
  ...['package.json', 'cordis.yml', 'cordis.patch.yml'].map(name => 'rtl-tools/phase1/profiles/rtl-p10-model/' + name),
  ...['md', 'zh.md', 'i18n.yaml'].map(suffix => '.agents/notes/implemented/bug-fix/2026-09-18-p10-reviewed-compatibility.' + suffix),
  ...(await readdir(join(repo, 'rtl-tools/tests/fixtures/p10'))).map(name => 'rtl-tools/tests/fixtures/p10/' + name),
];
const index = [];
for (const file of files) {
  const path = join(root, 'delivery-source', file); await mkdir(dirname(path), { recursive: true }); await copyFile(join(repo, file), path);
  const bytes = await readFile(path); index.push({ path: file, sha256: createHash('sha256').update(bytes).digest('hex'), size: bytes.length });
}
await writeFile(join(root, 'delivery-source-index.json'), JSON.stringify({ actual_runtime_repository: repo, files: index, unrelated_changes_preserved: true }, null, 2), { flag: 'wx' });
console.log(JSON.stringify({ copied_files: files.length }));
