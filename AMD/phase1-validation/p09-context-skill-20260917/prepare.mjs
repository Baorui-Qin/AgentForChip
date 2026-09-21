import { readFile, writeFile, mkdir, readdir, cp, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = dirname(fileURLToPath(import.meta.url)).replaceAll('\\', '/');
const repo = 'D:/deepseek-harness';
const prior = 'D:/AMD/phase1-validation/p09-real-loop-20260917';
const last = 'D:/AMD/phase1-validation/p09-output-budget-20260917-v2';
const yaml = createRequire(repo + '/package.json')('js-yaml');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const read = async path => JSON.parse(await readFile(path, 'utf8'));
const put = async (name, value) => writeFile(root + '/' + name, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
for (const name of ['configs', 'experiments', 'skills', 'dsh-home/profiles/rtl-p09', 'inputs']) await mkdir(root + '/' + name, { recursive: true });
for (const name of await readdir(prior + '/skills')) await cp(prior + '/skills/' + name, root + '/skills/' + name, { recursive: true, errorOnExist: true, force: false });
const oldProfile = 'D:/AMD/phase1-validation/p09-20260917-development/dsh-home/profiles/rtl-p09';
for (const name of ['cordis.yml', 'package.json']) await copyFile(oldProfile + '/' + name, root + '/dsh-home/profiles/rtl-p09/' + name);
await copyFile(repo + '/rtl-tools/phase1/profiles/rtl-p09/cordis.patch.yml', root + '/dsh-home/profiles/rtl-p09/cordis.patch.yml');
const settings = yaml.load(await readFile(last + '/settings.yaml', 'utf8')); settings.outputRoot = root + '/experiments';
await writeFile(root + '/settings.yaml', yaml.dump(settings), { flag: 'wx' });
const p09 = await read(last + '/configs/p09-C-8192.json');
p09.limits.window = 131072; p09.skillsFile = root + '/skills/skills.validated.json';
await put('configs/p09-C.json', p09);
const auto = await read(last + '/configs/auto-C-8192.json');
auto.campaignRoot = root; auto.bucket = 'preflight'; auto.sampleId = 'context128k-calibration-1';
await put('configs/auto.json', auto);
const patch = yaml.load(await readFile(last + '/configs/C-8192.patch.yml', 'utf8'));
patch.find(p => p.id === 'policy').config.workspaceRoot = settings.outputRoot;
Object.assign(patch.find(p => p.id === 'repair').config, { p09ConfigFile: root + '/configs/p09-C.json', autoConfigFile: root + '/configs/auto.json', configFile: root + '/settings.yaml' });
await writeFile(root + '/configs/repair.patch.yml', yaml.dump(patch), { flag: 'wx' });
const probes = [
  { skill: 'rtl.syntax_structure', experiment: '29cee014-7d0f-4425-ac6a-589843df6798' },
  { skill: 'rtl.sequential_specification', experiment: 'af05ca66-b9c8-45a9-bb1e-a48ec2676b96' },
  { skill: 'rtl.conditional_dependencies', experiment: '0ab3e93e-041c-4a94-a8a1-5514371d6b05' },
];
for (const probe of probes) {
  const state = await read(prior + '/experiments/repair-' + probe.experiment + '/state.json');
  probe.model_run = state.model_runs[0];
  const input = await read(probe.model_run + '/context.json');
  delete input.skill_validation;
  input.variant_id = 'C'; input.sample_id = 'retrieval-diagnostic-' + probe.skill; input.ledger = [];
  await put('inputs/' + probe.skill + '.json', input);
}
await put('probes.json', probes);
const probePatch = patch.filter(p => p.id === 'llm-deepseek');
probePatch.push({ id: 'repair', disabled: true });
probePatch.push({ insert: [{ id: 'diagnostic', name: root + '/probe.mts', config: { root } }] });
await writeFile(root + '/configs/probe.patch.yml', yaml.dump(probePatch), { flag: 'wx' });
const files = {};
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) await collect(path); else if (entry.isFile()) files[path] = hash(await readFile(path));
  }
}
for (const relative of ['rtl-tools/src', 'packages/llm/llm/src', 'packages/llm/llm-deepseek/src']) await collect(repo + '/' + relative);
for (const relative of ['configs', 'skills', 'inputs', 'dsh-home']) await collect(root + '/' + relative);
for (const relative of ['settings.yaml', 'probes.json', 'prepare.mjs', 'probe.mts', 'counter.mts', 'run.ps1']) files[root + '/' + relative] = hash(await readFile(root + '/' + relative));
files['D:/AMD/p09-runtime/manifest.json'] = hash(await readFile('D:/AMD/p09-runtime/manifest.json'));
await put('freeze.json', { created_at: new Date().toISOString(), files, window: 131072, output: 8192, margin: 1024, input_budget: 121856,
  main_task: 'rising_edge', group: 'C', main_model_dispatch_cap: 15, native_retrieval_probe_dispatch_cap: 6, new_dispatch_cap: 21,
  previous_dispatches: 66, prior_total_cap: 375, counter_api_dispatches: 0,
  probes_use_archived_real_eda_inputs: true, probe_forced_by_explicit_diagnostic_request: true,
  full_os_isolation_verified: false, task_hashes: (await read(prior + '/ablation-freeze.json')).tasks,
  preserved_archives: [prior, last].map(path => ({ path })),
});
console.log('Frozen 128K C-group calibration smoke and three explicit native retrieval probes; max 21 new dispatches.');
