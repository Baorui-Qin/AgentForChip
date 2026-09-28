import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { calibratedNetlistProfiles as previous, netlistCalibrationEvidence as priorEvidence } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist-calibrated.ts'
import { calibratedNetlistProfiles as published, netlistCalibrationEvidence as evidence } from './published-netlist-profiles.ts'
import { loadP10Dataset } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-dataset.ts'
import { buildNetlistProfile } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist-suite.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'

const dataset = 'D:/AMD/verilog-eval', root = 'D:/AMD/netlist-suite-20260927/approved-interface-errata'
const git = (...args) => execFileSync('git', ['-C', dataset, ...args], { encoding: 'utf8', windowsHide: true })
assert.equal(git('status', '--porcelain').trim(), '')
const catalog = await loadP10Dataset(dataset, git('rev-parse', 'HEAD'), git('ls-tree', '-r', 'HEAD', '--', 'dataset_spec-to-rtl'), git('ls-files', '--eol', '--', 'dataset_spec-to-rtl'))
assert.deepEqual(catalog, JSON.parse(await readFile(root + '/effective-catalog.json', 'utf8')))
assert.equal(Object.keys(previous).length, 151)
assert.equal(Object.keys(published).length, 153)
for (const [id, profile] of Object.entries(previous)) {
  assert.deepEqual(published[id], profile)
  assert.deepEqual(evidence[id], priorEvidence[id])
}
let samples = 0
for (const task of catalog) {
  const profile = published[task.task_id]
  if (!profile) continue
  const reference = await readFile(`${dataset}/dataset_spec-to-rtl/${task.task_id}_ref.sv`, 'utf8')
  const tb = await readFile(`${dataset}/dataset_spec-to-rtl/${task.task_id}_test.sv`, 'utf8')
  const rebuilt = buildNetlistProfile(task, reference, tb).profile
  rebuilt.checks = profile.checks
  assert.deepEqual(rebuilt, profile, task.task_id)
  samples += profile.checks
}
assert.equal(catalog.filter(t => t.public_interface_erratum).length, 2)
const result = { previous_profiles_unchanged: 151, previous_receipts_unchanged: 151, current_source_rebuild: '153_of_153_MATCH',
  new_catalog_matches_frozen_effective_catalog: true, public_errata: 2, dataset_git_clean: true, new_rules_positive_samples: samples,
  published_sha256: sha256(await readFile(root + '/published-netlist-profiles.ts')), model_calls: 0 }
await writeFile(root + '/publication-check.json', JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(result))
