import assert from 'node:assert/strict';
import { readFile, writeFile, copyFile, readdir, lstat, readlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { join, relative } from 'node:path';
const repo = 'D:/deepseek-harness', calibration = 'D:/AMD/p156-20260927-settled-cal';
const previous = 'D:/AMD/p156-0923-v1', root = 'D:/AMD/p156-20260927-v2';
const yaml = createRequire(repo + '/package.json')('js-yaml');
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');
const run = (command, args) => execFileSync(command, args, { cwd: repo, encoding: 'utf8', windowsHide: true, stdio: 'pipe' });
assert.equal(run('git', ['status', '--porcelain']).trim(), '', 'Commit the reviewed version before freezing');
const result = await json(join(calibration, 'results.json'));
assert.equal(result.protocol, 'p10-settled-rtl-1');
assert.equal(result.model_calls, 0); assert.equal(result.freeze_verified, true); assert.equal(result.interrupted, false);
assert.equal(result.rows.length, 156); assert.equal(new Set(result.rows.map(row => row.task_id)).size, 156);
const calFreeze = await json(join(calibration, 'freeze.json'));
for (const [path, sha] of Object.entries(calFreeze.files)) assert.equal(hash(await readFile(path)), sha, path);
for (const row of result.rows) {
  assert.equal(row.evaluable, true, row.task_id);
  assert.equal(row.positive.status, 'EVALUATOR_READY'); assert.equal(row.positive.mismatches, 0);
  assert.equal(row.negative.status, 'FAIL'); assert.ok(row.negative.mismatches > 0);
  assert.ok(row.positive.complete && row.negative.complete && row.positive.checks > 0);
  assert.equal(row.positive.checks, row.negative.checks);
  for (const control of [row.positive, row.negative]) assert.equal(hash(await readFile(join(control.run, 'result.json'))), control.result_sha256);
}
assert.equal(result.attacks.length, 3);
assert.equal(result.attacks.find(a => a.label === 'rt02_correct_baseline').status, 'EVALUATOR_READY');
assert.equal(result.attacks.find(a => a.label === 'rt02_wrong_historical_pass').status, 'FAIL');
assert.equal(result.attacks.find(a => a.label === 'unobserved_output').complete, false);
for (const name of ['p09.json', 'auto.json']) await copyFile(join(previous, name), join(calibration, name), 1);
const files = [], links = [];
async function inventory(directory) {
  for (const name of (await readdir(directory)).sort()) {
    const path = join(directory, name), rel = relative(calibration, path).replaceAll('\\', '/');
    if (rel === 'calibration-evidence.json') continue;
    const info = await lstat(path);
    if (info.isSymbolicLink()) { links.push({ path: rel, target: await readlink(path) }); continue; }
    if (info.isDirectory()) { await inventory(path); continue; }
    if (info.isFile()) { const bytes = await readFile(path); files.push({ path: rel, bytes: bytes.length, sha256: hash(bytes) }); }
  }
}
await inventory(calibration);
await put(join(calibration, 'calibration-evidence.json'), { protocol: result.protocol, controls: 312, attacks: 3, model_calls: 0, files, links });
process.stdout.write(run('pwsh', ['-NoProfile', '-File', join(repo, 'rtl-tools/phase1/p10/prepare-stability.ps1'), '-AllTasks', '-CampaignRoot', root,
  '-PreflightRoot', calibration, '-FullManifestSha256', hash(await readFile(join(calibration, 'manifest-156.json'))), '-MaxDispatches', '20124', '-SettingsFile', join(previous, 'eda-settings.yaml')]));
for (const name of ['archive-inputs.ps1', 'run-power.ps1']) await copyFile(join(previous, name), join(root, name), 1);
await copyFile('D:/AMD/p156-20260927-analyze.mjs', join(root, 'analyze.mjs'), 1);
await copyFile('D:/AMD/p156-20260927-final-integrity.mjs', join(root, 'final-integrity.mjs'), 1);
await copyFile('D:/AMD/prepare-p156-20260927.mjs', join(root, 'prepare-campaign.mjs'), 1);
await copyFile(join(previous, 'report/spec-consistency-audit.json'), join(root, 'known-spec-conflicts.json'), 1);
const patchPath = join(root, 'model.patch.yml'), patch = yaml.load(await readFile(patchPath, 'utf8'));
const config = patch.find(entry => entry.id === 'p10-model').config;
config.simulationMs = 120000;
await writeFile(patchPath, yaml.dump(patch, { lineWidth: -1, noRefs: true }));
await put(join(root, 'authorization.json'), {
  user_request: '修复完成后，直接完成 156 题的测试，然后将报告输出出来，保存原本我需要你做的那些模型调用的数据，他们调用了什么工具以及模型思考内容，方便后续检查。',
  scope: 'Fresh 156-task campaign with approved public interface errata, stable RTL evaluator and mandatory netlist acceptance',
  budget_basis: 'Retain the previous explicitly authorized limits; no budget increase. A follow-up budget preference question has not received a separate answer.',
  previous_authorization_sha256: hash(await readFile(join(previous, 'authorization.json'))),
  max_physical_calls: 20124, rtl_edits_per_task: 15, repair_requests_per_task: 120, tool_actions_per_task: 60,
  api_endpoint: 'https://api.deepseek.com', api_cost_expected: true, raw_returned_reasoning_only: true, credentials_archived: false,
  temporary_system_required: true, permanent_power_settings_changed: false,
});
const freezePath = join(root, 'campaign-freeze.json'), freeze = await json(freezePath);
freeze.calibration_reused = false;
freeze.protocol.rtl_evaluator = result.protocol;
freeze.protocol.simulation_ms = config.simulationMs;
freeze.protocol.synthesis_timeout_ms = 600000;
freeze.protocol.known_spec_conflicts = ['Prob093_ece241_2014_q3', 'Prob149_ece241_2013_q4'];
for (const name of ['model.patch.yml', 'analyze.mjs', 'final-integrity.mjs', 'prepare-campaign.mjs', 'run-power.ps1', 'archive-inputs.ps1', 'authorization.json', 'known-spec-conflicts.json']) {
  const path = join(root, name); freeze.files[path] = hash(await readFile(path));
}
for (const name of ['results.json', 'freeze.json', 'calibration-evidence.json']) {
  const path = join(calibration, name); freeze.files[path] = hash(await readFile(path));
}
// Normalize duplicated Windows/slash paths from the generic preparer before sealing.
const normalized = {};
for (const [path, sha] of Object.entries(freeze.files)) normalized[path.replaceAll('\\', '/')] = sha;
freeze.files = normalized;
await put(freezePath, freeze);
for (const [path, sha] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), sha, path);
assert.equal(config.selectedTaskCount, 156); assert.equal(config.maxRepairRounds, 15); assert.equal(config.maxAgentRequests, 120);
assert.equal(config.campaignMaxDispatches, 20124); assert.equal(config.maxGenerationResumes, 0);
const stability = await json(join(root, 'stability.json'));
assert.equal(stability.calibrationExcluded.length, 0); assert.equal(stability.generationExcluded.length, 0);
process.stdout.write(run('pwsh', ['-NoProfile', '-File', join(root, 'archive-inputs.ps1'), '-Root', root, '-FreezeFile', freezePath]));
await put(join(root, 'configuration-check.json'), { status: 'PASS', tasks: 156, calibration_ready: 156, known_spec_conflicts: freeze.protocol.known_spec_conflicts,
  git_commit: freeze.git_commit, frozen_files: Object.keys(freeze.files).length, freeze_sha256: hash(await readFile(freezePath)), model_calls: 0 });
process.stdout.write('Fresh campaign prepared and frozen: ' + root + '\n');
