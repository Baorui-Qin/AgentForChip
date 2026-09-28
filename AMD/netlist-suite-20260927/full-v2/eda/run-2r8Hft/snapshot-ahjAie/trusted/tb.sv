`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [1023:0] in,
	output logic [7:0] sel
);

	always @(posedge clk, negedge clk) begin
		for (int i=0;i<32; i++)
			in[i*32+:32] <= $random(netlist_random_seed);
		sel <= $random(netlist_random_seed);
	end
	
	initial begin #101;
		repeat(1000) @(negedge clk);
		$finish;
	end
	
integer netlist_random_seed=1;
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [1023:0] in,
  input [7:0] sel,
  output [3:0] out
);

  assign out = {in[sel*4+3], in[sel*4+2], in[sel*4+1], in[sel*4+0]};

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [1023:0] raw_in; wire [1023:0] drive_in; assign #0.1 drive_in=raw_in;
wire [7:0] raw_sel; wire [7:0] drive_sel; assign #0.1 drive_sel=raw_sel;
wire [3:0] gold_out, dut_out, raw_dut_out; reg [3:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.sel(raw_sel));
oracle_RefModule gold(.in(drive_in),.sel(drive_sel),.out(gold_out));
TopModule dut(.in(drive_in),.sel(drive_sel),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
