`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic w, R, E, L
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(200) @(posedge clk, negedge clk) begin
			{w,R,E,L} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input w,
  input R,
  input E,
  input L,
  output reg Q
);

  always @(posedge clk)
    if (L)
      Q <= R;
    else if (E)
      Q <= w;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;
wire raw_R; wire drive_R; assign #0.1 drive_R=raw_R;
wire raw_E; wire drive_E; assign #0.1 drive_E=raw_E;
wire raw_L; wire drive_L; assign #0.1 drive_L=raw_L;
wire gold_Q, dut_Q, raw_dut_Q; reg seen_Q='0;
stimulus_gen stim1(.clk(clk),.w(raw_w),.R(raw_R),.E(raw_E),.L(raw_L));
oracle_RefModule gold(.clk(clk),.w(drive_w),.R(drive_R),.E(drive_E),.L(drive_L),.Q(gold_Q));
TopModule dut(.clk(clk),.w(drive_w),.R(drive_R),.E(drive_E),.L(drive_L),.Q(raw_dut_Q));
assign dut_Q=raw_dut_Q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Q === 1'b0 || gold_Q === 1'b1) begin
known=1; seen_Q=1'b1;
if(dut_Q !== gold_Q) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_Q) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:Q");
if(checks != 387) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
