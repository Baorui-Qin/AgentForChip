import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { checkSynthesisDirectives } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-auto-policy.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
const root = 'D:/AMD/p156-0923-v1', rows = []
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (!entry.isDirectory() || !/^(generate|compare)-/.test(entry.name)) continue
  const path = join(root, entry.name, entry.name.startsWith('generate-') ? 'initial.sv' : 'final.sv')
  const bytes = await readFile(path).catch(error => { if (error.code === 'ENOENT') return null; throw error })
  if (!bytes) continue
  let rejection = null
  try { checkSynthesisDirectives(bytes.toString()) } catch (error) { rejection = { code: error.message, line: error.line, directive: error.directive } }
  rows.push({ path, sha256: sha256(bytes), rejection })
}
for (const row of rows) if (sha256(await readFile(row.path)) !== row.sha256) throw new Error('HISTORICAL_SOURCE_CHANGED')
const output = { policy: 'RT-01 synthesis metacomment restriction only', model_calls: 0, scores_changed: false,
  scanned: rows.length, rejected: rows.filter(r => r.rejection).length, rows }
await writeFile(process.argv[2] ?? 'D:/AMD/redteam-20260927/historical-policy-scan.json', JSON.stringify(output, null, 2), { flag: 'wx' })
console.log(JSON.stringify({ scanned: output.scanned, rejected: output.rejected, scores_changed: false }))
