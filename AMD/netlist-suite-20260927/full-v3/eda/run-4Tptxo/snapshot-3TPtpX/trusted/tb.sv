`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [15:0] scancode, 
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



	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		@(negedge clk) wavedrom_start("Recognize arrow keys");
			@(posedge clk) scancode <= 16'h0;
			@(posedge clk) scancode <= 16'h1;
			@(posedge clk) scancode <= 16'he075;
			@(posedge clk) scancode <= 16'he06b;
			@(posedge clk) scancode <= 16'he06c;
			@(posedge clk) scancode <= 16'he072;
			@(posedge clk) scancode <= 16'he074;
			@(posedge clk) scancode <= 16'he076;
			@(posedge clk) scancode <= 16'hffff;
		@(negedge clk) wavedrom_stop();

		repeat(30000) @(posedge clk, negedge clk) begin
			scancode <= $urandom;
		end
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [15:0] scancode,
  output reg left,
  output reg down,
  output reg right,
  output reg up
);

  always @(*) begin
    {up, left, down, right} = 0;
    case (scancode)
      16'he06b: left = 1;
      16'he072: down = 1;
      16'he074: right = 1;
      16'he075: up = 1;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [15:0] raw_scancode; wire [15:0] drive_scancode; assign #0.1 drive_scancode=raw_scancode;
wire gold_left, dut_left, raw_dut_left; reg seen_left='0;
wire gold_down, dut_down, raw_dut_down; reg seen_down='0;
wire gold_right, dut_right, raw_dut_right; reg seen_right='0;
wire gold_up, dut_up, raw_dut_up; reg seen_up='0;
stimulus_gen stim1(.clk(clk),.scancode(raw_scancode),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.scancode(drive_scancode),.left(gold_left),.down(gold_down),.right(gold_right),.up(gold_up));
TopModule dut(.scancode(drive_scancode),.left(raw_dut_left),.down(raw_dut_down),.right(raw_dut_right),.up(raw_dut_up));
assign dut_left=raw_dut_left;
assign dut_down=raw_dut_down;
assign dut_right=raw_dut_right;
assign dut_up=raw_dut_up;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_left === 1'b0 || gold_left === 1'b1) begin
known=1; seen_left=1'b1;
if(dut_left !== gold_left) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_down === 1'b0 || gold_down === 1'b1) begin
known=1; seen_down=1'b1;
if(dut_down !== gold_down) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_right === 1'b0 || gold_right === 1'b1) begin
known=1; seen_right=1'b1;
if(dut_right !== gold_right) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_up === 1'b0 || gold_up === 1'b1) begin
known=1; seen_up=1'b1;
if(dut_up !== gold_up) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_left) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:left");
if((&seen_down) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:down");
if((&seen_right) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:right");
if((&seen_up) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:up");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
