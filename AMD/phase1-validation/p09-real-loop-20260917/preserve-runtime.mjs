import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
const root = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const runtime = 'D:/AMD/p09-runtime';
const hash = b => createHash('sha256').update(b).digest('hex');
const manifestBytes = await readFile(join(runtime, 'manifest.json'));
const manifest = JSON.parse(manifestBytes);
const target = join(root, 'official-counter-runtime'); await mkdir(target);
for (const [path, expected] of Object.entries(manifest.files)) {
  const source = join(runtime, path), destination = join(target, path);
  if (hash(await readFile(source)) !== expected) throw new Error('Changed pinned runtime file: ' + path);
  await mkdir(dirname(destination), { recursive: true }); await copyFile(source, destination);
}
await writeFile(join(target, 'manifest.json'), manifestBytes, { flag: 'wx' });
await copyFile(join(runtime, 'deepseek-recipe/LICENSE'), join(target, 'LICENSE.deepseek-recipe'));
await writeFile(join(root, 'runtime-build.md'), `# Official Counter Runtime\n\n- Official repository revision: ${manifest.revision}\n- Compiler: ${manifest.compiler}\n- Runtime manifest SHA256: ${hash(manifestBytes)}\n- Executable SHA256: ${manifest.files[manifest.executable]}\n- Tokenizer SHA256: ${manifest.files[manifest.tokenizer]}\n- Official Rust conversion: ChatCompletionRequest.convert with ConversionOptions::default.\n- Official rendering/encoding: DeepseekV41Encoding and PromptEncoding::encode.\n- Python image dependencies: not installed or used.\n- Handwritten serving template: none.\n- Provider serving equivalence: unconfirmed.\n\nThe frozen executable, tokenizer, selected official source files, helper source and dependency locks are copied under official-counter-runtime. The upstream MIT license is retained. Build inputs use a sibling official checkout named deepseek-recipe; its pinned revision supplies the upstream workspace manifests. Local Rust/MSVC build tools reside under D:/AMD/p09-runtime. This is not a claim of a hermetic toolchain or complete OS isolation.\n\nCargo originally produced a hardlinked executable. It was not admitted by the host file guard; a standalone byte-for-byte copy was pinned before successful dispatch. The guard was not weakened. Real request recount and exact-core/one-token-over tests are in tokenizer-boundary.json and tokenizer-boundary-full-v2.json. The first full-registry boundary analysis incorrectly expected optional guidance to be unprunable; its retained work directory is tokenizer-boundary-full. The corrected test explicitly tests the non-prunable core.\n`, { flag: 'wx' });
console.log(JSON.stringify({ copied_files: Object.keys(manifest.files).length, manifest_sha256: hash(manifestBytes) }));
