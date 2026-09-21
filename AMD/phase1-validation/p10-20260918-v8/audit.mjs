import { readFile, writeFile, readdir, lstat, readlink } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const root = dirname(fileURLToPath(import.meta.url)), pilot = join(root, 'pilot-10');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const json = async path => JSON.parse((await readFile(path, 'utf8')).replace(/^\uFEFF/, ''));
const sha = async path => hash(await readFile(path));
const put = (name, value) => writeFile(join(root, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
async function files(directory, relative = '', excluded = []) {
  const out = [];
  for (const name of (await readdir(join(directory, relative))).sort()) {
    const path = relative ? relative + '/' + name : name;
    if (excluded.includes(path)) continue;
    const stat = await lstat(join(directory, path));
    assert.ok(!stat.isSymbolicLink(), path);
    if (stat.isDirectory()) out.push(...await files(directory, path, excluded));
    else { assert.ok(stat.isFile(), path); out.push({ path, bytes: stat.size, sha256: await sha(join(directory, path)) }); }
  }
  return out;
}
const freeze = await json(join(root, 'freeze.json'));
for (const [path, expected] of Object.entries(freeze.files)) assert.equal(await sha(path), expected, path);
const launch = await json(join(root, 'launch-result.json'));
assert.equal(launch.exit_code, 0);
const terminal = await json(join(pilot, 'terminal.json'));
assert.equal(terminal.phase, 'TERMINAL'); assert.equal(terminal.recommendation, 'NO_GO');
assert.equal(terminal.ready, 0); assert.equal(terminal.blocked, 10); assert.equal(terminal.inconclusive, 0);
assert.equal(terminal.model_requests, 0); assert.equal(terminal.dataset_unchanged, true);
const identity = await json(join(pilot, 'campaign-identity.json'));
assert.equal(identity.campaign_id, terminal.campaign_id);
assert.equal(identity.freeze_sha256, await sha(join(root, 'freeze.json')));
assert.equal(identity.full_os_isolation_verified, false);
const manifest = await json(join(pilot, 'manifest/p10-manifest-10.json'));
const receipt = await json(join(pilot, 'manifest/manifest-receipt.json'));
assert.equal(receipt.sha256, await sha(join(pilot, 'manifest', receipt.path)));
const expectedIds = ['Prob005_notgate', 'Prob035_count1to10', 'Prob045_edgedetect2', 'Prob074_ece241_2014_q4', 'Prob015_vector1',
  'Prob033_ece241_2014_q1c', 'Prob004_vector2', 'Prob020_mt2015_eq2', 'Prob018_mux256to1', 'Prob061_2014_q4a'];
assert.deepEqual(manifest.task_ids, expectedIds);
const catalog = await json(join(pilot, 'manifest/dataset-catalog.json'));
assert.equal(catalog.tasks.length, 156);
for (const task of catalog.tasks) for (const [path, expected] of Object.entries(task.assets)) assert.equal(await sha(join('D:/AMD/verilog-eval', path)), expected, path);
const order = await json(join(pilot, 'manifest/selection-order.json'));
assert.equal(order.seed, 'p10-verilogeval-v1:20260917:'); assert.equal(order.main_40_run_authorized, false);
assert.deepEqual(order.tasks.slice(0, 10), manifest.tasks);
const rest = catalog.tasks.filter(t => !expectedIds.includes(t.task_id)).map(t => ({ id: t.task_id, key: hash(order.seed + t.task_id) }))
  .sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : a.id < b.id ? -1 : 1).slice(0, 30);
assert.deepEqual(order.tasks.slice(10).map(t => t.task_id), rest.map(t => t.id));
for (const prefix of ['', 'final-']) {
  assert.equal((await readFile(join(pilot, `git/${prefix}head.stdout.log`), 'utf8')).trim(), manifest.dataset_revision);
  assert.equal((await readFile(join(pilot, `git/${prefix}status.stdout.log`), 'utf8')).trim(), '');
}
const report = await json(join(pilot, 'p10-results-10.json'));
assert.deepEqual(report.rows.map(r => r.task_id), expectedIds);
for (const row of report.rows) {
  assert.equal(row.baseline_status, 'NOT_RUN'); assert.equal(row.agent_final_status, 'NOT_RUN');
  assert.equal(row.shared_initial_candidate, null); assert.equal(row.final_verified, false);
  assert.equal(row.baseline_prompt_tokens, null); assert.equal(row.agent_completion_tokens, null);
}
assert.equal(report.metrics.provider_dispatches, 0); assert.equal(report.metrics.baseline_pass_rate_on_evaluable, null);
assert.equal(report.metrics.repair_success_rate, null);
const claims = await readdir(join(pilot, 'claims'));
assert.equal(claims.length, 11);
const rows = [], keys = new Set(); let edaFiles = 0;
for (const [index, id] of [...expectedIds, 'Prob038_count15'].entries()) {
  const target = join(pilot, 'tasks', id), row = await json(join(target, 'preflight.json'));
  assert.equal(row.task_id, id); assert.equal(row.campaign_id, identity.campaign_id);
  assert.equal(row.manifest_index, index < 10 ? index + 1 : null);
  assert.equal(row.status, 'TESTBENCH_COMPATIBILITY_BLOCKED'); assert.equal(row.model_requests, 0);
  assert.equal(row.processes_joined, true); assert.equal(row.wrapper_sha256, await sha(join(target, 'wrapper.sv')));
  assert.ok(resolve(row.verification_run).startsWith(resolve(target) + '\\'));
  const record = await json(join(row.verification_run, 'result.json'));
  assert.equal(record.task_id, id); assert.equal(record.experiment_id, identity.campaign_id);
  assert.equal(record.verification_key, row.verification_key); assert.ok(!keys.has(row.verification_key)); keys.add(row.verification_key);
  assert.equal(record.final_source_sha256, row.wrapper_sha256); assert.equal(record.final_verified, false);
  assert.equal(record.model_requests_total, 0); assert.equal(record.semantic_repairs, 0);
  const events = (await readFile(join(row.verification_run, 'events.jsonl'), 'utf8')).trim().split('\n').map(JSON.parse);
  assert.equal(events.at(-1).type, 'run_finished'); assert.deepEqual(events.at(-1).value, record);
  assert.equal(record.stages.compile.status, 'TOOL_ERROR');
  for (const name of ['elaborate', 'simulation', 'synthesis']) assert.equal(record.stages[name].status, 'SKIPPED');
  const mode = await json(join(row.verification_run, 'preflight-mode.json'));
  assert.equal(mode.purpose, 'evaluator_preflight'); assert.equal(mode.candidate_verification, false); assert.equal(mode.synthesis_requested, false);
  const artifacts = await json(join(row.verification_run, 'artifacts.json'));
  assert.deepEqual(await files(row.verification_run, '', ['artifacts.json']), artifacts.files);
  edaFiles += artifacts.files.length;
  const task = catalog.tasks.find(t => t.task_id === id);
  const compile = record.stages.compile.invocations.find(i => i.label === 'compile');
  assert.equal(compile.process.timed_out, false); assert.equal(compile.process.cancelled, false); assert.equal(compile.process.log_truncated, false);
  assert.deepEqual(compile.sources.map(s => s.role), ['dut', 'reference', 'testbench']);
  for (const [role, suffix] of [['reference', 'ref.sv'], ['testbench', 'test.sv']]) {
    const source = compile.sources.find(s => s.role === role);
    assert.equal(await sha(source.path), task.assets[`dataset_spec-to-rtl/${id}_${suffix}`]);
  }
  assert.equal(await sha(join(target, 'prompt.txt')), task.assets[`dataset_spec-to-rtl/${id}_prompt.txt`]);
  const diagnostic = row.diagnostics.find(d => d.message_id === 'VRFC 10-3380');
  assert.ok(diagnostic); assert.equal(diagnostic.origin, 'testbench'); assert.equal(diagnostic.repairable_by_model, false);
  assert.match(await readFile(join(row.verification_run, 'build/compile.stdout.log'), 'utf8'), /VRFC 10-3380/);
  rows.push({ task_id: id, selected: index < 10, status: row.status, line: diagnostic.line, verification_key: row.verification_key,
    artifact_files: artifacts.files.length, eda_wall_ms: row.eda_wall_ms });
}
const trajectories = await json(join(pilot, 'trajectory-index.json'));
assert.equal(trajectories.tasks.length, 10);
assert.ok(trajectories.tasks.every(t => t.initial_generation === null && t.model_requests.length === 0 && t.agent_revisions.length === 0));
assert.equal((await json(join(root, 'main-40/NOT_RUN.json'))).status, 'NOT_RUN');
const processAudit = await json(join(root, 'process-audit.json'));
assert.equal(processAudit.eda_process_count, 0); assert.equal(processAudit.campaign_node_or_cmd_count, 0);
const archives = [];
for (const prior of freeze.preserved_archives) {
  assert.equal(await sha(prior.path), prior.sha256);
  const manifest = await json(prior.path), parent = dirname(prior.path);
  for (const file of manifest.files) {
    const bytes = await readFile(join(parent, file.path));
    assert.equal(bytes.length, file.bytes, file.path); assert.equal(hash(bytes), file.sha256, file.path);
  }
  for (const link of manifest.links ?? []) {
    const target = await readlink(join(parent, link.path));
    assert.equal(target, link.target); assert.equal(hash(target), link.target_text_sha256);
  }
  archives.push({ path: prior.path, files: manifest.files.length, links: manifest.links?.length ?? 0, status: 'PASS' });
}
await put('audit-results.json', { status: 'PASS', scope: 'preflight-only-not-model-comparison', created_at: new Date().toISOString(),
  frozen_files: Object.keys(freeze.files).length, raw_dataset_assets: 468, selected_terminal: 10, sentinel_terminal: 1,
  eda_terminal_manifests: 11, eda_manifest_files: edaFiles, provider_dispatches: 0, stale_verified_results: 0,
  no_reference_or_testbench_changes: true, model_comparison_audit: 'NOT_RUN', rows, preserved_p09_archives: archives,
  process_audit: processAudit, full_os_isolation_verified: false });
console.log(JSON.stringify({ status: 'PASS', selected: 10, sentinel: 1, eda_files: edaFiles, model_requests: 0, preserved_archives: archives }));
