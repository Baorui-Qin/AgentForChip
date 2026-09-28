`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [3:0] x,y
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk, negedge clk) begin
			{x,y} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [3:0] x,
  input [3:0] y,
  output [4:0] sum
);

  assign sum = x+y;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [3:0] raw_x; wire [3:0] drive_x; assign #0.1 drive_x=raw_x;
wire [3:0] raw_y; wire [3:0] drive_y; assign #0.1 drive_y=raw_y;
wire [4:0] gold_sum, dut_sum, raw_dut_sum; reg [4:0] seen_sum='0;
stimulus_gen stim1(.clk(clk),.x(raw_x),.y(raw_y));
oracle_RefModule gold(.x(drive_x),.y(drive_y),.sum(gold_sum));
TopModule dut(.x(drive_x),.y(drive_y),.sum(raw_dut_sum));
assign dut_sum=~raw_dut_sum;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<5;b=b+1) begin
if(gold_sum[b] === 1'b0 || gold_sum[b] === 1'b1) begin
known=1; seen_sum[b]=1'b1;
if(dut_sum[b] !== gold_sum[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_sum) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:sum");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
