`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic[5:0] y,
	output logic w,
	input tb_match
);
integer netlist_random_seed=1;


	int errored1 = 0;
	int onehot_error = 0;
	int temp;
	
	initial begin #101;
		// Test the one-hot cases first.
		repeat(200) @(posedge clk, negedge clk) begin
			y <= 1<< ($unsigned($random(netlist_random_seed)) % 6);
			w <= $random(netlist_random_seed);
			if (!tb_match) onehot_error++;
		end
			
			
		// Random.
		errored1 = 0;
		repeat(400) @(posedge clk, negedge clk) begin
			do 
				temp = $random(netlist_random_seed);
			while ( !{temp[5:4],temp[2:1]} == !{temp[3],temp[0]} );	
			// Make y[3,0] and y[5,4,2,1] mutually exclusive, so we can accept Y3=(~y[3] & ~y[0]) &~w as a valid answer too.

			y <= temp;
			w <= $random(netlist_random_seed);
			if (!tb_match)
				errored1++;
		end
		if (!onehot_error && errored1) 
			$display ("Hint: Your circuit passed when given only one-hot inputs, but not with semi-random inputs.");

		if (!onehot_error && errored1)
			$display("Hint: Are you doing something more complicated than deriving state transition equations by inspection?\n");

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [5:0] y,
  input w,
  output Y1,
  output Y3
);

  assign Y1 = y[0]&w;
  assign Y3 = (y[1]|y[2]|y[4]|y[5]) & ~w;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [5:0] raw_y; wire [5:0] drive_y; assign #0.1 drive_y=raw_y;
wire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;
wire gold_Y1, dut_Y1, raw_dut_Y1; reg seen_Y1='0;
wire gold_Y3, dut_Y3, raw_dut_Y3; reg seen_Y3='0;
stimulus_gen stim1(.clk(clk),.y(raw_y),.w(raw_w),.tb_match(1'b1));
oracle_RefModule gold(.y(drive_y),.w(drive_w),.Y1(gold_Y1),.Y3(gold_Y3));
TopModule dut(.y(drive_y),.w(drive_w),.Y1(raw_dut_Y1),.Y3(raw_dut_Y3));
assign dut_Y1=raw_dut_Y1;
assign dut_Y3=raw_dut_Y3;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Y1 === 1'b0 || gold_Y1 === 1'b1) begin
known=1; seen_Y1=1'b1;
if(dut_Y1 !== gold_Y1) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_Y3 === 1'b0 || gold_Y3 === 1'b1) begin
known=1; seen_Y3=1'b1;
if(dut_Y3 !== gold_Y3) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_Y1) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Y1");
if((&seen_Y3) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Y3");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
