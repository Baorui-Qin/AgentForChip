`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg reset
);
integer netlist_random_seed=1;


	
	initial begin #101;
		repeat(100) @(negedge clk) begin
			reset <= !($random(netlist_random_seed) & 31);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  output shift_ena
);

  parameter B0=0, B1=1, B2=2, B3=3, Done=4;

  reg [2:0] state, next;

  always_comb begin
    case (state)
      B0: next = B1;
      B1: next = B2;
      B2: next = B3;
      B3: next = Done;
      Done: next = Done;
    endcase
  end

  always @(posedge clk)
    if (reset) state <= B0;
    else state <= next;

  assign shift_ena = (state == B0 || state == B1 || state == B2 || state == B3);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire gold_shift_ena, dut_shift_ena, raw_dut_shift_ena; reg seen_shift_ena='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.shift_ena(gold_shift_ena));
TopModule dut(.clk(clk),.reset(drive_reset),.shift_ena(raw_dut_shift_ena));
assign dut_shift_ena=raw_dut_shift_ena;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_shift_ena === 1'b0 || gold_shift_ena === 1'b1) begin
known=1; seen_shift_ena=1'b1;
if(dut_shift_ena !== gold_shift_ena) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_shift_ena) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:shift_ena");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
