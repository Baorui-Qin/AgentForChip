import assert from 'node:assert/strict';
import { readFile, writeFile, readdir, lstat, readlink, copyFile, access } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
const [root, modelRoot] = process.argv.slice(2);
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const archive = await json(join(root, 'source-snapshot.json'));
const fullFreezePath = join(root, 'preflight-freeze.json');
assert.equal(hash(await readFile(fullFreezePath)), archive.freeze_sha256);
const archived = new Map(archive.source_files.map(file => [file.original_path, file]));
let checked = 0, archivedChecks = 0;
for (const path of [fullFreezePath, join(root, 'g3/freeze.json')]) {
  const freeze = await json(path);
  for (const [input, digest] of Object.entries(freeze.files)) {
    if (hash(await readFile(input)) !== digest) {
      const saved = archived.get(input); assert.ok(saved); assert.equal(saved.sha256, digest);
      assert.equal(hash(await readFile(saved.snapshot_path)), digest); archivedChecks++;
    }
    checked++;
  }
}
const rows = await json(join(root, 'preflight-156/compat-positive-negative-results.json'));
assert.equal(rows.length, 156); assert.equal(new Set(rows.map(row => row.task_id)).size, 156);
const problems = [];
for (const row of rows) {
  for (const kind of ['positive', 'negative']) {
    const control = row[kind]; if (!control) continue;
    const result = await json(join(control.run, 'result.json'));
    for (const stage of control.stages) {
      assert.equal(result.stages[stage.stage].status, stage.status);
      assert.deepEqual(result.stages[stage.stage].evidence, stage.evidence);
    }
  }
  const positive = row.positive, negative = row.negative;
  const p = positive?.stages.find(stage => stage.stage === 'simulation'), n = negative?.stages.find(stage => stage.stage === 'simulation');
  const clean = control => control.stages.slice(0, 3).every(stage => stage.invocations?.length && stage.invocations.every(v => {
    const process = v.process, version = v.args.length === 1 && v.args[0] === '-version' && v.version_matches === true;
    return (process.exit_code === 0 || version && process.exit_code === 1) && !process.timed_out && !process.cancelled && !process.signal && !process.log_truncated;
  }));
  const ready = !!(positive && negative && clean(positive) && clean(negative) && positive.stages.slice(0, 3).every(stage => stage.status === 'PASS') &&
    p.evidence.test_completed && p.evidence.checks_executed > 0 && p.evidence.mismatch_count === 0 && negative.stages.slice(0, 2).every(stage => stage.status === 'PASS') &&
    n.status === 'FAIL' && n.evidence.test_completed && n.evidence.checks_executed > 0 && n.evidence.mismatch_count > 0);
  assert.equal(row.evaluable, ready, row.task_id);
  if (!ready) problems.push({ task_id: row.task_id, reason: row.reason, category: row.category,
    positive: positive ? { directory: positive.run, stages: positive.stages.map(stage => ({ stage: stage.stage, status: stage.status, evidence: stage.evidence, errors: stage.errors, warnings: stage.warnings })) } : null,
    negative: negative ? { directory: negative.run, stages: negative.stages.map(stage => ({ stage: stage.stage, status: stage.status, evidence: stage.evidence, errors: stage.errors })) } : null });
}
const files = [], links = [];
async function inventory(directory) {
  for (const name of (await readdir(directory)).sort()) {
    const path = join(directory, name), rel = relative(root, path).replaceAll('\\', '/');
    if (rel === 'calibration-evidence.json') continue;
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) { links.push({ path: rel, target: await readlink(path) }); continue; }
    if (stat.isDirectory()) { await inventory(path); continue; }
    if (stat.isFile()) { const bytes = await readFile(path); files.push({ path: rel, bytes: bytes.length, sha256: hash(bytes) }); }
  }
}
await inventory(root);
const indexPath = join(root, 'calibration-evidence.json');
await writeFile(indexPath, JSON.stringify({ integrity_audit: 'PASS', at: new Date().toISOString(), selected: 156, ready: rows.filter(row => row.evaluable).length,
  frozen_checks: checked, archived_source_checks: archivedChecks, source_changes_after_completed_calibration: 'Only model repair request-boundary reporting changed; verification implementation and task/evaluator inputs unchanged.',
  problems, total_files: files.length, total_bytes: files.reduce((n, file) => n + file.bytes, 0), links, files }, null, 2), { flag: 'wx' });
await assert.rejects(access(join(modelRoot, 'dispatches')), { code: 'ENOENT' });
const freezePath = join(modelRoot, 'campaign-freeze.json'), freeze = await json(freezePath);
const scriptPath = join(modelRoot, 'audit-calibration.mjs');
await copyFile(process.argv[1], scriptPath);
freeze.files[indexPath] = hash(await readFile(indexPath)); freeze.files[scriptPath] = hash(await readFile(scriptPath));
freeze.calibration_evidence_index = indexPath;
await writeFile(freezePath, JSON.stringify(freeze, null, 2));
console.log(JSON.stringify({ integrity_audit: 'PASS', selected: rows.length, ready: rows.filter(row => row.evaluable).length, archived_source_checks: archivedChecks, files: files.length, bytes: files.reduce((n, file) => n + file.bytes, 0) }));
