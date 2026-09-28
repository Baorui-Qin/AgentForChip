import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Context } from 'file:///D:/deepseek-harness/vendor/cordis/src/index.ts'
import LocalSubprocess from 'file:///D:/deepseek-harness/packages/subprocess/subprocess-local/src/index.ts'
import { VerificationRunner } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/verification.ts'
import { readDoctorConfig } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/doctor.ts'
import { checkNetlist } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p10-netlist.ts'
import { checkSynthesisDirectives } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/p09-auto-policy.ts'
import { sha256 } from 'file:///D:/deepseek-harness/rtl-tools/src/phase1/snapshots.ts'
const root = process.argv[2]; if (!root) throw new Error('New output directory required')
await mkdir(root)
const variants = [
  ['synthesis line', '// synthesis translate_off', '// synthesis translate_on'],
  ['synthesis block', '/* synthesis translate_off */', '/* synthesis translate_on */'],
  ['synthesis short', '// synthesis off', '// synthesis on'],
  ['synopsys line', '// synopsys translate_off', '// synopsys translate_on'],
  ['pragma line', '// pragma translate_off', '// pragma translate_on'],
  ['synthesis uppercase', '// SYNTHESIS TRANSLATE_OFF', '// SYNTHESIS TRANSLATE_ON'],
  ['synthesis newline', '/* synthesis\ntranslate_off */', '/* synthesis\ntranslate_on */'],
  ['synthesis tab', '//\tsynthesis\ttranslate_off', '//\tsynthesis\ttranslate_on'],
  ['ordinary prose', '// explanation synthesis translate_off', '// explanation synthesis translate_on'],
  ['bare directive', '// translate_off', '// translate_on'],
  ['xilinx prefix', '// xilinx translate_off', '// xilinx translate_on'],
  ['synopsys short', '// synopsys off', '// synopsys on'],
  ['pragma short', '// pragma off', '// pragma on'],
  ['bare short', '// off', '// on'],
  ['synplify prefix', '// synplify translate_off', '// synplify translate_on'],
  ['xilinx short', '// xilinx off', '// xilinx on'],
]
const width = variants.length
const source = `module TopModule(input [${width - 1}:0] in, output [${width - 1}:0] out);\n` + variants.map((v, i) => `assign out[${i}]=1'b0\n${v[1]}\n| in[${i}]\n${v[2]}\n;\n`).join('') + 'endmodule\n'
const tb = `\x60timescale 1ns/1ps\nmodule netlist_tb; reg [${width-1}:0] in='1; wire [${width-1}:0] out; integer i,checks=0,mismatches=0; TopModule dut(.in(in),.out(out)); initial begin #101; for(i=0;i<${width};i=i+1) begin checks=checks+1; $display("META index=%0d output=%0b",i,out[i]); if(out[i] !== 1'b1) mismatches=mismatches+1; end $display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches); $finish; end endmodule\n`
const { config } = await readDoctorConfig('D:/AMD/p156-0923-v1/eda-settings.yaml')
config.outputRoot = join(root, 'eda'); await mkdir(config.outputRoot); config.limits.timeoutMs = 240000
const limits = { compileMs: 60000, elaborateMs: 60000, simulationMs: 30000, totalMs: 360000, netlistMs: 120000, maxArtifactBytes: 268435456, artifactPollMs: 100, maxEventBytes: 1048576 }
const ctx = new Context(); await ctx.plugin(LocalSubprocess)
const runner = new VerificationRunner(ctx.subprocess, config, limits), signal = new AbortController().signal
try {
  const rtlTb = tb.replace('PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches', 'Mismatches: %0d in %0d samples",mismatches,checks')
  const assets = { 'rtl/solution.sv': source, 'trusted/tb.sv': rtlTb, 'trusted/clock.xdc': 'create_clock -name virtual_clk -period 5\n' }
  const evaluation = { top: 'TopModule', tbTop: 'netlist_tb', sources: ['rtl/solution.sv', 'trusted/tb.sv'], evaluatorId: 'rt01-meta-probe', seed: 1, defaultTimescale: '1ps/1ps', datasetRevision: 'host-probe-only' }
  const id = await runner.registerDataset(assets, evaluation, { experiment_id: 'rt01-meta-probe', task_id: 'meta-control', sample_id: 0, mode: 'baseline' })
  const result = await runner.verify(id, signal, argv => argv); assert.equal(result.status, 'PASS', result.artifacts)
  const record = JSON.parse(await readFile(join(result.artifacts, 'result.json'), 'utf8'))
  const output = join(root, 'netlist')
  const receipt = await checkNetlist(ctx.subprocess, config, limits, { id: 'meta-probe', spec_sha256: sha256(source), checks: width, testbench: tb }, result.artifacts, record, output, signal)
  assert.equal(receipt.status, 'NETLIST_MISMATCH')
  const log = await readFile(join(output, 'simulation.stdout.log'), 'utf8')
  const observations = new Map([...log.matchAll(/META index=(\d+) output=([01x])/g)].map(match => [Number(match[1]), match[2]]))
  const rows = variants.map(([name, off, on], index) => {
    let rejected = false; try { checkSynthesisDirectives(off + '\n' + on) } catch { rejected = true }
    const output = observations.get(index); assert.ok(output === '0' || output === '1')
    assert.ok(output === '1' || rejected, 'Policy bypass: ' + name)
    return { name, off, on, synthesis_changed_semantics: output === '0', policy_rejected: rejected }
  })
  await writeFile(join(root, 'meta-results.json'), JSON.stringify({ model_calls: 0, original_run: result.artifacts, rows }, null, 2), { flag: 'wx' })
  console.log(JSON.stringify(rows))
} finally { await runner.close(); await ctx.fiber.dispose() }
