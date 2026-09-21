import { mkdir, readFile, readdir, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url));
const repo = 'D:/deepseek-harness';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const home = join(root, 'dsh-home/profiles/rtl-p10-preflight');
await mkdir(home, { recursive: true });
for (const name of ['package.json', 'cordis.yml', 'cordis.patch.yml']) await copyFile(join(repo, 'rtl-tools/phase1/profiles/rtl-p10-preflight', name), join(home, name));
const files = {};
async function freezeTree(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) await freezeTree(child);
    else if (entry.isFile()) files[child] = hash(await readFile(child));
    else throw new Error('Unexpected source link: ' + child);
  }
}
await freezeTree(join(repo, 'rtl-tools/src'));
await freezeTree(join(repo, 'packages/subprocess/subprocess-local/src'));
await freezeTree(join(repo, 'packages/subprocess/subprocess/src'));
await freezeTree(home);
for (const path of [join(repo, 'pnpm-lock.yaml'), join(repo, 'rtl-tools/phase1/configs/dev.yaml'), join(root, 'prepare.mjs'), join(root, 'run.ps1'), join(root, 'preflight.patch.yml')]) files[path] = hash(await readFile(path));
const prior = [];
for (const name of ['p09-real-loop-20260917', 'p09-output-budget-20260917-v2', 'p09-context-skill-20260917']) {
  const path = join(dirname(root), name, 'campaign-artifact-manifest.json');
  prior.push({ path, sha256: hash(await readFile(path)) });
}
await put('freeze.json', { schema_version: 'p10-freeze-1', created_at: new Date().toISOString(), node: process.version,
  dataset_revision: 'c498220d0a52248f8e3fdffe279075215bde2da6', files, preserved_archives: prior,
  execution_phase: 'evaluator_preflight_only', model_services_loaded: false, authorized_model_dispatches_in_this_phase: 0,
  p10_authorized_budget: { pilot10: 150, independent40: 600, total: 750, consumed: 0 },
  planned_model_protocol: { status: 'NOT_RUN_NOT_RESOLVED', model: 'deepseek-flash', temperature: 0, reasoning: 'high', context: 131072, output: 8192, margin: 1024,
    per_task_dispatches: 15, tool_actions: 15, semantic_repairs: 3, active_ms: 1200000, baseline_dispatches: 1,
    shared_initial_candidate: true, independent40_reruns_first10: true, format_recovery: 'one_complete_malformed_response_only',
    model_revision: 'unobservable', quantization: 'unobservable', inference_backend: 'provider_managed', seed: 'unsupported_not_sent' },
  real_eda: { version: '2025.2', part: 'xczu3eg-sbva484-1-e', full_os_isolation_verified: false, candidate_synthesis: 'NOT_RUN' },
});
console.log(JSON.stringify({ root, frozen_files: Object.keys(files).length, model_dispatches: 0 }));
