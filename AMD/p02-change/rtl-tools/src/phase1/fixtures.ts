/** Fixed handwritten development fixtures, never model-supplied source. @module rtl-tools/phase1/fixtures */
const counter = `module counter(input wire clk, input wire rst, output reg [3:0] count);
always @(posedge clk) if (rst) count <= 0; else count <= count + 1;
endmodule
`
const tb = `\`timescale 1ns/1ps
module phase1_tb;
reg clk = 0;
reg rst = 1;
wire [3:0] count;
reg [3:0] expected = 0;
integer checks = 0;
integer mismatches = 0;
counter dut(.clk(clk), .rst(rst), .count(count));
always #2.5 clk = ~clk;
initial begin
  repeat (20) begin
    @(posedge clk);
    if (rst) expected = 0; else expected = expected + 1;
    #0.1;
    checks = checks + 1;
    if (count !== expected) mismatches = mismatches + 1;
    @(negedge clk);
    rst = 0;
  end
  $display("PHASE1_COMPLETE checks=%0d mismatches=%0d", checks, mismatches);
  $finish;
end
endmodule
`
/** The fixture id selects complete host-owned bytes, not a caller-controlled filename. */
export const fixtureIds = ['counter', 'syntax', 'missing-module', 'functional', 'synthesis-only'] as const
/** Fixed test case identifier. */
export type FixtureId = typeof fixtureIds[number]
/** First expected failing stage; the counter completes all four. */
export const expectedStage: Record<FixtureId, string | null> = { counter: null, syntax: 'compile', 'missing-module': 'elaborate', functional: 'simulation', 'synthesis-only': 'synthesis' }
/** Return independent copies of fixed development assets. @param id - host-selected fixture. @returns source and evaluator bytes with portable relative names. */
export function fixtureFiles(id: FixtureId): Record<string, string> {
  const sources: Record<FixtureId, string> = {
    counter,
    syntax: 'module counter(input clk, input rst, output [3:0] count); assign count = ; endmodule\n',
    'missing-module': 'module counter(input clk, input rst, output [3:0] count); missing_cell u(.q(count)); endmodule\n',
    functional: counter.replace('count + 1', 'count + 2'),
    // A deliberate synthesis-only fault, not a natural generation benchmark.
    'synthesis-only': counter.replace('endmodule', '`ifdef SYNTHESIS\nmissing_synthesis_cell broken();\n`endif\nendmodule'),
  }
  if (!Object.hasOwn(sources, id)) throw new Error('Unknown trusted fixture')
  return { 'rtl/solution.sv': sources[id], 'trusted/tb.sv': tb, 'trusted/clock.xdc': 'create_clock -name clk -period 5 [get_ports clk]\n' }
}
