`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg reset
);
integer netlist_random_seed=1;


	
	initial begin #101;
		repeat(400) @(posedge clk, negedge clk) begin
			reset <= !($random(netlist_random_seed) & 31);
		end
		@(posedge clk) reset <= 1'b0;
		repeat(200000) @(posedge clk);
		reset <= 1'b1;
		repeat(5) @(posedge clk);
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  output reg [31:0] q
);

  logic [31:0] q_next;
  always@(q) begin
    q_next = q[31:1];
    q_next[31] = q[0];
    q_next[21] ^= q[0];
    q_next[1] ^= q[0];
    q_next[0] ^= q[0];
  end

  always @(posedge clk) begin
    if (reset)
      q <= 32'h1;
    else
      q <= q_next;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire [31:0] gold_q, dut_q, raw_dut_q; reg [31:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.q(gold_q));
TopModule dut(.clk(clk),.reset(drive_reset),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<32;b=b+1) begin
if(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin
known=1; seen_q[b]=1'b1;
if(dut_q[b] !== gold_q[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:q");
if(checks != 800701) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
