import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const freeze = JSON.parse(await readFile(root + '/experiment-freeze.json', 'utf8'));
for (const [path, expected] of Object.entries(freeze.files)) {
  const actual = createHash('sha256').update(await readFile(path)).digest('hex');
  if (actual !== expected) throw new Error('Frozen file changed: ' + path);
}
console.log('Frozen code, profile, settings, skills and official tokenizer verified.');
