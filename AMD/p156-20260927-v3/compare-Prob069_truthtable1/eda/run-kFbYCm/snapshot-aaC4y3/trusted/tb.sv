`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg x3, x2, x1,
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
		{x3, x2, x1} <= 3'h7;
		@(negedge clk) wavedrom_start("All 8 input combinations");
		repeat(8) @(posedge clk) {x3, x2, x1} <= {x3, x2, x1} + 1'b1;
		@(negedge clk) wavedrom_stop();
		repeat(40) @(posedge clk, negedge clk);
		{x3, x2, x1} <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input x3,
  input x2,
  input x1,
  output f
);

  assign f = ( ~x3 & x2 & ~x1 ) |
        ( ~x3 & x2 & x1 ) |
        ( x3 & ~x2 & x1 ) |
        ( x3 & x2 & x1 ) ;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_x3; wire drive_x3; assign #0.1 drive_x3=raw_x3;
wire raw_x2; wire drive_x2; assign #0.1 drive_x2=raw_x2;
wire raw_x1; wire drive_x1; assign #0.1 drive_x1=raw_x1;
wire gold_f, dut_f, raw_dut_f; reg seen_f='0;
stimulus_gen stim1(.clk(clk),.x3(raw_x3),.x2(raw_x2),.x1(raw_x1),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.x3(drive_x3),.x2(drive_x2),.x1(drive_x1),.f(gold_f));
TopModule dut(.x3(drive_x3),.x2(drive_x2),.x1(drive_x1),.f(raw_dut_f));
assign dut_f=raw_dut_f;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_f === 1'b0 || gold_f === 1'b1) begin
known=1; seen_f=1'b1;
if(dut_f !== gold_f) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_f) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:f");
if(checks != 114) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
