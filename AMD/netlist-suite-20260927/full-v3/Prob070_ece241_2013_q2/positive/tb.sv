`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a, b, c, d,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
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



	bit fail = 0;
	bit fail1 = 0;
	always @(posedge clk, negedge clk)
		if (!tb_match)
			fail = 1;

	initial begin #101;
		@(posedge clk) {a,b,c,d} <= 0;
		@(posedge clk) {a,b,c,d} <= 1;
		@(posedge clk) {a,b,c,d} <= 2;
		@(posedge clk) {a,b,c,d} <= 4;
		@(posedge clk) {a,b,c,d} <= 5;
		@(posedge clk) {a,b,c,d} <= 6;
		@(posedge clk) {a,b,c,d} <= 7;
		@(posedge clk) {a,b,c,d} <= 9;
		@(posedge clk) {a,b,c,d} <= 10;
		@(posedge clk) {a,b,c,d} <= 13;
		@(posedge clk) {a,b,c,d} <= 14;
		@(posedge clk) {a,b,c,d} <= 15;
		@(posedge clk) fail1 = fail;
		
		
				
		
		//@(negedge clk) wavedrom_start();
			for (int i=0;i<16;i++)
				@(posedge clk)
					{a,b,c,d} <= i;
		//@(negedge clk) wavedrom_stop();
		
		repeat(50) @(posedge clk, negedge clk)
			{a,b,c,d} <= $random(netlist_random_seed);
			
		if (fail && ~fail1)
			$display("Hint: Your circuit passes on the 12 required input combinations, but doesn't match the don't-care cases. Are you using minimal SOP and POS?");

		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  input c,
  input d,
  output out_sop,
  output out_pos
);

  wire pos0, pos1;
  assign out_sop = c&d | ~a&~b&c;
  assign pos0 = c & (~b|d)&(~a|b);
  assign pos1 = c & (~b|d)&(~a|d);

  assign out_pos = (pos0 == pos1) ? pos0 : 1'bx;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;
wire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;
wire gold_out_sop, dut_out_sop, raw_dut_out_sop; reg seen_out_sop='0;
wire gold_out_pos, dut_out_pos, raw_dut_out_pos; reg seen_out_pos='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out_sop(gold_out_sop),.out_pos(gold_out_pos));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.out_sop(raw_dut_out_sop),.out_pos(raw_dut_out_pos));
assign dut_out_sop=raw_dut_out_sop;
assign dut_out_pos=raw_dut_out_pos;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out_sop === 1'b0 || gold_out_sop === 1'b1) begin
known=1; seen_out_sop=1'b1;
if(dut_out_sop !== gold_out_sop) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_pos === 1'b0 || gold_out_pos === 1'b1) begin
known=1; seen_out_pos=1'b1;
if(dut_out_pos !== gold_out_pos) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_sop) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_sop");
if((&seen_out_pos) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_pos");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
