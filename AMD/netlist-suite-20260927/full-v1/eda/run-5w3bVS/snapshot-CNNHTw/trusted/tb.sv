`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [7:0] in,
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
		in <= 0;
		@(negedge clk) wavedrom_start();
			@(posedge clk) in <= 8'h1;
			@(posedge clk) in <= 8'h2;
			@(posedge clk) in <= 8'h4;
			@(posedge clk) in <= 8'h8;
			@(posedge clk) in <= 8'h80;
			@(posedge clk) in <= 8'hc0;
			@(posedge clk) in <= 8'he0;
			@(posedge clk) in <= 8'hf0;
		@(negedge clk) wavedrom_stop();
	
		repeat(200) @(posedge clk, negedge clk)
			in <= $random;
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [7:0] in,
  output [7:0] out
);

  assign {out[0],out[1],out[2],out[3],out[4],out[5],out[6],out[7]} = in;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;
wire [7:0] gold_out, dut_out, raw_dut_out; reg [7:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.out(gold_out));
TopModule dut(.in(drive_in),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.2; sample(); #4.6; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
