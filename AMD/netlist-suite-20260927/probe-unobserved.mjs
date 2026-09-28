import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Context } from '../../deepseek-harness/vendor/cordis/src/index.ts'
import LocalSubprocess from '../../deepseek-harness/packages/subprocess/subprocess-local/src/index.ts'
import { readDoctorConfig } from '../../deepseek-harness/rtl-tools/src/phase1/doctor.ts'
import { checkNetlist } from '../../deepseek-harness/rtl-tools/src/phase1/p10-netlist.ts'
import { sha256 } from '../../deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
import { assertAcceptance } from '../../deepseek-harness/rtl-tools/phase1/p10/acceptance-audit.mjs'

const root = 'D:/AMD/netlist-suite-20260927/unobserved-control'
await mkdir(root)
const batch = 'D:/AMD/netlist-suite-20260927/full-v3'
const results = JSON.parse(await readFile(join(batch, 'results.json'), 'utf8'))
const row = results.rows.find(r => r.task_id === 'Prob001_zero')
const profile = JSON.parse(await readFile(join(batch, row.task_id, 'profile.json'), 'utf8'))
profile.id += ':unobserved-control'
const original = profile.testbench
profile.testbench = original.replace('final begin', 'final begin seen_zero=0;')
assert.notEqual(profile.testbench, original)
const record = JSON.parse(await readFile(join(row.original_run, 'result.json'), 'utf8'))
const { config } = await readDoctorConfig('D:/AMD/p156-0923-v1/eda-settings.yaml')
config.limits.threads = 4
const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 120000, totalMs: 900000, netlistMs: 240000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
const ctx = new Context(); await ctx.plugin(LocalSubprocess)
try {
  const output = join(root, 'netlist')
  const receipt = await checkNetlist(ctx.subprocess, config, limits, profile, row.original_run, record, output, new AbortController().signal)
  assert.equal(receipt.status, 'NETLIST_EVIDENCE_MISSING')
  assert.equal(receipt.mismatches, 0)
  const previous = results.rows.find(r => r.task_id === 'Prob094_gatesv')
  const previousRecord = JSON.parse(await readFile(join(previous.original_run, 'result.json'), 'utf8'))
  await assert.rejects(assertAcceptance(previous.positive, { task: previous.task_id, source: previousRecord.final_source_sha256, run: previous.original_run }), /P10_ACCEPTANCE_INVALID/)
  const result = { model_calls: 0, status: 'PASS', observed_status: receipt.status, zero_mismatches_did_not_authorize_pass: true, old_unobserved_receipt_rejected: true, receipt: join(output, 'acceptance.json'), sha256: sha256(await readFile(join(output, 'acceptance.json'))) }
  await writeFile(join(root, 'result.json'), JSON.stringify(result, null, 2), { flag: 'wx' })
  process.stdout.write(JSON.stringify(result) + '\n')
} finally { await ctx.fiber.dispose() }
