/** Frozen internal tasks. Scoring sources never enter public model context. @module rtl-tools/phase1/p09-tasks */
import type { PublicTask } from './p09-context.ts'
import type { DUTInterface } from './candidates.ts'
import type { Evaluation } from './snapshots.ts'
import { sha256 } from './snapshots.ts'

/** Closed catalog, not model-controlled paths. */
export const taskIds = ['enable_counter', 'rising_edge', 'sequence_101', 'signed_saturating_add', 'ready_valid_slot'] as const
/** Trusted catalog identifier. */
export type TaskId = typeof taskIds[number]
/** Private calibration and public task are deliberately separate. */
export interface TaskSpec { public: PublicTask; good: string; bad: string; assets: Record<string, string>; evaluation: Evaluation; hash: string }
const input = (name: string, width = 1, signed = false) => ({ name, direction: 'input' as const, width, signed })
const output = (name: string, width = 1, signed = false) => ({ name, direction: 'output' as const, width, signed })
const clock = [input('clk'), input('rst')]
const common = '\nUse one SystemVerilog module with the exact interface. All state updates on rising clk. rst is synchronous, active high, and has priority. No other modules, file I/O, delays, or simulation-only behavior in the DUT.'
const tick = '#5; clk=1; #1;'
const endTick = '#4; clk=0;'
const check = (condition: string) => 'checks=checks+1; if (' + condition + ') mismatches=mismatches+1;'
function tb(declarations: string, top: string, connections: string, body: string) {
  return String.fromCharCode(96) + 'timescale 1ns/1ps\nmodule tb;\nreg clk=0, rst=1;\ninteger checks=0, mismatches=0, i;\n' + declarations + '\n' + top + ' dut(' + connections + ');\ninitial begin\n' + body + '\n$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish;\nend\ninitial begin #1000000; $display("TIMEOUT"); $finish; end\nendmodule\n'
}
/** Materialize immutable scoring bytes. @param id - fixed catalog id. @returns public/private task and complete configuration hash. */
export function taskSpec(id: TaskId): TaskSpec {
  let ports: DUTInterface['ports'], spec: string, good: string, bad: string, testbench: string
  switch (id) {
    case 'enable_counter':
      ports = [...clock, input('en'), output('q', 4)]
      spec = 'A 4-bit counter: reset q to zero; otherwise increment modulo 16 when en=1 and hold when en=0.'
      good = 'module enable_counter(input clk, rst, en, output reg [3:0] q);\nalways @(posedge clk) if(rst) q<=0; else if(en) q<=q+1;\nendmodule\n'
      bad = good.replace('q+1', 'q+2')
      testbench = tb('reg en=0; reg [3:0] expected=0; wire [3:0] q;', id, '.clk(clk),.rst(rst),.en(en),.q(q)',
        'for(i=0;i<128;i=i+1) begin\nrst=(i==0 || i==63); en=(i%3!=0);\nif(rst) expected=0; else if(en) expected=expected+1;\n' + tick + check('q !== expected') + endTick + '\nend')
      break
    case 'rising_edge':
      ports = [...clock, input('din'), output('pulse')]
      spec = 'A registered rising-edge detector. Reset clears previous input and pulse. Otherwise pulse becomes din AND NOT the previous sampled din, and previous input becomes din. Consecutive high samples must not repeat the pulse.'
      good = 'module rising_edge(input clk, rst, din, output reg pulse);\nreg previous;\nalways @(posedge clk) if(rst) begin previous<=0; pulse<=0; end else begin pulse<=din & ~previous; previous<=din; end\nendmodule\n'
      bad = good.replace('din & ~previous', 'din')
      testbench = tb('reg din=0, previous=0, expected=0; wire pulse;', id, '.clk(clk),.rst(rst),.din(din),.pulse(pulse)',
        'for(i=0;i<128;i=i+1) begin\nrst=(i==0 || i==63); din=((i%7)<4);\nif(rst) begin previous=0; expected=0; end else begin expected=din & ~previous; previous=din; end\n' + tick + check('pulse !== expected') + endTick + '\nend')
      break
    case 'sequence_101':
      ports = [...clock, input('din'), output('hit')]
      spec = 'Detect overlapping serial 101. Each non-reset rising edge consumes din; hit is high for the resulting cycle exactly when the last three non-reset samples are 101. Reset discards history and clears hit. Input 10101 produces two hits.'
      good = "module sequence_101(input clk, rst, din, output reg hit);\nreg [1:0] history,valid;\nalways @(posedge clk) if(rst) begin history<=0; valid<=0; hit<=0; end else begin hit<=valid[1] && history==2'b10 && din; history<={history[0],din}; valid<={valid[0],1'b1}; end\nendmodule\n"
      bad = good.replace("history==2'b10", "history==2'b11")
      testbench = tb('reg din=0, expected=0; reg [2:0] history=0; integer valid=0; wire hit;', id, '.clk(clk),.rst(rst),.din(din),.hit(hit)',
        "for(i=0;i<256;i=i+1) begin\nrst=(i==0 || i==127); din=(i%2==0 || i%11==0);\nif(rst) begin valid=0; history=0; expected=0; end else begin history={history[1:0],din}; valid=valid+1; expected=(valid>=3 && history==3'b101); end\n" + tick + check('hit !== expected') + endTick + '\nend')
      break
    case 'signed_saturating_add':
      ports = [...clock, input('a', 8, true), input('b', 8, true), output('sum', 8, true)]
      spec = 'Register the mathematical sum of signed 8-bit a and b each rising edge, clamped to [-128,127]. Reset sum to zero. No enable or extra pipeline latency.'
      good = 'module signed_saturating_add(input clk,rst,input signed [7:0] a,b,output reg signed [7:0] sum);\nwire signed [8:0] extended={a[7],a}+{b[7],b};\nalways @(posedge clk) if(rst) sum<=0; else if(extended>127) sum<=127; else if(extended< -128) sum<= -128; else sum<=extended[7:0];\nendmodule\n'
      bad = good.replace('sum<=127', 'sum<=126')
      testbench = tb('reg signed [7:0] a=0,b=0; wire signed [7:0] sum; integer expected=0;', id, '.clk(clk),.rst(rst),.a(a),.b(b),.sum(sum)',
        'for(i=0;i<65536;i=i+1) begin\nrst=(i==0 || i==32768); a=i/256-128; b=i%256-128;\nexpected=$signed(a)+$signed(b); if(expected>127) expected=127; if(expected< -128) expected= -128; if(rst) expected=0;\n' + tick + check('$signed(sum) !== expected') + endTick + '\nend')
      break
    case 'ready_valid_slot':
      ports = [...clock, input('in_valid'), input('in_data', 8), output('in_ready'), output('out_valid'), output('out_data', 8), input('out_ready')]
      spec = 'A single registered 8-bit ready/valid slot without empty-slot combinational bypass. out_valid indicates occupied state; out_data is the stored byte, unspecified when invalid. in_ready = !occupied || out_ready. A rising edge accepts input when in_valid && in_ready and consumes output when out_valid && out_ready; simultaneous consume/accept replaces the byte without a bubble. With output stalled, valid data remains stable. Reset empties the slot and clears stored data.'
      good = 'module ready_valid_slot(input clk,rst,in_valid,input [7:0] in_data,output in_ready,output out_valid,output [7:0] out_data,input out_ready);\nreg full; reg [7:0] data;\nassign in_ready=~full|out_ready; assign out_valid=full; assign out_data=data;\nalways @(posedge clk) if(rst) begin full<=0; data<=0; end else if(in_ready) begin full<=in_valid; if(in_valid) data<=in_data; end\nendmodule\n'
      bad = good.replace('~full|out_ready', '~full')
      testbench = tb('reg in_valid=0,out_ready=0; reg [7:0] in_data=0,expected_data=0; reg occupied=0; wire in_ready,out_valid; wire [7:0] out_data; reg accept;', id, '.clk(clk),.rst(rst),.in_valid(in_valid),.in_data(in_data),.in_ready(in_ready),.out_valid(out_valid),.out_data(out_data),.out_ready(out_ready)',
        'for(i=0;i<256;i=i+1) begin\nrst=(i==0 || i==127); in_valid=(i%5!=0); out_ready=(i%7>=3); in_data=(i*37)%256;\n#1; if(i>0) begin ' + check('in_ready !== (!occupied || out_ready)') + ' end\naccept=(!occupied || out_ready); if(rst) begin occupied=0; expected_data=0; end else if(accept) begin occupied=in_valid; if(in_valid) expected_data=in_data; end\n' + tick + check('out_valid !== occupied || (occupied && out_data !== expected_data)') + endTick + '\nend')
      break
  }
  const publicTask: PublicTask = { id, spec: spec + common, interface: { top: id, ports }, constraints: 'SystemVerilog; xczu3eg-sbva484-1-e; post-synthesis clock clk at 5 ns; simulation seed 1.' }
  const assets = { 'trusted/tb.sv': testbench, 'trusted/clock.xdc': 'create_clock -period 5.000 [get_ports clk]\n' }
  const evaluation: Evaluation = { top: id, tbTop: 'tb', language: 'systemverilog', sources: [{ path: 'trusted/tb.sv', role: 'testbench' }, { path: 'rtl/solution.sv', role: 'dut' }], evaluatorId: 'p09-internal-2', seed: 1, datasetRevision: 'p09-five-2' }
  return { public: publicTask, good, bad, assets, evaluation, hash: sha256(JSON.stringify({ publicTask, good, bad, assets, evaluation })) }
}
