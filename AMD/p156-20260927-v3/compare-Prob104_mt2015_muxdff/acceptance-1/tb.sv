`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13
/*
	Midterm 2015 Question 5a. Build a flip-flop with a 2-to-1 mux before it.
*/


module stimulus_gen (
	input clk,
	output logic L,
	output logic r_in,
	output logic q_in
);
integer netlist_random_seed=1;


	always @(posedge clk, negedge clk)
		{L, r_in, q_in} <= $random(netlist_random_seed) % 8;
	
	initial begin #101;
		repeat(100) @(posedge clk);
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input L,
  input q_in,
  input r_in,
  output reg Q
);

  initial Q=0;
  always @(posedge clk)
    Q <= L ? r_in : q_in;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_L; wire drive_L; assign #0.1 drive_L=raw_L;
wire raw_q_in; wire drive_q_in; assign #0.1 drive_q_in=raw_q_in;
wire raw_r_in; wire drive_r_in; assign #0.1 drive_r_in=raw_r_in;
wire gold_Q, dut_Q, raw_dut_Q; reg seen_Q='0;
stimulus_gen stim1(.clk(clk),.L(raw_L),.r_in(raw_r_in),.q_in(raw_q_in));
oracle_RefModule gold(.clk(clk),.L(drive_L),.q_in(drive_q_in),.r_in(drive_r_in),.Q(gold_Q));
TopModule dut(.clk(clk),.L(drive_L),.q_in(drive_q_in),.r_in(drive_r_in),.Q(raw_dut_Q));
assign dut_Q=raw_dut_Q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Q === 1'b0 || gold_Q === 1'b1) begin
known=1; seen_Q=1'b1;
if(dut_Q !== gold_Q) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_Q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Q");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
