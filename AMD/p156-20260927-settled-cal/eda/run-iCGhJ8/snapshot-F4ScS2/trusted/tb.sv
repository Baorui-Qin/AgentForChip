`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic areset,
	output logic bump_left,
	output logic bump_right,
	output logic ground,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
);
integer netlist_random_seed=1;

	reg reset;
	assign areset = reset;

	task reset_test(input async=0);
		bit arfail, srfail, datafail;
	
		@(posedge clk);
		@(posedge clk) reset <= 0;
		repeat(3) @(posedge clk);
	
		@(negedge clk) begin datafail = !tb_match ; reset <= 1; end
		@(posedge clk) arfail = !tb_match;
		@(posedge clk) begin
			srfail = !tb_match;
			reset <= 0;
		end
		if (srfail)
			$display("Hint: Your reset doesn't seem to be working.");
		else if (arfail && (async || !datafail))
			$display("Hint: Your reset should be %0s, but doesn't appear to be.", async ? "asynchronous" : "synchronous");
		// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely
		// a functionality error than the reset being implemented asynchronously.
	
	endtask


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	


	
	initial begin #101;
		reset <= 1'b1;
		{bump_left, bump_right, ground} <= 3'h1;
		reset_test(1);
		{bump_right, bump_left} <= 3'h0;
		wavedrom_start("Falling");
		repeat(3) @(posedge clk);
		{bump_right, bump_left, ground} <= 0;
		repeat(3) @(posedge clk);
		{bump_right, bump_left, ground} <= 3;
		repeat(2) @(posedge clk);
		{bump_right, bump_left, ground} <= 0;
		repeat(3) @(posedge clk);
		{bump_right, bump_left, ground} <= 1;
		repeat(2) @(posedge clk);
		wavedrom_stop();
			
		reset <= 1'b1;
		@(posedge clk);
		repeat(400) @(posedge clk, negedge clk) begin
			{bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);
			ground <= |($random(netlist_random_seed) & 7);
			reset <= !($random(netlist_random_seed) & 31);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input areset,
  input bump_left,
  input bump_right,
  input ground,
  output walk_left,
  output walk_right,
  output aaah
);

  parameter WL=0, WR=1, FALLL=2, FALLR=3;
  reg [1:0] state;
  reg [1:0] next;

  always_comb begin
    case (state)
      WL: next = ground ? (bump_left ? WR : WL) : FALLL;
      WR: next = ground ? (bump_right ? WL: WR) : FALLR;
      FALLL: next = ground ? WL : FALLL;
      FALLR: next = ground ? WR : FALLR;
    endcase
  end

  always @(posedge clk, posedge areset) begin
    if (areset) state <= WL;
      else state <= next;
  end

  assign walk_left = (state==WL);
  assign walk_right = (state==WR);
  assign aaah = (state == FALLL) || (state == FALLR);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_bump_left; wire drive_bump_left; assign #0.1 drive_bump_left=raw_bump_left;
wire raw_bump_right; wire drive_bump_right; assign #0.1 drive_bump_right=raw_bump_right;
wire raw_ground; wire drive_ground; assign #0.1 drive_ground=raw_ground;
wire gold_walk_left, dut_walk_left, raw_dut_walk_left; reg seen_walk_left='0;
wire gold_walk_right, dut_walk_right, raw_dut_walk_right; reg seen_walk_right='0;
wire gold_aaah, dut_aaah, raw_dut_aaah; reg seen_aaah='0;
stimulus_gen stim1(.clk(clk),.areset(raw_areset),.bump_left(raw_bump_left),.bump_right(raw_bump_right),.ground(raw_ground),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.walk_left(gold_walk_left),.walk_right(gold_walk_right),.aaah(gold_aaah));
TopModule dut(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.walk_left(raw_dut_walk_left),.walk_right(raw_dut_walk_right),.aaah(raw_dut_aaah));
assign dut_walk_left=raw_dut_walk_left;
assign dut_walk_right=raw_dut_walk_right;
assign dut_aaah=raw_dut_aaah;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_walk_left === 1'b0 || gold_walk_left === 1'b1) begin
known=1; seen_walk_left=1'b1;
if(dut_walk_left !== gold_walk_left) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_walk_right === 1'b0 || gold_walk_right === 1'b1) begin
known=1; seen_walk_right=1'b1;
if(dut_walk_right !== gold_walk_right) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_aaah === 1'b0 || gold_aaah === 1'b1) begin
known=1; seen_aaah=1'b1;
if(dut_aaah !== gold_aaah) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_walk_left) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:walk_left");
if((&seen_walk_right) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:walk_right");
if((&seen_aaah) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:aaah");
if(checks != 881) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
