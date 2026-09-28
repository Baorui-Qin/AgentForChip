`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic in1, in2
);

	initial begin #101;
		repeat(100) @(posedge clk, negedge clk) begin
			{in1, in2} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
integer netlist_random_seed=1;
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input in1,
  input in2,
  output logic out
);

  assign out = ~(in1 | in2);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_in1; wire drive_in1; assign #0.1 drive_in1=raw_in1;
wire raw_in2; wire drive_in2; assign #0.1 drive_in2=raw_in2;
wire gold_out, dut_out, raw_dut_out; reg seen_out='0;
stimulus_gen stim1(.clk(clk),.in1(raw_in1),.in2(raw_in2));
oracle_RefModule gold(.in1(drive_in1),.in2(drive_in2),.out(gold_out));
TopModule dut(.in1(drive_in1),.in2(drive_in2),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out === 1'b0 || gold_out === 1'b1) begin
known=1; seen_out=1'b1;
if(dut_out !== gold_out) bad=1;
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
