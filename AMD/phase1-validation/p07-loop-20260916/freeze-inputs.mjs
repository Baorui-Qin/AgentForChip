import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { fixtureFiles } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/fixtures.ts'

const root = 'D:/AMD/phase1-validation/p07-loop-20260916'
const previous = 'D:/AMD/phase1-validation/p07-20260916'
const digest = value => createHash('sha256').update(value).digest('hex')
async function files(directory) {
  const result = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error('Unexpected evidence link: ' + path)
    if (entry.isDirectory()) result.push(...await files(path))
    else if (entry.isFile()) result.push(path)
  }
  return result.sort()
}
async function hashes(paths) {
  const result = {}
  for (const path of paths) result[path.replaceAll('\\', '/')] = digest(await readFile(path))
  return result
}
const historical = []
for (const entry of await readdir(previous, { withFileTypes: true })) {
  if (entry.isDirectory() && /^(repair-|replay-)/.test(entry.name)) historical.push(...await files(join(previous, entry.name)))
  else if (entry.isFile() && /^(acceptance|api-failure-audit|config-audit)/.test(entry.name)) historical.push(join(previous, entry.name))
}
const sourceFiles = await files('D:/deepseek-harness/rtl-tools/src')
const configFiles = ['settings.yaml', 'authorized-experiment.patch.yml', ...['cordis.yml', 'cordis.patch.yml', 'package.json'].map(name => 'dsh-home/profiles/rtl-repair/' + name)].map(name => join(root, name))
const fixtures = {}
for (const id of ['counter', 'synthesis-only', 'controlled_multi_round', 'controlled_multi_round_reset']) {
  const assets = fixtureFiles(id)
  fixtures[id] = Object.fromEntries(Object.entries(assets).map(([path, text]) => [path, { sha256: digest(text), utf8_bytes: Buffer.byteLength(text), text }]))
}
const request = 'C:/Users/qbr/.codex/attachments/32aae9e1-cb39-4b3e-a955-ee4b79995644/pasted-text.txt'
const record = {
  schema_version: '1.5', frozen_at: new Date().toISOString(), request_sha256: digest(await readFile(request)),
  scope: { fixtures: Object.keys(fixtures), max_controlled_fixtures: 2, max_semantic_repairs_per_case: 3, max_transport_retries_per_round: 2,
    initial_generation: 0, fixed_fixture_execution: 'user_requested', model_candidate_execution: 'individual_human_approval_required', unattended_execution_authorized: false },
  fixtures, code: await hashes(sourceFiles), configuration: await hashes(configFiles), historical: await hashes(historical),
  credentials_recorded: false, prob038_original_evaluator: 'BLOCKED'
}
await writeFile(join(root, 'frozen-inputs.json'), JSON.stringify(record, null, 2), { flag: 'wx' })
console.log(JSON.stringify({ frozen: true, source_files: sourceFiles.length, historical_files: historical.length, fixtures: Object.keys(fixtures) }))
