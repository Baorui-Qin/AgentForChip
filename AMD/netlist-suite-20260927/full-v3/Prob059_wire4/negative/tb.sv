`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a, b, c,
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
		{a,b,c} <= $random(netlist_random_seed);
	
	initial begin #101;
		@(negedge clk) wavedrom_start();
			repeat(8) @(posedge clk);
		@(negedge clk) wavedrom_stop();
		repeat(100) @(negedge clk);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input a,
  input b,
  input c,
  output w,
  output x,
  output y,
  output z
);

  assign {w,x,y,z} = {a,b,b,c};

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire raw_b; wire drive_b; assign #0.1 drive_b=raw_b;
wire raw_c; wire drive_c; assign #0.1 drive_c=raw_c;
wire gold_w, dut_w, raw_dut_w; reg seen_w='0;
wire gold_x, dut_x, raw_dut_x; reg seen_x='0;
wire gold_y, dut_y, raw_dut_y; reg seen_y='0;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.w(gold_w),.x(gold_x),.y(gold_y),.z(gold_z));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.w(raw_dut_w),.x(raw_dut_x),.y(raw_dut_y),.z(raw_dut_z));
assign dut_w=~raw_dut_w;
assign dut_x=~raw_dut_x;
assign dut_y=~raw_dut_y;
assign dut_z=~raw_dut_z;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_w === 1'b0 || gold_w === 1'b1) begin
known=1; seen_w=1'b1;
if(dut_w !== gold_w) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_x === 1'b0 || gold_x === 1'b1) begin
known=1; seen_x=1'b1;
if(dut_x !== gold_x) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_y === 1'b0 || gold_y === 1'b1) begin
known=1; seen_y=1'b1;
if(dut_y !== gold_y) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_z === 1'b0 || gold_z === 1'b1) begin
known=1; seen_z=1'b1;
if(dut_z !== gold_z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_w) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:w");
if((&seen_x) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:x");
if((&seen_y) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:y");
if((&seen_z) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:z");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
