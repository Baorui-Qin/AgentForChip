`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg a, b,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable
);


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	initial begin #101; begin
		int count; count = 0;
		{a,b} <= 1'b0;
		wavedrom_start("AND gate");
		repeat(10) @(posedge clk)
			{a,b} <= count++;		
		wavedrom_stop();
		
		repeat(200) @(posedge clk, negedge clk)
			{b,a} <= $random(netlist_random_seed);
			
		#1 $finish;
	end end
	
integer netlist_random_seed=1;
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  output out_assign,
  output reg out_alwaysblock
);

  assign out_assign = a & b;
  always @(*) out_alwaysblock = a & b;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire gold_out_assign, dut_out_assign, raw_dut_out_assign; reg seen_out_assign='0;
wire gold_out_alwaysblock, dut_out_alwaysblock, raw_dut_out_alwaysblock; reg seen_out_alwaysblock='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.out_assign(gold_out_assign),.out_alwaysblock(gold_out_alwaysblock));
TopModule dut(.a(drive_a),.b(drive_b),.out_assign(raw_dut_out_assign),.out_alwaysblock(raw_dut_out_alwaysblock));
assign dut_out_assign=raw_dut_out_assign;
assign dut_out_alwaysblock=raw_dut_out_alwaysblock;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out_assign === 1'b0 || gold_out_assign === 1'b1) begin
known=1; seen_out_assign=1'b1;
if(dut_out_assign !== gold_out_assign) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_alwaysblock === 1'b0 || gold_out_alwaysblock === 1'b1) begin
known=1; seen_out_alwaysblock=1'b1;
if(dut_out_alwaysblock !== gold_out_alwaysblock) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_assign) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_assign");
if((&seen_out_alwaysblock) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_alwaysblock");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
