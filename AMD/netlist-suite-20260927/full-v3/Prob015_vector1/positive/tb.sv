`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [15:0] in,
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



	always @(posedge clk, negedge clk)
		in <= $random(netlist_random_seed);
	
	initial begin #101;
		wavedrom_start("Random inputs");
		repeat(10) @(posedge clk);
		wavedrom_stop();
		repeat(100) @(negedge clk);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [15:0] in,
  output [7:0] out_hi,
  output [7:0] out_lo
);

  assign {out_hi, out_lo} = in;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [15:0] raw_in; wire [15:0] drive_in; assign #0.1 drive_in=raw_in;
wire [7:0] gold_out_hi, dut_out_hi, raw_dut_out_hi; reg [7:0] seen_out_hi='0;
wire [7:0] gold_out_lo, dut_out_lo, raw_dut_out_lo; reg [7:0] seen_out_lo='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.out_hi(gold_out_hi),.out_lo(gold_out_lo));
TopModule dut(.in(drive_in),.out_hi(raw_dut_out_hi),.out_lo(raw_dut_out_lo));
assign dut_out_hi=raw_dut_out_hi;
assign dut_out_lo=raw_dut_out_lo;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_out_hi[b] === 1'b0 || gold_out_hi[b] === 1'b1) begin
known=1; seen_out_hi[b]=1'b1;
if(dut_out_hi[b] !== gold_out_hi[b]) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_out_lo[b] === 1'b0 || gold_out_lo[b] === 1'b1) begin
known=1; seen_out_lo[b]=1'b1;
if(dut_out_lo[b] !== gold_out_lo[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_hi) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_hi");
if((&seen_out_lo) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_lo");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
