`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg [2:0] vec,
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



	initial begin #101;
		int count; count = 0;
		vec <= 3'b0;
		@(negedge clk);
		wavedrom_start();
		repeat(10) @(posedge clk)
			vec <= count++;		
		wavedrom_stop();
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [2:0] vec,
  output [2:0] outv,
  output o2,
  output o1,
  output o0
);

  assign outv = vec;
  assign {o2, o1, o0} = vec;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [2:0] raw_vec; wire [2:0] drive_vec; assign #0.1 drive_vec=raw_vec;
wire [2:0] gold_outv, dut_outv, raw_dut_outv; reg [2:0] seen_outv='0;
wire gold_o2, dut_o2, raw_dut_o2; reg seen_o2='0;
wire gold_o1, dut_o1, raw_dut_o1; reg seen_o1='0;
wire gold_o0, dut_o0, raw_dut_o0; reg seen_o0='0;
stimulus_gen stim1(.clk(clk),.vec(raw_vec),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.vec(drive_vec),.outv(gold_outv),.o2(gold_o2),.o1(gold_o1),.o0(gold_o0));
TopModule dut(.vec(drive_vec),.outv(raw_dut_outv),.o2(raw_dut_o2),.o1(raw_dut_o1),.o0(raw_dut_o0));
assign dut_outv=raw_dut_outv;
assign dut_o2=raw_dut_o2;
assign dut_o1=raw_dut_o1;
assign dut_o0=raw_dut_o0;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<3;b=b+1) begin
if(gold_outv[b] === 1'b0 || gold_outv[b] === 1'b1) begin
known=1; seen_outv[b]=1'b1;
if(dut_outv[b] !== gold_outv[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_o2 === 1'b0 || gold_o2 === 1'b1) begin
known=1; seen_o2=1'b1;
if(dut_o2 !== gold_o2) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_o1 === 1'b0 || gold_o1 === 1'b1) begin
known=1; seen_o1=1'b1;
if(dut_o1 !== gold_o1) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_o0 === 1'b0 || gold_o0 === 1'b1) begin
known=1; seen_o0=1'b1;
if(dut_o0 !== gold_o0) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.2; sample(); #4.6; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_outv) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:outv");
if((&seen_o2) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:o2");
if((&seen_o1) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:o1");
if((&seen_o0) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:o0");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
