`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [4:0] a,b,c,d,e,f,
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
		wavedrom_start("");
		@(posedge clk) {a,b,c,d,e,f} <= '0;
		@(posedge clk) {a,b,c,d,e,f} <= 1;
		@(posedge clk) {a,b,c,d,e,f} <= 2;
		@(posedge clk) {a,b,c,d,e,f} <= 4;
		@(posedge clk) {a,b,c,d,e,f} <= 8;
		@(posedge clk) {a,b,c,d,e,f} <= 'h10;
		@(posedge clk) {a,b,c,d,e,f} <= 'h20;
		@(posedge clk) {a,b,c,d,e,f} <= 'h40;
		@(posedge clk) {a,b,c,d,e,f} <= 'h80;
		@(posedge clk) {a,b,c,d,e,f} <= 'h100;
		@(posedge clk) {a,b,c,d,e,f} <= 'h200;
		@(posedge clk) {a,b,c,d,e,f} <= 'h400;
		@(posedge clk) {a,b,c,d,e,f} <= {5'h1f, 5'h0, 5'h1f, 5'h0, 5'h1f, 5'h0};
		@(negedge clk);
		wavedrom_stop();
		repeat(100) @(posedge clk, negedge clk)
			{a,b,c,d,e,f} <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [4:0] a,
  input [4:0] b,
  input [4:0] c,
  input [4:0] d,
  input [4:0] e,
  input [4:0] f,
  output [7:0] w,
  output [7:0] x,
  output [7:0] y,
  output [7:0] z
);

  assign { w,x,y,z} = {a,b,c,d,e,f,2'b11};

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [4:0] raw_a; wire [4:0] drive_a; assign #0.1 drive_a=raw_a;
wire [4:0] raw_b; wire [4:0] drive_b; assign #0.1 drive_b=raw_b;
wire [4:0] raw_c; wire [4:0] drive_c; assign #0.1 drive_c=raw_c;
wire [4:0] raw_d; wire [4:0] drive_d; assign #0.1 drive_d=raw_d;
wire [4:0] raw_e; wire [4:0] drive_e; assign #0.1 drive_e=raw_e;
wire [4:0] raw_f; wire [4:0] drive_f; assign #0.1 drive_f=raw_f;
wire [7:0] gold_w, dut_w, raw_dut_w; reg [7:0] seen_w='0;
wire [7:0] gold_x, dut_x, raw_dut_x; reg [7:0] seen_x='0;
wire [7:0] gold_y, dut_y, raw_dut_y; reg [7:0] seen_y='0;
wire [7:0] gold_z, dut_z, raw_dut_z; reg [7:0] seen_z='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.b(raw_b),.c(raw_c),.d(raw_d),.e(raw_e),.f(raw_f),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.w(gold_w),.x(gold_x),.y(gold_y),.z(gold_z));
TopModule dut(.a(drive_a),.b(drive_b),.c(drive_c),.d(drive_d),.e(drive_e),.f(drive_f),.w(raw_dut_w),.x(raw_dut_x),.y(raw_dut_y),.z(raw_dut_z));
assign dut_w=raw_dut_w;
assign dut_x=raw_dut_x;
assign dut_y=raw_dut_y;
assign dut_z=raw_dut_z;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_w[b] === 1'b0 || gold_w[b] === 1'b1) begin
known=1; seen_w[b]=1'b1;
if(dut_w[b] !== gold_w[b]) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_x[b] === 1'b0 || gold_x[b] === 1'b1) begin
known=1; seen_x[b]=1'b1;
if(dut_x[b] !== gold_x[b]) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_y[b] === 1'b0 || gold_y[b] === 1'b1) begin
known=1; seen_y[b]=1'b1;
if(dut_y[b] !== gold_y[b]) bad=1;
end end
for(integer b=0;b<8;b=b+1) begin
if(gold_z[b] === 1'b0 || gold_z[b] === 1'b1) begin
known=1; seen_z[b]=1'b1;
if(dut_z[b] !== gold_z[b]) bad=1;
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
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
