`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic areset,
	output logic bump_left,
	output logic bump_right,
	output logic dig,
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
		@(posedge clk);
		reset <= 0;
		{bump_left, bump_right, ground, dig} <= 2;
		repeat(2) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 3;
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 10;
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 0;
		repeat(3) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 3;
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;
		repeat(4) @(posedge clk);
		
		{bump_left, bump_right, ground, dig} <= 0;		// Fall
		repeat(20) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;		// Survive
		repeat(1) @(posedge clk);

		{bump_left, bump_right, ground, dig} <= 0;		// Fall
		repeat(21) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;		// Splat after falling left
		repeat(20) @(posedge clk) begin
			{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);	// See if it's handled correctly.
			ground <= |($random(netlist_random_seed) & 7);
		end
			

		reset <= 1;
		{bump_left, bump_right, ground, dig} <= 2;		// Normal
		@(posedge clk)
		reset <= 0;		// Resurrect.
		bump_left <= 1;
		repeat(5) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 0;		// Fall
		repeat(21) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;		// Splat after falling right
		repeat(20) @(posedge clk) begin
			{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);	// See if it's handled correctly.
			ground <= |($random(netlist_random_seed) & 7);
		end

		reset <= 1;
		@(posedge clk)
		reset <= 0;		// Resurrect.
		{bump_left, bump_right, ground, dig} <= 2;		// Normal
		wavedrom_start("Splat?");
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 0;		// Fall
		repeat(24) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;		// Splat? (24-cycles)
		repeat(2) @(posedge clk);
		wavedrom_stop();
		
		reset <= 1;
		@(posedge clk)
		reset <= 0;		// Resurrect.
		{bump_left, bump_right, ground, dig} <= 2;		// Normal
		@(posedge clk);
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 0;		// Fall
		repeat(35) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;		// Splat? (Test for 5-bit non-saturating counter)
		repeat(2) @(posedge clk);
		repeat(20) @(posedge clk) begin
			{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);	// See if it's handled correctly.
			ground <= |($random(netlist_random_seed) & 7);
		end		

		reset <= 1;
		{bump_left, bump_right, ground, dig} <= 2;		// Normal
		@(posedge clk);
		reset <= 0;		// Resurrect.
		@(posedge clk);
		{bump_left, bump_right, ground, dig} <= 0;		// Fall
		repeat(67) @(posedge clk);
		{bump_left, bump_right, ground, dig} <= 2;		// Splat? (Test for 6-bit non-saturating counter)
		repeat(20) @(posedge clk) begin
			{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);	// See if it's handled correctly.
			ground <= |($random(netlist_random_seed) & 7);
		end
		
		reset <= 1;
		{bump_left, bump_right, ground, dig} <= 2;		// Normal
		@(posedge clk)
		reset <= 0;		// Resurrect.
		
		
		repeat(400) @(posedge clk, negedge clk) begin
			{dig, bump_right, bump_left} <= $random(netlist_random_seed) & $random(netlist_random_seed);
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
  input dig,
  output walk_left,
  output walk_right,
  output aaah,
  output digging
);

  parameter WL=0, WR=1, FALLL=2, FALLR=3, DIGL=4, DIGR=5, DEAD=6;
  reg [2:0] state;
  reg [2:0] next;

  reg [4:0] fall_counter;

  always_comb begin
    case (state)
      WL: if (!ground) next = FALLL;
        else if (dig) next = DIGL;
        else if (bump_left) next = WR;
        else next = WL;
      WR:
        if (!ground) next = FALLR;
        else if (dig) next = DIGR;
        else if (bump_right) next = WL;
        else next = WR;
      FALLL: next = ground ? (fall_counter >= 20 ? DEAD : WL) : FALLL;
      FALLR: next = ground ? (fall_counter >= 20 ? DEAD : WR) : FALLR;
      DIGL: next = ground ? DIGL : FALLL;
      DIGR: next = ground ? DIGR : FALLR;
      DEAD: next = DEAD;
    endcase
  end

  always @(posedge clk, posedge areset) begin
    if (areset) state <= WL;
      else state <= next;
  end

  always @(posedge clk) begin
    if (state == FALLL || state == FALLR) begin
      if (fall_counter < 20)
        fall_counter <= fall_counter + 1'b1;
    end
    else
      fall_counter <= 0;
  end

  assign walk_left = (state==WL);
  assign walk_right = (state==WR);
  assign aaah = (state == FALLL) || (state == FALLR);
  assign digging = (state == DIGL) || (state == DIGR);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_bump_left; wire drive_bump_left; assign #0.1 drive_bump_left=raw_bump_left;
wire raw_bump_right; wire drive_bump_right; assign #0.1 drive_bump_right=raw_bump_right;
wire raw_ground; wire drive_ground; assign #0.1 drive_ground=raw_ground;
wire raw_dig; wire drive_dig; assign #0.1 drive_dig=raw_dig;
wire gold_walk_left, dut_walk_left, raw_dut_walk_left; reg seen_walk_left='0;
wire gold_walk_right, dut_walk_right, raw_dut_walk_right; reg seen_walk_right='0;
wire gold_aaah, dut_aaah, raw_dut_aaah; reg seen_aaah='0;
wire gold_digging, dut_digging, raw_dut_digging; reg seen_digging='0;
stimulus_gen stim1(.clk(clk),.areset(raw_areset),.bump_left(raw_bump_left),.bump_right(raw_bump_right),.dig(raw_dig),.ground(raw_ground),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.dig(drive_dig),.walk_left(gold_walk_left),.walk_right(gold_walk_right),.aaah(gold_aaah),.digging(gold_digging));
TopModule dut(.clk(clk),.areset(drive_areset),.bump_left(drive_bump_left),.bump_right(drive_bump_right),.ground(drive_ground),.dig(drive_dig),.walk_left(raw_dut_walk_left),.walk_right(raw_dut_walk_right),.aaah(raw_dut_aaah),.digging(raw_dut_digging));
assign dut_walk_left=~raw_dut_walk_left;
assign dut_walk_right=~raw_dut_walk_right;
assign dut_aaah=~raw_dut_aaah;
assign dut_digging=~raw_dut_digging;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
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
for(integer b=0;b<1;b=b+1) begin
if(gold_digging === 1'b0 || gold_digging === 1'b1) begin
known=1; seen_digging=1'b1;
if(dut_digging !== gold_digging) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_walk_left) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:walk_left");
if((&seen_walk_right) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:walk_right");
if((&seen_aaah) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:aaah");
if((&seen_digging) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:digging");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
