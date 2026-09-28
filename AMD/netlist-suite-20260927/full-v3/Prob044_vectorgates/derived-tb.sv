`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg [2:0] a, b,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable
);
integer netlist_random_seed=1;



// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	initial begin #101; begin
		int count; count = 6'h38;
		{b, a} <= 6'b0;
		@(negedge clk);
		wavedrom_start();
		repeat(30) @(posedge clk)
			{b, a} <= count++;		
		wavedrom_stop();
		
		repeat(200) @(posedge clk, negedge clk)
			{b,a} <= $random(netlist_random_seed);
		
		#1 $finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [2:0] a,
  input [2:0] b,
  output [2:0] out_or_bitwise,
  output out_or_logical,
  output [5:0] out_not
);

  assign out_or_bitwise = a | b;
  assign out_or_logical = a || b;
  assign out_not = {~b,~a};

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [2:0] raw_a; wire [2:0] drive_a; assign #0.1 drive_a=raw_a;
wire [2:0] raw_b; wire [2:0] drive_b; assign #0.1 drive_b=raw_b;
wire [2:0] gold_out_or_bitwise, dut_out_or_bitwise, raw_dut_out_or_bitwise; reg [2:0] seen_out_or_bitwise='0;
wire gold_out_or_logical, dut_out_or_logical, raw_dut_out_or_logical; reg seen_out_or_logical='0;
wire [5:0] gold_out_not, dut_out_not, raw_dut_out_not; reg [5:0] seen_out_not='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.out_or_bitwise(gold_out_or_bitwise),.out_or_logical(gold_out_or_logical),.out_not(gold_out_not));
TopModule dut(.a(drive_a),.b(drive_b),.out_or_bitwise(raw_dut_out_or_bitwise),.out_or_logical(raw_dut_out_or_logical),.out_not(raw_dut_out_not));
assign dut_out_or_bitwise=raw_dut_out_or_bitwise;
assign dut_out_or_logical=raw_dut_out_or_logical;
assign dut_out_not=raw_dut_out_not;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<3;b=b+1) begin
if(gold_out_or_bitwise[b] === 1'b0 || gold_out_or_bitwise[b] === 1'b1) begin
known=1; seen_out_or_bitwise[b]=1'b1;
if(dut_out_or_bitwise[b] !== gold_out_or_bitwise[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_or_logical === 1'b0 || gold_out_or_logical === 1'b1) begin
known=1; seen_out_or_logical=1'b1;
if(dut_out_or_logical !== gold_out_or_logical) bad=1;
end end
for(integer b=0;b<6;b=b+1) begin
if(gold_out_not[b] === 1'b0 || gold_out_not[b] === 1'b1) begin
known=1; seen_out_not[b]=1'b1;
if(dut_out_not[b] !== gold_out_not[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_or_bitwise) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_or_bitwise");
if((&seen_out_or_logical) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_or_logical");
if((&seen_out_not) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_not");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
