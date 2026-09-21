import { readFile, readdir, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(fileURLToPath(import.meta.url)), repo = 'D:/deepseek-harness';
const preflight = 'D:/AMD/phase1-validation/p10-compat-v3';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2), { flag: 'wx' });
const runtimeRoot = 'D:/AMD/p09-runtime';
const runtimeHash = hash(await readFile(join(runtimeRoot, 'manifest.json')));
const p09 = JSON.parse(await readFile('D:/AMD/phase1-validation/p09-context-skill-20260917/configs/p09-C.json', 'utf8'));
await put('p09.json', p09);
await put('auto.json', { registry: 'full', campaignRoot: root.replaceAll('\\', '/'), bucket: 'preflight', sampleId: 'p10-shared-initial', runtimeRoot, runtimeManifestSha256: runtimeHash, maxToolSteps: 15 });
const home = join(root, 'dsh-home/profiles/rtl-p10-model');
await mkdir(home, { recursive: true }); await mkdir(join(root, 'frozen-source'));
for (const name of ['package.json', 'cordis.yml', 'cordis.patch.yml']) await copyFile(join(repo, 'rtl-tools/phase1/profiles/rtl-p10-model', name), join(home, name));
const files = {};
async function pin(file) { const bytes = await readFile(file), digest = hash(bytes); files[file] = digest; await writeFile(join(root, 'frozen-source', digest), bytes); }
async function scan(path) { for (const entry of await readdir(path, { withFileTypes: true })) { const child = join(path, entry.name); if (entry.isDirectory()) await scan(child); else if (entry.isFile()) await pin(child); } }
await scan(join(repo, 'rtl-tools/src')); await scan(join(repo, 'packages/subprocess/subprocess-local/src')); await scan(home);
await scan(join(preflight, 'derived'));
for (const name of ['catalog.json', 'selection-order.json', 'compatibility-manifest.json', 'compat-preflight-results.json', 'compat-positive-negative-results.json', 'evaluator-policy.json']) await pin(join(preflight, name));
for (const name of ['p09.json', 'auto.json', 'model.patch.yml', 'prepare.mjs', 'run.ps1']) await pin(join(root, name));
await pin(join(repo, 'rtl-tools/phase1/configs/dev.yaml')); await pin(join(repo, 'pnpm-lock.yaml')); await pin(join(runtimeRoot, 'manifest.json'));
await pin(p09.skillsFile);
const skills = JSON.parse(await readFile(p09.skillsFile, 'utf8'));
for (const skill of skills) for (const evidence of skill.validation_records) await pin(join(dirname(p09.skillsFile), evidence.path));
await put('freeze.json', { schema_version: 'p10-model-freeze-1', predecessor: preflight, files, created_at: new Date().toISOString(), protocol: {
  shared_initial: true, initial_requests: 1, per_task_requests_including_initial: 15, max_repairs: 3, max_actions: 15, model: 'deepseek-flash', temperature: 0, reasoning: 'high', max_tokens: 8192,
  baseline_feedback: false, baseline_tools: false, baseline_skills: false, retries: 0, recovery: 'fail-closed', control_not_scored: true,
  authorized_model_dispatch_cap: 150, automatic_40: false, full_os_isolation_verified: false } });
console.log(JSON.stringify({ root, frozen_files: Object.keys(files).length }));
