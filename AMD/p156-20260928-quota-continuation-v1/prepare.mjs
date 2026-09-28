import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, copyFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const prior = 'D:/AMD/p156-20260927-v3', root = 'D:/AMD/p156-20260928-quota-continuation-v1';
const json = async p => JSON.parse(await readFile(p, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const put = (p, value) => writeFile(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
const yaml = createRequire('D:/deepseek-harness/package.json')('js-yaml');
const audit = await json(join(prior, 'report/evidence-audit.json'));
const integrity = await json(join(prior, 'report/final-integrity.json'));
assert.equal(audit.integrity_audit, 'PASS'); assert.equal(audit.state, 'COMPARISON_FINISHED');
assert.equal(audit.summary.compared, 156); assert.equal(integrity.status, 'PASS');
assert.ok(!(await readdir(prior)).includes('stability.lock'));
const originalFreeze = await json(join(prior, 'campaign-freeze.json'));
for (const [path, digest] of Object.entries(originalFreeze.files)) assert.equal(hash(await readFile(path)), digest, path);
const inventory = await json(join(prior, 'evidence-files.json'));
for (const file of inventory.files) assert.equal(hash(await readFile(join(prior, file.path))), file.sha256, file.path);
const taskIds = audit.rows.filter(r => r.agent_status === 'QUOTA').map(r => r.task_id);
assert.deepEqual(taskIds, ['Prob133_2014_q3fsm', 'Prob137_fsm_serial']);
const tasks = [];
for (const task of taskIds) {
  const previous = await json(join(prior, `compare-${task}/result.json`));
  assert.equal(previous.semantic_repairs, 0);
  assert.equal(previous.current_source_sha256, previous.shared_initial_sha256);
  tasks.push({ task_id: task, previous_result: join(prior, `compare-${task}/result.json`),
    source_sha256: previous.shared_initial_sha256,
    used: { requests: previous.model_call_attempts, dispatches: previous.physical_dispatches, tools: previous.actions.length, edits: previous.semantic_repairs },
    remaining: { requests: 120 - previous.model_call_attempts, tools: 60 - previous.actions.length, edits: 15 - previous.semantic_repairs } });
}
const cap = tasks.reduce((n, task) => n + task.remaining.requests, 0);
assert.ok(audit.summary.combined_physical_dispatches + cap <= 20124);
await mkdir(root);
await mkdir(join(root, 'report'));
await mkdir(join(root, 'runner-logs'));
for (const name of ['p09.json', 'eda-settings.yaml', 'run-power.ps1']) await copyFile(join(prior, name), join(root, name), 1);
for (const [from, to] of [['D:/AMD/prepare-quota-continuation.mjs', 'prepare.mjs'], ['D:/AMD/run-quota-continuation.mjs', 'run.mjs'], ['D:/AMD/audit-quota-continuation.mjs', 'audit.mjs']]) await copyFile(from, join(root, to), 1);
const manifest = { task_ids: taskIds, tasks, prior_root: prior, prior_combined_dispatches: audit.summary.combined_physical_dispatches,
  added_dispatch_cap: cap, combined_authorized_cap: 20124, context_restarted: true, initial_candidates_regenerated: false,
  note: 'Independent supplemental comparisons from the same initial RTL, not in-place context resume. Prior requests, tools and edits are deducted. Original results remain immutable.' };
await put(join(root, 'continuation.json'), manifest);
await put(join(root, 'stability.json'), { manifestFile: 'continuation.json', manifestSha256: hash(await readFile(join(root, 'continuation.json'))), calibrationExcluded: [], generationExcluded: [] });
await put(join(root, 'authorization-confirmation.json'), {
  reply: '我会恢复 API 配额，恢复后追加独立续测记录',
  original_authorization: join(prior, 'authorization-confirmation.json'),
  restored_api_evidence: join(prior, 'compare-Prob149_ece241_2013_q4/models/run-iffcAo/transport.json'),
  total_budget_increased: false, automatic_recharge: false, additional_probe_calls: 0
});
assert.equal((await json(join(prior, 'compare-Prob149_ece241_2013_q4/models/run-iffcAo/transport.json'))).http_status, 200);
const addedFiles = ['p09.json', 'eda-settings.yaml', 'run-power.ps1', 'prepare.mjs', 'run.mjs', 'audit.mjs', 'continuation.json', 'stability.json', 'authorization-confirmation.json'];
for (const task of tasks) {
  const gen = `generate-${task.task_id}`;
  await mkdir(join(root, gen));
  for (const name of ['result.json', 'initial.sv']) {
    await copyFile(join(prior, gen, name), join(root, gen, name), 1);
    addedFiles.push(`${gen}/${name}`);
  }
  const auto = await json(join(prior, 'auto.json'));
  Object.assign(auto, { campaignRoot: root, maxToolSteps: task.remaining.tools, maxDispatches: cap, campaignDispatchLimit: cap });
  const autoName = `${task.task_id}.auto.json`, patchName = `${task.task_id}.patch.yml`;
  await put(join(root, autoName), auto);
  const patch = yaml.load(await readFile(join(prior, 'model.patch.yml'), 'utf8'));
  patch.find(p => p.id === 'policy').config.workspaceRoot = root;
  Object.assign(patch.find(p => p.id === 'p10-model').config, {
    campaignRoot: root, settingsFile: join(root, 'eda-settings.yaml'), p09File: join(root, 'p09.json'),
    autoFile: join(root, autoName), freezeFile: join(root, 'campaign-freeze.json'),
    maxRepairRounds: task.remaining.edits, maxAgentRequests: task.remaining.requests, campaignMaxDispatches: cap
  });
  await writeFile(join(root, patchName), yaml.dump(patch, { noRefs: true, lineWidth: -1 }), { flag: 'wx' });
  addedFiles.push(autoName, patchName);
}
const freeze = { ...originalFreeze, parent_campaign: prior, supplemental_only: true, context_restarted: true,
  protocol: { ...originalFreeze.protocol, prior_campaign_dispatches: audit.summary.combined_physical_dispatches, campaign_max_dispatches: cap, per_task_remaining: tasks },
  files: { ...originalFreeze.files } };
for (const path of [join(prior, 'campaign-freeze.json'), join(prior, 'evidence-files.json'), join(prior, 'report/evidence-audit.json'),
  join(prior, 'report/final-integrity.json'), ...tasks.map(t => t.previous_result), ...addedFiles.map(n => join(root, n))]) freeze.files[path] = hash(await readFile(path));
await put(join(root, 'campaign-freeze.json'), freeze);
console.log(JSON.stringify({ root, tasks, additional_call_cap: cap, prior_calls: audit.summary.combined_physical_dispatches, freeze_sha256: hash(await readFile(join(root, 'campaign-freeze.json'))) }, null, 2));
