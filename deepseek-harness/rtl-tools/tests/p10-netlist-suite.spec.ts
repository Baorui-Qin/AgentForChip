import { expect, it } from 'vitest'
import { buildNetlistProfile } from '../src/phase1/p10-netlist-suite.ts'
import type { P10Task } from '../src/phase1/p10-dataset.ts'
import { sha256 } from '../src/phase1/snapshots.ts'

function fixture() {
  const reference = 'module RefModule(input in, output out); assign out=in; endmodule\n'
  const testbench = '`timescale 1 ps/1 ps\nmodule stimulus_gen(input clk, output reg in, input out_dut, input tb_match, output reg[511:0] wavedrom_title);\ninitial begin in=0; @(posedge clk) in<=1; #1 $finish; end\nendmodule\nmodule tb(); endmodule\n'
  const task = { task_id: 'Prob004_vector2', spec: 'wire', assets: {
    'dataset_spec-to-rtl/Prob004_vector2_ref.sv': sha256(reference), 'dataset_spec-to-rtl/Prob004_vector2_test.sv': sha256(testbench),
  }, interface: { top: 'TopModule', ports: [{ name: 'in', direction: 'input', width: 1 }, { name: 'out', direction: 'output', width: 1 }] },
  interface_error: null, clock: { kind: 'virtual', port: null, period_ns: 5 } } as P10Task
  return { task, reference, testbench }
}

it('builds a deterministic reference-only stimulus with startup, data hold and settled sampling', () => {
  const f = fixture(), first = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(first).toEqual(buildNetlistProfile(f.task, f.reference, f.testbench))
  expect(first.profile.testbench).toContain('initial begin #101;')
  expect(first.profile.testbench).toContain('assign #0.1 drive_in=raw_in;')
  expect(first.profile.testbench).toContain('#0.5; sample(); #4.3; sample();')
  expect(first.profile.testbench).toContain('.out_dut(gold_out)')
  expect(first.profile.testbench).toContain(".tb_match(1'b1)")
  expect(first.profile.testbench).toContain("if(dut_out !== gold_out)")
  expect(first.profile.testbench).toContain('NETLIST_OUTPUT_UNOBSERVED:out')
  expect(first.profile.provenance?.assets).toEqual(f.task.assets)
  expect(first.positive).toContain('module TopModule(')
  expect(first.profile.testbench).not.toContain('module TopModule(')
})

it('faults the DUT output without inverting the expected value or changing stimulus feedback', () => {
  const f = fixture(), { profile, negative } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(negative.testbench).toBe(profile.testbench.replace('assign dut_out=raw_dut_out;', 'assign dut_out=~raw_dut_out;'))
  expect(negative.testbench).toContain('.out_dut(gold_out)')
})

it.each(['reference', 'testbench'] as const)('rejects changed %s bytes', key => {
  const f = fixture(); f[key] += '// changed\n'
  expect(() => buildNetlistProfile(f.task, f.reference, f.testbench)).toThrow('NETLIST_DATASET_CHANGED')
})

it('does not derive a missing public interface from the hidden reference', () => {
  const f = fixture(); f.task.interface = null; f.task.interface_error = 'PUBLIC_INTERFACE_CONFLICT'
  expect(() => buildNetlistProfile(f.task, f.reference, f.testbench)).toThrow('NETLIST_INTERFACE_UNSUPPORTED')
})

it('rejects unfamiliar stimulus ports instead of silently disconnecting them', () => {
  const f = fixture(); f.testbench = f.testbench.replace('input out_dut', 'input secret_control')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  expect(() => buildNetlistProfile(f.task, f.reference, f.testbench)).toThrow('NETLIST_STIMULUS_PORT_UNSUPPORTED')
})

it('does not rewrite apparent initial blocks inside comments or strings', () => {
  const f = fixture(); f.testbench = f.testbench.replace('in=0;', '/* initial begin */ $display("initial begin RefModule"); in=0;')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain('/* initial begin */ $display("initial begin RefModule");')
  expect(profile.testbench.match(/initial begin #101;/g)).toHaveLength(2)
})

it('retains stimulus initializers and integer metadata while parsing only their port types', () => {
  const f = fixture(); f.testbench = f.testbench.replace('output reg in,', 'output reg in=0, output int wavedrom_hide_after_time,')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain('output reg in=0, output int wavedrom_hide_after_time,')
  expect(profile.testbench).toContain('.wavedrom_hide_after_time()')
})

it('does not guess a stimulus parameter outside the reviewed gshare specialization', () => {
  const f = fixture(); f.testbench = f.testbench.replace('stimulus_gen(', 'stimulus_gen #(parameter N=7)(')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  expect(() => buildNetlistProfile(f.task, f.reference, f.testbench)).toThrow('NETLIST_STIMULUS_UNSUPPORTED')
})

it('keeps leading procedural declarations before the inserted startup statement', () => {
  const f = fixture(); f.testbench = f.testbench.replace('initial begin in=0;', 'initial begin integer count; count=0; in=0;')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toMatch(/initial begin #101; begin\s+integer count;/)
  expect(profile.testbench).toMatch(/\$finish;\s+end\s+end/)
})

it('does not delay a stimulus-generated physical clock with the data inputs', () => {
  const f = fixture(); f.task.interface!.ports.push({ name: 'clock', direction: 'input', width: 1 })
  f.task.clock = { kind: 'physical', port: 'clock', period_ns: 5 }
  f.reference = f.reference.replace('input in,', 'input in, input clock,')
  f.testbench = f.testbench.replace('output reg in,', 'output reg in, output logic clock=0,')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_ref.sv'] = sha256(f.reference)
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  expect(buildNetlistProfile(f.task, f.reference, f.testbench).profile.testbench).toContain('assign drive_clock=raw_clock;')
})

it('checks XOR-feedback transitions from either initial state without importing the hidden initial-zero requirement', () => {
  const f = fixture(); f.task.task_id = 'Prob053_m2014_q4d'
  f.task.assets = { 'dataset_spec-to-rtl/Prob053_m2014_q4d_ref.sv': sha256(f.reference), 'dataset_spec-to-rtl/Prob053_m2014_q4d_test.sv': sha256(f.testbench) }
  const { profile, negative } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain('expected=dut_out;')
  expect(profile.testbench).toContain('expected=expected ^ in;')
  expect(profile.testbench).not.toContain('oracle_RefModule')
  expect(profile.provenance?.negative_control).toBe('stuck_zero')
  expect(negative.testbench).toBe(profile.testbench.replace('assign dut_out=raw_dut_out;', "assign dut_out=1'b0;"))
})

it('masks only unknown reference bits and requires every output bit to become observable', () => {
  const f = fixture(); f.task.interface!.ports[1]!.width = 8
  f.testbench = f.testbench.replace('input out_dut', 'input [7:0] out_dut')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain("gold_out[b] === 1'b0 || gold_out[b] === 1'b1")
  expect(profile.testbench).toContain('if(dut_out[b] !== gold_out[b]) bad=1;')
  expect(profile.testbench).toContain("if((&seen_out) !== 1'b1) $error")
  expect(profile.testbench).toContain('if(known) begin checks=checks+1;')
})

it('holds latch data after its enable transition and records this protocol specialization', () => {
  const f = fixture(); f.task.task_id = 'Prob028_m2014_q4a'
  f.task.interface!.ports.push({ name: 'ena', direction: 'input', width: 1 })
  f.testbench = f.testbench.replace('output reg in,', 'output reg in, output reg ena,')
  f.task.assets = { 'dataset_spec-to-rtl/Prob028_m2014_q4a_ref.sv': sha256(f.reference), 'dataset_spec-to-rtl/Prob028_m2014_q4a_test.sv': sha256(f.testbench) }
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain('assign drive_ena=raw_ena;')
  expect(profile.testbench).toContain('assign #0.1 drive_in=raw_in;')
  expect(profile.provenance?.undelayed_control_ports).toEqual(['ena'])
})

it('seeds stimulus randomness independently of the elaborated DUT hierarchy', () => {
  const f = fixture(); f.testbench = f.testbench.replace('in=0;', 'in=$random; in=$urandom; in=$urandom_range(0,1);')
  f.task.assets['dataset_spec-to-rtl/Prob004_vector2_test.sv'] = sha256(f.testbench)
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain('integer netlist_random_seed=1;')
  expect(profile.testbench.indexOf('integer netlist_random_seed=1;')).toBeLessThan(profile.testbench.indexOf('initial begin'))
  expect(profile.testbench).toContain('in=$random(netlist_random_seed);')
  expect(profile.testbench).toContain('netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin')
})

it('exempts only the two publicly unspecified Prob094 boundary bits from observation', () => {
  const f = fixture(); f.task.task_id = 'Prob094_gatesv'
  f.task.interface!.ports[1] = { name: 'out_both', direction: 'output', width: 4 }
  f.task.interface!.ports.push({ name: 'out_any', direction: 'output', width: 4 }, { name: 'out_different', direction: 'output', width: 4 })
  f.testbench = f.testbench.replace('input out_dut', 'input [3:0] out_both_dut')
  f.task.assets = { 'dataset_spec-to-rtl/Prob094_gatesv_ref.sv': sha256(f.reference), 'dataset_spec-to-rtl/Prob094_gatesv_test.sv': sha256(f.testbench) }
  const { profile } = buildNetlistProfile(f.task, f.reference, f.testbench)
  expect(profile.testbench).toContain("seen_out_both=4'b1000;")
  expect(profile.testbench).toContain("seen_out_any=4'b0001;")
  expect(profile.testbench).toContain("seen_out_different='0;")
  expect(profile.provenance?.public_dont_care_bits).toEqual({ out_both: [3], out_any: [0] })
})
