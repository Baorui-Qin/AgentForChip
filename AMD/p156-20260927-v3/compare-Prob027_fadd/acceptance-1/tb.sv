`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a,b,cin,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable	
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



	initial begin #101;
		wavedrom_start();
			@(posedge clk) {a,b,cin} <= 3'b000;
			@(posedge clk) {a,b,cin} <= 3'b010;
			@(posedge clk) {a,b,cin} <= 3'b100;
			@(posedge clk) {a,b,cin} <= 3'b110;
			@(posedge clk) {a,b,cin} <= 3'b000;
			@(posedge clk) {a,b,cin} <= 3'b001;
			@(posedge clk) {a,b,cin} <= 3'b011;			
		@(negedge clk) wavedrom_stop();
	
		repeat(200) @(posedge clk, negedge clk)
			{a,b,cin} <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  input cin,
  output cout,
  output sum
);

  assign {cout, sum} = a+b+cin;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire raw_cin; wire drive_cin; assign #0.1 drive_cin=raw_cin;
wire gold_cout, dut_cout, raw_dut_cout; reg seen_cout='0;
wire gold_sum, dut_sum, raw_dut_sum; reg seen_sum='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.cin(raw_cin),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.cin(drive_cin),.cout(gold_cout),.sum(gold_sum));
TopModule dut(.a(drive_a),.b(drive_b),.cin(drive_cin),.cout(raw_dut_cout),.sum(raw_dut_sum));
assign dut_cout=raw_dut_cout;
assign dut_sum=raw_dut_sum;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_cout === 1'b0 || gold_cout === 1'b1) begin
known=1; seen_cout=1'b1;
if(dut_cout !== gold_cout) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_sum === 1'b0 || gold_sum === 1'b1) begin
known=1; seen_sum=1'b1;
if(dut_sum !== gold_sum) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_cout) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:cout");
if((&seen_sum) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:sum");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
