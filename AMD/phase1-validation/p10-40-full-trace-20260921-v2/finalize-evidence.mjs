import assert from 'node:assert/strict'
import { createReadStream } from 'node:fs'
import { readFile, readdir, stat, writeFile, readlink } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { createHash } from 'node:crypto'

const root = process.argv[2]
const manifestName = 'evidence-files.json'
const audit = JSON.parse(await readFile(join(root, 'report/evidence-audit.json'), 'utf8'))
const live = JSON.parse(await readFile(join(root, 'report/latest.json'), 'utf8'))
assert.equal(live.state, 'COMPARISON_FINISHED')
assert.equal(audit.integrity_audit, 'PASS')
assert.equal(audit.summary.selected, 40)
assert.equal(audit.summary.candidates, audit.summary.compared)
const files = [], links = []
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name), name = relative(root, path).replaceAll('\\', '/')
    if (name === manifestName) continue
    if (entry.isSymbolicLink()) { links.push({ path: name, target: await readlink(path), followed: false }); continue }
    if (entry.isDirectory()) { await walk(path); continue }
    if (!entry.isFile()) continue
    const digest = createHash('sha256')
    for await (const bytes of createReadStream(path)) digest.update(bytes)
    files.push({ path: name, bytes: (await stat(path)).size, sha256: digest.digest('hex') })
  }
}
await walk(root)
files.sort((a, b) => a.path.localeCompare(b.path))
const result = { schema_version: 'p10-evidence-files-1', created_at: new Date().toISOString(),
  integrity_audit: audit.integrity_audit, campaign_state: live.state, summary: audit.summary,
  total_files: files.length, total_bytes: files.reduce((n, f) => n + f.bytes, 0),
  excluded: [manifestName], links, files }
await writeFile(join(root, manifestName), JSON.stringify(result, null, 2))
console.log(JSON.stringify({ files: result.total_files, bytes: result.total_bytes, links_not_followed: links.length,
  model_streams: files.filter(f => f.path.endsWith('/stream.jsonl')).length,
  model_reasoning_files: files.filter(f => f.path.endsWith('/reasoning.txt')).length,
  stdout_logs: files.filter(f => f.path.endsWith('.stdout.log')).length,
  stderr_logs: files.filter(f => f.path.endsWith('.stderr.log')).length }))
