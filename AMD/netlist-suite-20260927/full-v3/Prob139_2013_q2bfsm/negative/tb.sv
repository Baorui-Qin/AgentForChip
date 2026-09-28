`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic resetn,
	output logic x, y
);
integer netlist_random_seed=1;


	initial begin #101;
		resetn = 0;
		x = 0;
		y = 0;
		@(posedge clk);
		@(posedge clk);
		resetn = 1;
		repeat(500) @(negedge clk) begin
			resetn <= ($random(netlist_random_seed) & 31) != 0;
			{x,y} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input resetn,
  input x,
  input y,
  output f,
  output g
);

  parameter A=0, B=1, S0=2, S1=3, S10=4, G1=5, G2=6, P0=7, P1=8;
  reg [3:0] state, next;

  always @(posedge clk) begin
    if (~resetn) state <= A;
    else state <= next;
  end

  always_comb begin
    case (state)
      A: next = B;
      B: next = S0;
      S0: next = x ? S1 : S0;
      S1: next = x ? S1 : S10;
      S10: next = x? G1 : S0;
      G1: next = y ? P1 : G2;
      G2: next = y ? P1 : P0;
      P0: next = P0;
      P1: next = P1;
      default: next = 'x;
    endcase
  end

  assign f = (state == B);
  assign g = (state == G1) || (state == G2) || (state == P1);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;
wire raw_x; wire drive_x; assign #0.1 drive_x=raw_x;
wire raw_y; wire drive_y; assign #0.1 drive_y=raw_y;
wire gold_f, dut_f, raw_dut_f; reg seen_f='0;
wire gold_g, dut_g, raw_dut_g; reg seen_g='0;
stimulus_gen stim1(.clk(clk),.resetn(raw_resetn),.x(raw_x),.y(raw_y));
oracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.x(drive_x),.y(drive_y),.f(gold_f),.g(gold_g));
TopModule dut(.clk(clk),.resetn(drive_resetn),.x(drive_x),.y(drive_y),.f(raw_dut_f),.g(raw_dut_g));
assign dut_f=~raw_dut_f;
assign dut_g=~raw_dut_g;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_f === 1'b0 || gold_f === 1'b1) begin
known=1; seen_f=1'b1;
if(dut_f !== gold_f) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_g === 1'b0 || gold_g === 1'b1) begin
known=1; seen_g=1'b1;
if(dut_g !== gold_g) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_f) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:f");
if((&seen_g) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:g");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
