`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic clock=0,
	output logic a,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable	
);

	always begin
		repeat(3) @(posedge clk);
		clock = ~clock;
	end


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	



	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		a <= 0;
		@(negedge clock) {a} <= 0;
		@(negedge clk) wavedrom_start("Unknown circuit");
			@(posedge clk) {a} <= 0;
			repeat(14) @(posedge clk,negedge clk) a <= ~a;
			repeat(5) @(posedge clk, negedge clk);
			repeat(8) @(posedge clk,negedge clk) a <= ~a;
		wavedrom_stop();

		repeat(200) @(posedge clk, negedge clk)
			a <= $urandom;
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clock,
  input a,
  output reg p,
  output reg q
);

  always @(negedge clock)
    q <= a;

  always @(*)
    if (clock)
      p = a;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_clock; wire drive_clock; assign drive_clock=raw_clock;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire gold_p, dut_p, raw_dut_p; reg seen_p='0;
wire gold_q, dut_q, raw_dut_q; reg seen_q='0;
stimulus_gen stim1(.clk(clk),.clock(raw_clock),.a(raw_a),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clock(drive_clock),.a(drive_a),.p(gold_p),.q(gold_q));
TopModule dut(.clock(drive_clock),.a(drive_a),.p(raw_dut_p),.q(raw_dut_q));
assign dut_p=raw_dut_p;
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_p === 1'b0 || gold_p === 1'b1) begin
known=1; seen_p=1'b1;
if(dut_p !== gold_p) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_q === 1'b0 || gold_q === 1'b1) begin
known=1; seen_q=1'b1;
if(dut_q !== gold_q) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_p) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:p");
if((&seen_q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:q");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
