import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Context } from 'file:///D:/deepseek-harness/vendor/cordis/src/index.ts'
import LocalSubprocess from 'file:///D:/deepseek-harness/packages/subprocess/subprocess-local/src/index.ts'
import { VerificationRunner } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/verification.ts'
import { readDoctorConfig } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/doctor.ts'
import { checkNetlist, acceptNetlist } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist.ts'
import { netlistProfiles, netlistProfile } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist-profiles.ts'
import { assertAcceptance } from 'file:///D:/deepseek-harness/rtl-tools/phase1/p10/acceptance-audit.mjs'
import { checkAutoSource } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-auto-policy.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'

// This is a keyless Host test, not a dsh application entry or a model-scored campaign.
const root = process.argv[2]
if (!root) throw new Error('Specify a new isolated output directory')
await mkdir(root)
const { config } = await readDoctorConfig('D:/AMD/p156-0923-v1/eda-settings.yaml')
config.outputRoot = join(root, 'eda'); await mkdir(config.outputRoot); config.limits.timeoutMs = 120000
const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 30000, totalMs: 240000, netlistMs: 120000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
const catalog = JSON.parse(await readFile('D:/AMD/p156-0923-cal/preflight-156/catalog.json', 'utf8'))
const ctx = new Context(); await ctx.plugin(LocalSubprocess)
const runner = new VerificationRunner(ctx.subprocess, config, limits), signal = new AbortController().signal, results = []
const initialized = { id: 'initialized-toggle-calibration-v1', spec_sha256: sha256('FPGA q initializes to one; each rising edge toggles q.'), checks: 3,
  testbench: '`timescale 1ns/1ps\nmodule netlist_tb; reg clk=0; wire q; integer checks=0,mismatches=0; TopModule dut(.clk(clk),.q(q)); initial begin #101; if(glbl.GSR !== 1\'b0 || glbl.GTS !== 1\'b0) $fatal(1,"GSR_STARTUP_INVALID"); checks=checks+1; if(q !== 1\'b1) mismatches=mismatches+1; #1; clk=1; #1; checks=checks+1; if(q !== 1\'b0) mismatches=mismatches+1; clk=0; #1; clk=1; #1; checks=checks+1; if(q !== 1\'b1) mismatches=mismatches+1; $display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches); $finish; end endmodule\n' }
const fixtures = [
  ['wire', 'Prob007_wire', 'module TopModule(input in, output out); assign out=in; endmodule', netlistProfiles.Prob007_wire],
  ['not', 'Prob005_notgate', 'module TopModule(input in, output out); assign out=~in; endmodule', netlistProfiles.Prob005_notgate],
  ['reset', 'Prob041_dff8r', 'module TopModule(input clk, reset, input [7:0] d, output reg [7:0] q); always @(posedge clk) if(reset) q<=0; else q<=d; endmodule', netlistProfiles.Prob041_dff8r],
  ['initialized', 'initialized-control', "module TopModule(input clk, output reg q=1'b1); always @(posedge clk) q<=~q; endmodule", initialized],
]
try {
  const attack = await readFile('D:/AMD/redteam-20260923/attack.sv', 'utf8')
  assert.throws(() => checkAutoSource(attack, catalog.find(t => t.task_id === 'Prob007_wire').interface), /RTL_SYNTHESIS_DIRECTIVE_REJECTED/)
  const originalRun = 'D:/AMD/redteam-20260923/eda/run-aB3LzE'
  const original = JSON.parse(await readFile(join(originalRun, 'result.json'), 'utf8'))
  const attackReceipt = await checkNetlist(ctx.subprocess, config, limits, netlistProfiles.Prob007_wire, originalRun, original, join(root, 'original-attack'), signal)
  results.push({ test: 'original-attack', expected: 'NETLIST_MISMATCH', actual: attackReceipt.status, checks: attackReceipt.checks, mismatches: attackReceipt.mismatches })
  console.log(JSON.stringify(results.at(-1)))
  assert.equal(attackReceipt.status, 'NETLIST_MISMATCH')
  for (const [name, taskId, source, profile] of fixtures) {
    const task = catalog.find(t => t.task_id === taskId)
    if (task) { assert.deepEqual(netlistProfile(task), profile); checkAutoSource(source, task.interface) }
    const testbench = profile.testbench.replace(/if\s*\(glbl\.GSR[\s\S]*?\$fatal\(1,\s*"GSR_STARTUP_INVALID"\);/, '')
      .replace('PHASE1_COMPLETE checks=%0d mismatches=%0d", checks, mismatches', 'Mismatches: %0d in %0d samples", mismatches, checks')
      .replace('PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches', 'Mismatches: %0d in %0d samples",mismatches,checks')
    const assets = { 'rtl/solution.sv': source, 'trusted/tb.sv': testbench, 'trusted/clock.xdc': name === 'reset' || name === 'initialized' ? 'create_clock -period 5 [get_ports clk]\n' : 'create_clock -name virtual_clk -period 5\n' }
    const evaluation = { top: 'TopModule', tbTop: 'netlist_tb', sources: ['rtl/solution.sv', 'trusted/tb.sv'], evaluatorId: profile.id + '-rtl-calibration', seed: 1, defaultTimescale: '1ps/1ps', datasetRevision: 'rt01-host-calibration' }
    const id = await runner.registerDataset(assets, evaluation, { experiment_id: 'rt01-calibration', task_id: taskId, sample_id: results.length, mode: 'baseline' })
    const outcome = await runner.verify(id, signal, argv => argv)
    const record = JSON.parse(await readFile(join(outcome.artifacts, 'result.json'), 'utf8'))
    assert.equal(outcome.status, 'PASS', JSON.stringify(outcome))
    const out = join(root, name)
    const receipt = task ? await acceptNetlist(ctx.subprocess, config, limits, task, outcome.artifacts, out, signal)
      : await checkNetlist(ctx.subprocess, config, limits, profile, outcome.artifacts, record, out, signal)
    results.push({ test: name, expected: 'PASS', actual: receipt.status, original_run: outcome.artifacts, acceptance: join(out, 'acceptance.json') })
    console.log(JSON.stringify(results.at(-1))); assert.equal(receipt.status, 'PASS')
    await assertAcceptance({ path: join(out, 'acceptance.json'), status: 'PASS', sha256: sha256(await readFile(join(out, 'acceptance.json'))) }, { task: taskId, source: sha256(source), run: outcome.artifacts })
    // The negative oracle is a Host-only control, never an enabled task profile.
    const wrong = { ...profile, id: profile.id + '-negative-control', testbench: profile.testbench.replace(/if\((out|q) !==/, 'if($1 ===') }
    const negative = await checkNetlist(ctx.subprocess, config, limits, wrong, outcome.artifacts, record, join(root, name + '-negative'), signal)
    results.push({ test: name + '-negative', expected: 'NETLIST_MISMATCH', actual: negative.status, checks: negative.checks, mismatches: negative.mismatches })
    console.log(JSON.stringify(results.at(-1))); assert.equal(negative.status, 'NETLIST_MISMATCH')
  }
} finally {
  await runner.close(); await ctx.fiber.dispose()
  await writeFile(join(root, 'calibration-results.json'), JSON.stringify({ model_calls: 0, workers: 1, limits, results }, null, 2))
}
