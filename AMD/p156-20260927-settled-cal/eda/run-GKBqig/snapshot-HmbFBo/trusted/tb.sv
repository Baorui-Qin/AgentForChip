`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a, b, c, d, e
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk, negedge clk)
			{a,b,c,d,e} <= $random(netlist_random_seed);
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
  input e,
  output [24:0] out
);

  assign out = ~{ {5{a}}, {5{b}}, {5{c}}, {5{d}}, {5{e}} } ^ {5{a,b,c,d,e}};

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;
wire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;
wire raw_e; wire drive_e; assign #0.1 drive_e=raw_e;
wire [24:0] gold_out, dut_out, raw_dut_out; reg [24:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e));
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.out(gold_out));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<25;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out");
if(checks != 198) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
