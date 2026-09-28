`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg reset,
	output reg ena,
	input [7:0] hh_dut, mm_dut, ss_dut,
	input pm_dut,
	input tb_match,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable
);
integer netlist_random_seed=1;

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


	

	logic bcd_fail = 0;
	logic reset_fail = 0;
	
	always @(posedge clk) begin
		if ((hh_dut[3:0] >= 4'ha) ||
			(hh_dut[7:4] >= 4'ha) ||
			(mm_dut[3:0] >= 4'ha) ||
			(mm_dut[7:4] >= 4'ha) ||
			(ss_dut[3:0] >= 4'ha) ||
			(ss_dut[7:4] >= 4'ha))
			bcd_fail <= 1'b1;		
	end
	
	initial begin #101;
		reset <= 1;
		ena <= 1;
		wavedrom_start("Reset and count to 10");
		reset_test();
		repeat(12) @(posedge clk);
		wavedrom_stop();
		ena <= 1'b1;
		reset <= 1'b1;
		@(posedge clk);
		@(posedge clk)
			if (!tb_match) begin
				$display("Hint: Clock seems to reset to %02x:%02x:%02x %s (Should be 12:00:00 AM).", hh_dut, mm_dut, ss_dut, pm_dut ? "PM": "AM");
				reset_fail <= 1'b1;
			end
		
		reset <= 1'b0;
		@(posedge clk);
		@(posedge clk);
		@(posedge clk);
		ena <= 1'b0;
		reset <= 1'b1;
		@(posedge clk);
		@(posedge clk)
			if (!tb_match && !reset_fail)
				$display("Hint: Reset has higher priority than enable and should occur even if not enabled.");
		
		
		repeat(400) @(posedge clk, negedge clk) begin
			reset <= !($random(netlist_random_seed) & 31);
			ena <= !($random(netlist_random_seed) & 3);
		end
		reset <= 1;
		@(posedge clk) begin
			{reset, ena} <= 2'b1;
		end
		
		repeat(55) @(posedge clk);
		wavedrom_start("Minute roll-over");
		repeat(10) @(posedge clk);
		wavedrom_stop();

		repeat(3530) @(posedge clk);
		wavedrom_start("Hour roll-over");
		repeat(10) @(posedge clk);
		wavedrom_stop();


		repeat(39590) @(posedge clk);
		wavedrom_start("PM roll-over");
		repeat(10) @(posedge clk);
		wavedrom_stop();
		
		repeat(132745) @(posedge clk);
		repeat(50) @(posedge clk, negedge clk) begin
			ena <= !($random(netlist_random_seed) & 7);
		end
		reset <= 1'b1;
		repeat(5) @(posedge clk);
		
		
		if (bcd_fail)
			$display("Hint: Non-BCD values detected. Are you sure you're using two-digit BCD representation for hh, mm, and ss?");
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input ena,
  output reg pm,
  output reg [7:0] hh,
  output reg [7:0] mm,
  output reg [7:0] ss
);

  wire [6:0] enable = {
    {hh[7:0],mm[7:0],ss[7:0]}==24'h115959,
    {hh[3:0],mm[7:0],ss[7:0]}==20'h95959,
    {mm[7:0],ss[7:0]}==16'h5959,
    {mm[3:0],ss[7:0]}==12'h959,
    ss[7:0]==8'h59,
    ss[3:0] == 4'h9,
    1'b1};

  always @(posedge clk)
    if (reset)
      {pm,hh,mm,ss} <= 25'h0120000;
    else if (ena) begin
      if (enable[0] && ss[3:0] == 9) ss[3:0] <= 0;
      else if (enable[0]) ss[3:0] <= ss[3:0] + 1;

      if (enable[1] && ss[7:4] == 4'h5) ss[7:4] <= 0;
      else if (enable[1]) ss[7:4] <= ss[7:4] + 1;

      if (enable[2] && mm[3:0] == 9) mm[3:0] <= 0;
      else if (enable[2]) mm[3:0] <= mm[3:0] + 1;

      if (enable[3] && mm[7:4] == 4'h5) mm[7:4] <= 0;
      else if (enable[3]) mm[7:4] <= mm[7:4] + 1;

      if (enable[4] && hh[3:0] == 4'h9) hh[3:0] <= 0;
      else if (enable[4]) hh[3:0] <= hh[3:0] + 1;

      if (enable[4] && hh[7:0] == 8'h12) hh[7:0] <= 8'h1;
      else if (enable[5]) hh[7:4] <= hh[7:4] + 1;

      if (enable[6]) pm <= ~pm;
    end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_ena; wire drive_ena; assign #0.1 drive_ena=raw_ena;
wire gold_pm, dut_pm, raw_dut_pm; reg seen_pm='0;
wire [7:0] gold_hh, dut_hh, raw_dut_hh; reg [7:0] seen_hh='0;
wire [7:0] gold_mm, dut_mm, raw_dut_mm; reg [7:0] seen_mm='0;
wire [7:0] gold_ss, dut_ss, raw_dut_ss; reg [7:0] seen_ss='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.ena(raw_ena),.hh_dut(gold_hh),.mm_dut(gold_mm),.ss_dut(gold_ss),.pm_dut(gold_pm),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.ena(drive_ena),.pm(gold_pm),.hh(gold_hh),.mm(gold_mm),.ss(gold_ss));
TopModule dut(.clk(clk),.reset(drive_reset),.ena(drive_ena),.pm(raw_dut_pm),.hh(raw_dut_hh),.mm(raw_dut_mm),.ss(raw_dut_ss));
assign dut_pm=~raw_dut_pm;
assign dut_hh=~raw_dut_hh;
assign dut_mm=~raw_dut_mm;
assign dut_ss=~raw_dut_ss;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_pm === 1'b0 || gold_pm === 1'b1) begin
known=1; seen_pm=1'b1;
if(dut_pm !== gold_pm) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_hh[b] === 1'b0 || gold_hh[b] === 1'b1) begin
known=1; seen_hh[b]=1'b1;
if(dut_hh[b] !== gold_hh[b]) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_mm[b] === 1'b0 || gold_mm[b] === 1'b1) begin
known=1; seen_mm[b]=1'b1;
if(dut_mm[b] !== gold_mm[b]) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_ss[b] === 1'b0 || gold_ss[b] === 1'b1) begin
known=1; seen_ss[b]=1'b1;
if(dut_ss[b] !== gold_ss[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_pm) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:pm");
if((&seen_hh) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:hh");
if((&seen_mm) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:mm");
if((&seen_ss) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:ss");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
