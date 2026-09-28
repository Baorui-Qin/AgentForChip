`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic in,
	output logic [1:0] state
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk, negedge clk) begin
			in <= $random(netlist_random_seed);
			state <= $random(netlist_random_seed);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input in,
  input [1:0] state,
  output reg [1:0] next_state,
  output out
);

  parameter A=0, B=1, C=2, D=3;

  always_comb begin
    case (state)
      A: next_state = in ? B : A;
      B: next_state = in ? B : C;
      C: next_state = in ? D : A;
      D: next_state = in ? B : C;
    endcase
  end

  assign out = (state==D);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;
wire [1:0] raw_state; wire [1:0] drive_state; assign #0.1 drive_state=raw_state;
wire [1:0] gold_next_state, dut_next_state, raw_dut_next_state; reg [1:0] seen_next_state='0;
wire gold_out, dut_out, raw_dut_out; reg seen_out='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.state(raw_state));
oracle_RefModule gold(.in(drive_in),.state(drive_state),.next_state(gold_next_state),.out(gold_out));
TopModule dut(.in(drive_in),.state(drive_state),.next_state(raw_dut_next_state),.out(raw_dut_out));
assign dut_next_state=raw_dut_next_state;
assign dut_out=raw_dut_out;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<2;b=b+1) begin
if(gold_next_state[b] === 1'b0 || gold_next_state[b] === 1'b1) begin
known=1; seen_next_state[b]=1'b1;
if(dut_next_state[b] !== gold_next_state[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out === 1'b0 || gold_out === 1'b1) begin
known=1; seen_out=1'b1;
if(dut_out !== gold_out) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_next_state) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:next_state");
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
