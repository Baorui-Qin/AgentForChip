import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url)).replaceAll('\\', '/');
const prior = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const repo = 'D:/deepseek-harness';
const profile = 'D:/AMD/phase1-validation/p09-20260917-development/dsh-home/profiles/rtl-p09';
const yaml = createRequire(repo + '/package.json')('js-yaml');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const put = async (path, value) => writeFile(join(root, path), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
await mkdir(join(root, 'configs'), { recursive: true });
await mkdir(join(root, 'experiments'), { recursive: true });
await mkdir(join(root, 'skills'), { recursive: true });
const oldFreeze = await read(prior + '/ablation-freeze.json');
const postfix = await read(prior + '/post-campaign-fix.json');
const changes = [];
for (const [path, expected] of Object.entries(oldFreeze.files)) {
  const actual = hash(await readFile(path));
  if (actual !== expected) {
    if (path.replaceAll('\\', '/') !== postfix.file || actual !== postfix.after_sha256 || expected !== postfix.before_sha256) throw new Error('Unexpected source drift: ' + path);
    changes.push({ path, before: expected, after: actual, reason: postfix.fix });
  }
}
await copyFile(prior + '/skills/skills.validated.json', root + '/skills/skills.validated.json');
const settings = yaml.load(await readFile(prior + '/settings.yaml', 'utf8'));
settings.outputRoot = root + '/experiments';
await writeFile(root + '/settings.yaml', yaml.dump(settings), { flag: 'wx' });
for (const variant of ['A', 'B', 'C']) for (const budget of [2048, 8192]) {
  const p09 = await read(prior + '/configs/p09-' + variant + '.json');
  p09.limits.output = budget;
  if (p09.skillsFile) p09.skillsFile = root + '/skills/skills.validated.json';
  await put(`configs/p09-${variant}-${budget}.json`, p09);
  const auto = await read(prior + '/configs/auto-ablation-' + variant + '.json');
  auto.campaignRoot = root;
  auto.sampleId = 'output-budget-' + budget + '-pair-1';
  await put(`configs/auto-${variant}-${budget}.json`, auto);
  const patch = yaml.load(await readFile(prior + '/configs/ablation-' + variant + '.patch.yml', 'utf8'));
  patch.find(p => p.id === 'policy').config.workspaceRoot = settings.outputRoot;
  Object.assign(patch.find(p => p.id === 'repair').config, {
    maxTokens: budget,
    p09ConfigFile: `${root}/configs/p09-${variant}-${budget}.json`,
    autoConfigFile: `${root}/configs/auto-${variant}-${budget}.json`,
    configFile: root + '/settings.yaml',
  });
  await writeFile(`${root}/configs/${variant}-${budget}.patch.yml`, yaml.dump(patch), { flag: 'wx' });
}
const pairs = [
  { task: 'sequence_101', variant: 'C', order: [2048, 8192] },
  { task: 'sequence_101', variant: 'B', order: [8192, 2048] },
  { task: 'signed_saturating_add', variant: 'C', order: [2048, 8192] },
  { task: 'ready_valid_slot', variant: 'A', order: [8192, 2048] },
];
const schedule = pairs.flatMap((pair, index) => pair.order.map(budget => ({ pair: index + 1, task: pair.task, variant: pair.variant, budget, sample: 'output-budget-' + budget + '-pair-1', config: `${pair.variant}-${budget}.patch.yml` })));
const files = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) files[path] = hash(await readFile(path));
  }
}
for (const path of Object.keys(oldFreeze.files)) files[path] = hash(await readFile(path));
for (const path of ['configs', 'skills']) await collect(join(root, path));
for (const path of ['settings.yaml', 'prepare.mjs', 'run.ps1', 'check-freeze.mjs']) files[root + '/' + path] = hash(await readFile(root + '/' + path));
const runtime = await read('D:/AMD/p09-runtime/manifest.json');
files['D:/AMD/p09-runtime/manifest.json'] = hash(await readFile('D:/AMD/p09-runtime/manifest.json'));
for (const [path, expected] of Object.entries(runtime.files)) {
  const full = 'D:/AMD/p09-runtime/' + path;
  if (hash(await readFile(full)) !== expected) throw new Error('Runtime identity mismatch');
  files[full] = expected;
}
const oldReport = await read(prior + '/p09-ablation.json');
await put('experiment-freeze.json', {
  schema_version: 'output-budget-comparison-1', created_at: new Date().toISOString(), root, prior, repo, profile,
  design: 'fresh paired runs on all four previously truncated task/group cells; targeted selection, not population success-rate estimation',
  schedule, tasks: oldFreeze.tasks.filter(t => pairs.some(p => p.task === t.id)),
  historical_rows: oldReport.rows.filter(r => pairs.some(p => p.task === r.task && p.variant === r.variant)),
  historical_manifest_sha256: hash(await readFile(prior + '/campaign-artifact-manifest.json')),
  source_changes_since_original: changes, same_host_for_both_arms: true, files,
  treatment: ['max_tokens', 'matching context output reserve'],
  model: { provider: 'deepseek-official', model: 'deepseek-flash', reasoningEffort: 'high', temperature_sent: 0, temperature_effective_in_thinking_mode: false },
  limits: { window: 16384, margin: 1024, output_budgets: [2048, 8192], input_budgets: [13312, 7168], model_timeout_ms: 60000,
    max_response_bytes: 65536, max_event_bytes: 1048576, max_dispatches_per_cell: 15, max_tool_steps: 15, max_accepted_repairs: 3,
    active_ms: 1200000, planned_cells: 8, maximum_new_dispatches: 120, prior_dispatches: 49, combined_maximum_dispatches: 169,
    prior_overall_cap_not_exceeded: 375 },
  provider_sources: ['https://api-docs.deepseek.com/api/create-chat-completion/', 'https://api-docs.deepseek.com/guides/thinking_mode/', 'https://api-docs.deepseek.com/quick_start/pricing/'],
  limitations: ['One sample per paired cell', 'Selected on historical truncation', 'Dynamic provider alias and stochastic generation', 'Original timeout and byte ceilings retained', 'Larger reserve reduces available input context', 'Full OS isolation not verified'],
  rerun_on_failure: false, replace_historical_results: false, full_os_isolation_verified: false,
});
console.log(JSON.stringify({ schedule, frozen_files: Object.keys(files).length, source_changes: changes.length, maximum_new_dispatches: 120 }));
