import assert from 'node:assert/strict';
import { readFile, writeFile, readdir, lstat, readlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const root = process.argv[2];
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const audit = await json(join(root, 'report', 'evidence-audit.json'));
assert.equal(audit.integrity_audit, 'PASS');
assert.equal(audit.state, 'COMPARISON_FINISHED');
assert.equal(audit.summary.selected, 156);
assert.equal(audit.summary.calibrated, 156);
assert.equal(audit.summary.compared, audit.summary.legal_candidates);
assert.equal(audit.summary.legal_candidates + audit.summary.generation_failed, 156);
const freezePath = join(root, 'campaign-freeze.json'), freeze = await json(freezePath);
const calibrationRoot = freeze.preflight_root;
assert.equal(freeze.protocol.rtl_evaluator, 'p10-settled-rtl-1');
assert.equal(freeze.protocol.acceptance_protocol, 'p10-netlist-1');
for (const [path, digest] of Object.entries(freeze.files)) assert.equal(hash(await readFile(path)), digest, path);
const sources = await json(join(root, 'source-snapshot.json'));
assert.equal(hash(await readFile(freezePath)), sources.freeze_sha256);
for (const file of sources.source_files) {
  assert.equal(hash(await readFile(file.snapshot_path)), file.sha256, file.snapshot_path);
  assert.equal(freeze.files[file.original_path], file.sha256, file.original_path);
}
const calibration = await json(join(calibrationRoot, 'calibration-evidence.json'));
for (const file of calibration.files) {
  const bytes = await readFile(join(calibrationRoot, file.path));
  assert.equal(bytes.length, file.bytes, file.path); assert.equal(hash(bytes), file.sha256, file.path);
}
for (const link of calibration.links) assert.equal(await readlink(join(calibrationRoot, link.path)), link.target, link.path);
const power = (await readFile(join(root, 'power-request.jsonl'), 'utf8')).trim().split(/\r?\n/).map(JSON.parse);
assert.deepEqual(power.map(entry => entry.event), ['acquired', 'released']);
assert.equal(power[0].pid, power[1].pid); assert.equal(power[0].ac_line, 1);
assert.equal(power[0].permanent_settings_changed, false); assert.equal(power[1].campaign_exit, 0);
const calls = await json(join(root, 'report', 'call-index.json'));
const expected = new Map();
for (const call of calls.filter(call => call.dispatched)) expected.set(call.request_sha256, (expected.get(call.request_sha256) ?? 0) + 1);
const tickets = new Map();
for (const name of await readdir(join(root, 'dispatches'))) {
  if (!name.endsWith('.json')) continue;
  const ticket = await json(join(root, 'dispatches', name)), digest = ticket.owner.request_sha256;
  tickets.set(digest, (tickets.get(digest) ?? 0) + 1);
}
assert.deepEqual(tickets, expected);
const final = { status: 'PASS', checked_at: new Date().toISOString(),
  frozen_inputs: Object.keys(freeze.files).length, source_snapshots: sources.source_files.length,
  calibration_files: calibration.files.length, calibration_links: calibration.links.length,
  dispatch_ticket_request_hash_multiset_matches_archived_calls: true,
  power_request_released: true, power, summary: audit.summary,
  limitations: ['Integrity is not public-specification correctness; see report.zh.md and known-spec-conflicts.json.', 'Inventory excludes only itself and does not traverse symbolic links.'] };
await writeFile(join(root, 'report', 'final-integrity.json'), JSON.stringify(final, null, 2) + '\n');

const files = [], links = [];
async function inventory(directory) {
  for (const name of (await readdir(directory)).sort()) {
    const path = join(directory, name), rel = relative(root, path).replaceAll('\\', '/');
    if (rel === 'evidence-files.json') continue;
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) { links.push({ path: rel, target: await readlink(path) }); continue; }
    if (stat.isDirectory()) { await inventory(path); continue; }
    if (stat.isFile()) { const bytes = await readFile(path); files.push({ path: rel, bytes: bytes.length, sha256: hash(bytes) }); }
  }
}
await inventory(root);
const index = { integrity_audit: 'PASS', created_at: new Date().toISOString(), state: audit.state, summary: audit.summary,
  total_files: files.length, total_bytes: files.reduce((n, file) => n + file.bytes, 0), excluded: ['evidence-files.json'], links, files };
await writeFile(join(root, 'evidence-files.json'), JSON.stringify(index, null, 2) + '\n');
for (const file of files) assert.equal(hash(await readFile(join(root, file.path))), file.sha256, file.path);
console.log(JSON.stringify({ ...final, inventory_files: files.length, inventory_bytes: index.total_bytes, inventory_readback: 'PASS' }, null, 2));
