`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a,b,sel_b1, sel_b2,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable	
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
		{a, b, sel_b1, sel_b2} <= 4'b000;
		@(negedge clk) wavedrom_start("");
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0100;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1000;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1101;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0001;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0110;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1010;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1111;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0011;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0111;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1011;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b1111;
			@(posedge clk, negedge clk) {a,b,sel_b1,sel_b2} <= 4'b0011;
		wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk)
			{a,b,sel_b1,sel_b2} <= $urandom;
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  input sel_b1,
  input sel_b2,
  output out_assign,
  output reg out_always
);

  assign out_assign = (sel_b1 & sel_b2) ? b : a;
  always @(*) out_always = (sel_b1 & sel_b2) ? b : a;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire raw_sel_b1; wire drive_sel_b1; assign #0.1 drive_sel_b1=raw_sel_b1;
wire raw_sel_b2; wire drive_sel_b2; assign #0.1 drive_sel_b2=raw_sel_b2;
wire gold_out_assign, dut_out_assign, raw_dut_out_assign; reg seen_out_assign='0;
wire gold_out_always, dut_out_always, raw_dut_out_always; reg seen_out_always='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.sel_b1(raw_sel_b1),.sel_b2(raw_sel_b2),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.sel_b1(drive_sel_b1),.sel_b2(drive_sel_b2),.out_assign(gold_out_assign),.out_always(gold_out_always));
TopModule dut(.a(drive_a),.b(drive_b),.sel_b1(drive_sel_b1),.sel_b2(drive_sel_b2),.out_assign(raw_dut_out_assign),.out_always(raw_dut_out_always));
assign dut_out_assign=raw_dut_out_assign;
assign dut_out_always=raw_dut_out_always;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out_assign === 1'b0 || gold_out_assign === 1'b1) begin
known=1; seen_out_assign=1'b1;
if(dut_out_assign !== gold_out_assign) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_always === 1'b0 || gold_out_always === 1'b1) begin
known=1; seen_out_always=1'b1;
if(dut_out_always !== gold_out_always) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_assign) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out_assign");
if((&seen_out_always) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out_always");
if(checks != 226) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
