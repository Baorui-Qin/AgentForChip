`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic reset,
	output logic [2:0] s,
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


	wire [3:0][2:0] val = { 3'h7, 3'h3, 3'h1, 3'h0 };
	integer sval;
	initial begin #101;
		reset <= 1;
		s <= 1;
		reset_test();
		
		
		@(posedge clk) s <= 0;
		@(posedge clk) s <= 0;
		@(negedge clk) wavedrom_start("Water rises to highest level, then down to lowest level.");
			@(posedge clk) s <= 0;
			@(posedge clk) s <= 1;
			@(posedge clk) s <= 3;
			@(posedge clk) s <= 7;
			@(posedge clk) s <= 7;
			@(posedge clk) s <= 3;
			@(posedge clk) s <= 3;
			@(posedge clk) s <= 1;
			@(posedge clk) s <= 1;
			@(posedge clk) s <= 0;
			@(posedge clk) s <= 0;
		@(negedge clk) wavedrom_stop();
		
		sval = 0;
		repeat(1000) begin
			@(posedge clk);
				sval = sval + (sval == 3 ? 0 : $random(netlist_random_seed)&1);
				s <= val[sval];
			@(negedge clk);
				sval = sval - (sval == 0 ? 0 : $random(netlist_random_seed)&1);
				s <= val[sval];
		end

		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input [2:0] s,
  output reg fr2,
  output reg fr1,
  output reg fr0,
  output reg dfr
);

  parameter A2=0, B1=1, B2=2, C1=3, C2=4, D1=5;
  reg [2:0] state, next;

  always @(posedge clk) begin
    if (reset) state <= A2;
    else state <= next;
  end

  always@(*) begin
    case (state)
      A2: next = s[0] ? B1 : A2;
      B1: next = s[1] ? C1 : (s[0] ? B1 : A2);
      B2: next = s[1] ? C1 : (s[0] ? B2 : A2);
      C1: next = s[2] ? D1 : (s[1] ? C1 : B2);
      C2: next = s[2] ? D1 : (s[1] ? C2 : B2);
      D1: next = s[2] ? D1 : C2;
      default: next = 'x;
    endcase
  end
  reg [3:0] fr;
  assign {fr2, fr1, fr0, dfr} = fr;
  always_comb begin
    case (state)
      A2: fr = 4'b1111;
      B1: fr = 4'b0110;
      B2: fr = 4'b0111;
      C1: fr = 4'b0010;
      C2: fr = 4'b0011;
      D1: fr = 4'b0000;
      default: fr = 'x;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire [2:0] raw_s; wire [2:0] drive_s; assign #0.1 drive_s=raw_s;
wire gold_fr2, dut_fr2, raw_dut_fr2; reg seen_fr2='0;
wire gold_fr1, dut_fr1, raw_dut_fr1; reg seen_fr1='0;
wire gold_fr0, dut_fr0, raw_dut_fr0; reg seen_fr0='0;
wire gold_dfr, dut_dfr, raw_dut_dfr; reg seen_dfr='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.s(raw_s),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.s(drive_s),.fr2(gold_fr2),.fr1(gold_fr1),.fr0(gold_fr0),.dfr(gold_dfr));
TopModule dut(.clk(clk),.reset(drive_reset),.s(drive_s),.fr2(raw_dut_fr2),.fr1(raw_dut_fr1),.fr0(raw_dut_fr0),.dfr(raw_dut_dfr));
assign dut_fr2=~raw_dut_fr2;
assign dut_fr1=~raw_dut_fr1;
assign dut_fr0=~raw_dut_fr0;
assign dut_dfr=~raw_dut_dfr;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_fr2 === 1'b0 || gold_fr2 === 1'b1) begin
known=1; seen_fr2=1'b1;
if(dut_fr2 !== gold_fr2) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_fr1 === 1'b0 || gold_fr1 === 1'b1) begin
known=1; seen_fr1=1'b1;
if(dut_fr1 !== gold_fr1) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_fr0 === 1'b0 || gold_fr0 === 1'b1) begin
known=1; seen_fr0=1'b1;
if(dut_fr0 !== gold_fr0) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_dfr === 1'b0 || gold_dfr === 1'b1) begin
known=1; seen_dfr=1'b1;
if(dut_dfr !== gold_dfr) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_fr2) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:fr2");
if((&seen_fr1) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:fr1");
if((&seen_fr0) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:fr0");
if((&seen_dfr) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:dfr");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
