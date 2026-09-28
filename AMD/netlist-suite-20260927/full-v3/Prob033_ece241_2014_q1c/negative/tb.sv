`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [7:0] a, b,
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
		{a, b} <= 0;
		@(negedge clk) wavedrom_start();
			@(posedge clk) {a, b} <= 16'h0;
			@(posedge clk) {a, b} <= 16'h0070;
			@(posedge clk) {a, b} <= 16'h7070;
			@(posedge clk) {a, b} <= 16'h7090;
			@(posedge clk) {a, b} <= 16'h9070;
			@(posedge clk) {a, b} <= 16'h9090;
			@(posedge clk) {a, b} <= 16'h90ff;
		@(negedge clk) wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk)
			{a,b} <= $random(netlist_random_seed);

		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [7:0] a,
  input [7:0] b,
  output [7:0] s,
  output overflow
);

  wire [8:0] sum = a+b;
  assign s = sum[7:0];
  assign overflow = !(a[7]^b[7]) && (a[7] != s[7]);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;
wire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;
wire [7:0] gold_s, dut_s, raw_dut_s; reg [7:0] seen_s='0;
wire gold_overflow, dut_overflow, raw_dut_overflow; reg seen_overflow='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.s(gold_s),.overflow(gold_overflow));
TopModule dut(.a(drive_a),.b(drive_b),.s(raw_dut_s),.overflow(raw_dut_overflow));
assign dut_s=~raw_dut_s;
assign dut_overflow=~raw_dut_overflow;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_s[b] === 1'b0 || gold_s[b] === 1'b1) begin
known=1; seen_s[b]=1'b1;
if(dut_s[b] !== gold_s[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_overflow === 1'b0 || gold_overflow === 1'b1) begin
known=1; seen_overflow=1'b1;
if(dut_overflow !== gold_overflow) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_s) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:s");
if((&seen_overflow) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:overflow");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
