`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13



module stimulus_gen (
	input clk,
	output logic do_sub,
	output logic [7:0] a, b,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
);


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	


	
	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		{a, b} <= 16'haabb;
		do_sub <= 0;
		@(negedge clk) wavedrom_start("");
			@(posedge clk, negedge clk) do_sub <= 0;
			@(posedge clk, negedge clk) do_sub <= 0;
			@(posedge clk, negedge clk) do_sub <= 1;
			@(posedge clk, negedge clk) do_sub <= 1;
			
			@(posedge clk, negedge clk) {a, b} <= 16'h0303; do_sub <= 1'b0;
			@(posedge clk, negedge clk) do_sub <= 0;
			@(posedge clk, negedge clk) do_sub <= 1;
			@(posedge clk, negedge clk) {a, b} <= 16'h0304; do_sub <= 1'b0;
			@(posedge clk, negedge clk) do_sub <= 0;
			@(posedge clk, negedge clk) do_sub <= 1;
			@(posedge clk, negedge clk) {a, b} <= 16'hfd03; do_sub <= 1'b0;
			@(posedge clk, negedge clk) do_sub <= 0;
			@(posedge clk, negedge clk) do_sub <= 1;
			@(posedge clk, negedge clk) {a, b} <= 16'hfd04; do_sub <= 1'b0;
			@(posedge clk, negedge clk) do_sub <= 0;
			@(posedge clk, negedge clk) do_sub <= 1;
		wavedrom_stop();
		
		repeat(100) @(posedge clk, negedge clk) begin
			{a,b, do_sub} <= $urandom;
		end
			
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input do_sub,
  input [7:0] a,
  input [7:0] b,
  output reg [7:0] out,
  output reg result_is_zero
);

  always @(*) begin
    case (do_sub)
      0: out = a + b;
      1: out = a - b;
    endcase
    result_is_zero = (out == 0);
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_do_sub; wire drive_do_sub; assign #0.1 drive_do_sub=raw_do_sub;
wire [7:0] raw_a; wire [7:0] drive_a; assign #0.1 drive_a=raw_a;
wire [7:0] raw_b; wire [7:0] drive_b; assign #0.1 drive_b=raw_b;
wire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;
wire gold_result_is_zero, dut_result_is_zero, raw_dut_result_is_zero; reg seen_result_is_zero='0;
stimulus_gen stim1(.clk(clk),.do_sub(raw_do_sub),.a(raw_a),.b(raw_b),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.do_sub(drive_do_sub),.a(drive_a),.b(drive_b),.out(gold_out),.result_is_zero(gold_result_is_zero));
TopModule dut(.do_sub(drive_do_sub),.a(drive_a),.b(drive_b),.out(raw_dut_out),.result_is_zero(raw_dut_result_is_zero));
assign dut_out=raw_dut_out;
assign dut_result_is_zero=raw_dut_result_is_zero;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_result_is_zero === 1'b0 || gold_result_is_zero === 1'b1) begin
known=1; seen_result_is_zero=1'b1;
if(dut_result_is_zero !== gold_result_is_zero) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
if((&seen_result_is_zero) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:result_is_zero");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
