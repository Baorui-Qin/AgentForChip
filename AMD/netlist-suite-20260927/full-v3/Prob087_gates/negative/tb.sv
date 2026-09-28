`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a,b,
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



	
	initial begin #101;
		@(negedge clk) {a,b} <= 0;
		wavedrom_start();
			@(posedge clk) {a,b} <= 0;
			@(posedge clk) {a,b} <= 1;
			@(posedge clk) {a,b} <= 2;
			@(posedge clk) {a,b} <= 3;
			@(negedge clk);
		wavedrom_stop();
		repeat(200) @(posedge clk, negedge clk)
		{a,b} <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  output out_and,
  output out_or,
  output out_xor,
  output out_nand,
  output out_nor,
  output out_xnor,
  output out_anotb
);

  assign out_and = a&b;
  assign out_or = a|b;
  assign out_xor = a^b;
  assign out_nand = ~(a&b);
  assign out_nor = ~(a|b);
  assign out_xnor = a^~b;
  assign out_anotb = a & ~b;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire gold_out_and, dut_out_and, raw_dut_out_and; reg seen_out_and='0;
wire gold_out_or, dut_out_or, raw_dut_out_or; reg seen_out_or='0;
wire gold_out_xor, dut_out_xor, raw_dut_out_xor; reg seen_out_xor='0;
wire gold_out_nand, dut_out_nand, raw_dut_out_nand; reg seen_out_nand='0;
wire gold_out_nor, dut_out_nor, raw_dut_out_nor; reg seen_out_nor='0;
wire gold_out_xnor, dut_out_xnor, raw_dut_out_xnor; reg seen_out_xnor='0;
wire gold_out_anotb, dut_out_anotb, raw_dut_out_anotb; reg seen_out_anotb='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.out_and(gold_out_and),.out_or(gold_out_or),.out_xor(gold_out_xor),.out_nand(gold_out_nand),.out_nor(gold_out_nor),.out_xnor(gold_out_xnor),.out_anotb(gold_out_anotb));
TopModule dut(.a(drive_a),.b(drive_b),.out_and(raw_dut_out_and),.out_or(raw_dut_out_or),.out_xor(raw_dut_out_xor),.out_nand(raw_dut_out_nand),.out_nor(raw_dut_out_nor),.out_xnor(raw_dut_out_xnor),.out_anotb(raw_dut_out_anotb));
assign dut_out_and=~raw_dut_out_and;
assign dut_out_or=~raw_dut_out_or;
assign dut_out_xor=~raw_dut_out_xor;
assign dut_out_nand=~raw_dut_out_nand;
assign dut_out_nor=~raw_dut_out_nor;
assign dut_out_xnor=~raw_dut_out_xnor;
assign dut_out_anotb=~raw_dut_out_anotb;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out_and === 1'b0 || gold_out_and === 1'b1) begin
known=1; seen_out_and=1'b1;
if(dut_out_and !== gold_out_and) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_or === 1'b0 || gold_out_or === 1'b1) begin
known=1; seen_out_or=1'b1;
if(dut_out_or !== gold_out_or) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_xor === 1'b0 || gold_out_xor === 1'b1) begin
known=1; seen_out_xor=1'b1;
if(dut_out_xor !== gold_out_xor) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_nand === 1'b0 || gold_out_nand === 1'b1) begin
known=1; seen_out_nand=1'b1;
if(dut_out_nand !== gold_out_nand) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_nor === 1'b0 || gold_out_nor === 1'b1) begin
known=1; seen_out_nor=1'b1;
if(dut_out_nor !== gold_out_nor) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_xnor === 1'b0 || gold_out_xnor === 1'b1) begin
known=1; seen_out_xnor=1'b1;
if(dut_out_xnor !== gold_out_xnor) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_anotb === 1'b0 || gold_out_anotb === 1'b1) begin
known=1; seen_out_anotb=1'b1;
if(dut_out_anotb !== gold_out_anotb) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_and) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_and");
if((&seen_out_or) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_or");
if((&seen_out_xor) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_xor");
if((&seen_out_nand) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_nand");
if((&seen_out_nor) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_nor");
if((&seen_out_xnor) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_xnor");
if((&seen_out_anotb) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_anotb");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
