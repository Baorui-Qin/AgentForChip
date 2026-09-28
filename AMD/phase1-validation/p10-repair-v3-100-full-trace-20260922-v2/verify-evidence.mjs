import assert from 'node:assert/strict'
import { readFile, lstat } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const root = process.argv[2]
const json = async path => JSON.parse(await readFile(path, 'utf8'))
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex')
const manifest = await json(join(root, 'evidence-files.json'))
const freeze = await json(join(root, 'campaign-freeze.json'))
const audit = await json(join(root, 'report/evidence-audit.json'))
const state = await json(join(root, 'report/latest.json'))
assert.equal(state.state, 'COMPARISON_FINISHED')
assert.equal(audit.integrity_audit, 'PASS')
assert.equal(audit.summary.selected, 100)
assert.equal(audit.rows.length, 100)
assert.equal(new Set(audit.rows.map(row => row.task_id)).size, 100)
assert.equal(audit.summary.runnable, 100)
const calibration = await json(join(root, 'calibration-provenance.json'))
for (const [path, digest] of Object.entries(calibration.evidence_files)) assert.equal(sha256(await readFile(path)), digest, path)
assert.equal(manifest.total_files, manifest.files.length)
assert.deepEqual(manifest.summary, audit.summary)
let bytesChecked = 0
for (const entry of manifest.files) {
  const bytes = await readFile(join(root, entry.path))
  assert.equal(bytes.length, entry.bytes, entry.path)
  assert.equal(sha256(bytes), entry.sha256, entry.path)
  bytesChecked += bytes.length
}
assert.equal(bytesChecked, manifest.total_bytes)
for (const link of manifest.links) assert.ok((await lstat(join(root, link.path))).isSymbolicLink(), link.path)
for (const [path, hash] of Object.entries(freeze.files)) assert.equal(sha256(await readFile(path)), hash, path)
const snapshots = await json(join(root, 'source-snapshot-index.json'))
for (const entry of snapshots) {
  assert.equal(sha256(await readFile(entry.snapshot)), entry.sha256, entry.snapshot)
  const frozen = Object.entries(freeze.files).find(([path]) => path.replaceAll('\\', '/').toLowerCase() === entry.source.replaceAll('\\', '/').toLowerCase())
  assert.ok(frozen, entry.source)
  assert.equal(frozen[1], entry.sha256, entry.source)
}
console.log(JSON.stringify({ status: 'PASS', campaign_state: state.state, files_verified: manifest.files.length,
  bytes_verified: bytesChecked, external_links_not_traversed: manifest.links.length,
  frozen_files_verified: Object.keys(freeze.files).length, source_snapshots_verified: snapshots.length,
  model_archives_verified: audit.model_archives_checked, summary: audit.summary }, null, 2))
