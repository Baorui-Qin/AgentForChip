import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Context } from 'file:///D:/deepseek-harness/vendor/cordis/src/index.ts'
import LocalSubprocess from 'file:///D:/deepseek-harness/packages/subprocess/subprocess-local/src/index.ts'
import { readDoctorConfig } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/doctor.ts'
import { checkNetlist } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist.ts'
import { netlistProfiles } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist-profiles.ts'
import { assertAcceptance, auditComparison } from 'file:///D:/deepseek-harness/rtl-tools/phase1/p10/acceptance-audit.mjs'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'

const root = process.argv[2]
if (!root) throw new Error('Specify a new isolated output directory')
await mkdir(root)
const previous = 'D:/AMD/redteam-20260927/acceptance-v2', repo = 'D:/deepseek-harness'
const { config } = await readDoctorConfig('D:/AMD/p156-0923-v1/eda-settings.yaml')
const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 30000, totalMs: 240000, netlistMs: 120000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
const files = {}
for (const file of ['rtl-tools/src/phase1/p09-auto-policy.ts', 'rtl-tools/src/phase1/p10-model.ts', 'rtl-tools/src/phase1/p10-netlist.ts', 'rtl-tools/src/phase1/p10-netlist-profiles.ts',
  'rtl-tools/src/phase1/verification.ts', 'rtl-tools/src/phase1/records.ts', 'rtl-tools/src/phase1/snapshots.ts', 'rtl-tools/src/phase1/simulation-evidence.ts', 'rtl-tools/src/phase1/candidates.ts',
  'rtl-tools/src/phase1/artifact-manifest.ts', 'rtl-tools/src/process.ts', 'rtl-tools/src/synthesis.ts', 'rtl-tools/src/vivado-parser.ts',
  'rtl-tools/phase1/p10/acceptance-audit.mjs', 'rtl-tools/phase1/p10/generation-stability.mjs', 'rtl-tools/phase1/p10/audit-p10-campaign.mjs', 'rtl-tools/phase1/p10/prepare-stability.ps1']) {
  const path = join(repo, file); files[path] = sha256(await readFile(path))
}
for (const path of ['D:/AMD/redteam-20260927/rt01-final-check.mjs', 'D:/AMD/p156-0923-v1/eda-settings.yaml', 'D:/AMD/redteam-20260923/attack.sv']) files[path] = sha256(await readFile(path))
await writeFile(join(root, 'validation-freeze.json'), JSON.stringify({ protocol: 'p10-netlist-1', model_calls: 0, workers: 1, limits, files }, null, 2), { flag: 'wx' })
const ctx = new Context(); await ctx.plugin(LocalSubprocess)
const results = []
try {
  for (const name of ['original-attack', 'wire', 'not', 'reset', 'initialized']) {
    const prior = JSON.parse(await readFile(join(previous, name, 'acceptance.json'), 'utf8'))
    const record = JSON.parse(await readFile(join(prior.original_run, 'result.json'), 'utf8'))
    const profile = netlistProfiles[record.task_id] ?? prior.profile
    const output = join(root, name)
    const receipt = await checkNetlist(ctx.subprocess, config, limits, profile, prior.original_run, record, output, new AbortController().signal)
    const ref = { path: join(output, 'acceptance.json'), sha256: sha256(await readFile(join(output, 'acceptance.json'))), status: receipt.status, run: prior.original_run }
    const expected = name === 'original-attack' ? 'NETLIST_MISMATCH' : 'PASS'
    assert.equal(receipt.status, expected)
    const binding = { task: record.task_id, source: record.final_source_sha256, run: prior.original_run }
    if (expected === 'PASS') {
      await assertAcceptance(ref, binding)
      await assert.rejects(assertAcceptance({ ...ref, sha256: '0'.repeat(64) }, binding))
      await assert.rejects(assertAcceptance(ref, { ...binding, task: 'wrong-task' }))
      await assert.rejects(auditComparison({ status: 'VERIFIED' }, 'p10-netlist-1'))
    }
    results.push({ test: name, expected, actual: receipt.status, checks: receipt.checks, mismatches: receipt.mismatches, duration_ms: receipt.duration_ms, ...ref })
    console.log(JSON.stringify(results.at(-1)))
    if (expected === 'PASS') {
      const negativeProfile = { ...profile, id: profile.id + '-negative-control', testbench: profile.testbench.replace(/if\((out|q) !==/, 'if($1 ===') }
      const negativeOutput = join(root, name + '-negative')
      const negative = await checkNetlist(ctx.subprocess, config, limits, negativeProfile, prior.original_run, record, negativeOutput, new AbortController().signal)
      assert.equal(negative.status, 'NETLIST_MISMATCH')
      results.push({ test: name + '-negative', expected: 'NETLIST_MISMATCH', actual: negative.status, checks: negative.checks, mismatches: negative.mismatches, path: join(negativeOutput, 'acceptance.json') })
      console.log(JSON.stringify(results.at(-1)))
    }
  }
  for (const [path, expected] of Object.entries(files)) assert.equal(sha256(await readFile(path)), expected, 'Frozen source changed: ' + path)
} finally {
  await ctx.fiber.dispose()
  await writeFile(join(root, 'validation-results.json'), JSON.stringify({ protocol: 'p10-netlist-1', model_calls: 0, workers: 1, synthesized_inputs_reused_read_only: true, results }, null, 2), { flag: 'wx' })
}
