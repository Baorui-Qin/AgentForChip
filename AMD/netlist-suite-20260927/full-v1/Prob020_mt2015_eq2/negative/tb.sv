`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13
/*
	Midterm 2015 Question 1k. 2-bit equality comparator.
*/


module stimulus_gen (
	input clk,
	output logic [1:0] A,
	output logic [1:0] B
);

	always @(posedge clk, negedge clk)
		{A, B} <= $random % 16;
	
	initial begin #101;
		repeat(1000) @(negedge clk);
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [1:0] A,
  input [1:0] B,
  output z
);

  assign z = A[1:0]==B[1:0];

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [1:0] raw_A; wire [1:0] drive_A; assign #0.1 drive_A=raw_A;
wire [1:0] raw_B; wire [1:0] drive_B; assign #0.1 drive_B=raw_B;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.A(raw_A),.B(raw_B));
oracle_RefModule gold(.A(drive_A),.B(drive_B),.z(gold_z));
TopModule dut(.A(drive_A),.B(drive_B),.z(raw_dut_z));
assign dut_z=~raw_dut_z;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_z === 1'b0 || gold_z === 1'b1) begin
known=1; seen_z=1'b1;
if(dut_z !== gold_z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.2; sample(); #4.6; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_z) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:z");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
