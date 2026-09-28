`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg p1a, p1b, p1c, p1d,
	output reg p2a, p2b, p2c, p2d,
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



	initial begin #101; begin
		int count; count = 0;
		{p1a,p1b,p1c,p1d} <= 4'h0;		
		{p2a,p2b,p2c,p2d} <= 4'h0;		
		wavedrom_start("Two NAND gates");
		repeat(20) @(posedge clk) begin
			{p1a,p1b,p1c,p1d} <= count;		
			{p2a,p2b,p2c,p2d} <= count+1;		
			count = count + 1;
		end
		wavedrom_stop();

		repeat(200) @(posedge clk,negedge clk) begin
			{p1a,p1b,p1c,p1d,p2a,p2b,p2c,p2d} <= $random(netlist_random_seed);		
		end
		
		#1 $finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input p1a,
  input p1b,
  input p1c,
  input p1d,
  output p1y,
  input p2a,
  input p2b,
  input p2c,
  input p2d,
  output p2y
);

  assign p1y = ~&( {p1a, p1b, p1c, p1d} );
  assign p2y = ~&( {p2a, p2b, p2c, p2d} );

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_p1a; wire drive_p1a; assign #0.1 drive_p1a=raw_p1a;
wire raw_p1b; wire drive_p1b; assign #0.1 drive_p1b=raw_p1b;
wire raw_p1c; wire drive_p1c; assign #0.1 drive_p1c=raw_p1c;
wire raw_p1d; wire drive_p1d; assign #0.1 drive_p1d=raw_p1d;
wire raw_p2a; wire drive_p2a; assign #0.1 drive_p2a=raw_p2a;
wire raw_p2b; wire drive_p2b; assign #0.1 drive_p2b=raw_p2b;
wire raw_p2c; wire drive_p2c; assign #0.1 drive_p2c=raw_p2c;
wire raw_p2d; wire drive_p2d; assign #0.1 drive_p2d=raw_p2d;
wire gold_p1y, dut_p1y, raw_dut_p1y; reg seen_p1y='0;
wire gold_p2y, dut_p2y, raw_dut_p2y; reg seen_p2y='0;
stimulus_gen stim1(.clk(clk),.p1a(raw_p1a),.p1b(raw_p1b),.p1c(raw_p1c),.p1d(raw_p1d),.p2a(raw_p2a),.p2b(raw_p2b),.p2c(raw_p2c),.p2d(raw_p2d),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.p1a(drive_p1a),.p1b(drive_p1b),.p1c(drive_p1c),.p1d(drive_p1d),.p2a(drive_p2a),.p2b(drive_p2b),.p2c(drive_p2c),.p2d(drive_p2d),.p1y(gold_p1y),.p2y(gold_p2y));
TopModule dut(.p1a(drive_p1a),.p1b(drive_p1b),.p1c(drive_p1c),.p1d(drive_p1d),.p2a(drive_p2a),.p2b(drive_p2b),.p2c(drive_p2c),.p2d(drive_p2d),.p1y(raw_dut_p1y),.p2y(raw_dut_p2y));
assign dut_p1y=raw_dut_p1y;
assign dut_p2y=raw_dut_p2y;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_p1y === 1'b0 || gold_p1y === 1'b1) begin
known=1; seen_p1y=1'b1;
if(dut_p1y !== gold_p1y) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_p2y === 1'b0 || gold_p2y === 1'b1) begin
known=1; seen_p2y=1'b1;
if(dut_p2y !== gold_p2y) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_p1y) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:p1y");
if((&seen_p2y) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:p2y");
if(checks != 477) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
