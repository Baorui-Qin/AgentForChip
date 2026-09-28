`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	input tb_match,
	output logic [99:0] in,
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
		reg [3:0] count; count = 0;
		in <= 100'h0;
		// AND gate uses huge numbers and creates a sparse waveform.
		@(negedge clk) wavedrom_start("Test AND gate");
			@(posedge clk,negedge clk) in <= 100'h0;		// Test OR gate
			@(posedge clk,negedge clk); in <= ~100'h0;		// Test AND gate
			@(posedge clk,negedge clk); in <= 100'h3ffff;	
			@(posedge clk,negedge clk); in <= ~100'h3ffff;	
			@(posedge clk,negedge clk); in <= 100'h80;		
			@(posedge clk,negedge clk); in <= ~100'h80;		
		wavedrom_stop();

		@(negedge clk) wavedrom_start("Test OR and XOR gates");
			@(posedge clk) in <= 100'h0;		// Test OR gate
			@(posedge clk); in <= 100'h7;		// Test AND gate
			repeat(10) @(posedge clk, negedge clk) begin
				in <= count;		
				count <= count + 1;
			end
			@(posedge clk) in <= 100'h0;
		@(negedge clk) wavedrom_stop();
		
		in <= $random(netlist_random_seed);
		repeat(100) begin
			@(negedge clk) in <= $random(netlist_random_seed);
			@(posedge clk) in <= $random(netlist_random_seed);
		end
		for (int i=0;i<100;i++) begin
			@(negedge clk) in <= 100'h1<<i;
			@(posedge clk) in <= ~(100'h1<<i);
		end
		@(posedge clk) in <= 100'h0;		// Test OR gate
		@(posedge clk); in <= ~100'h0;		// Test AND gate
		@(posedge clk);
		#1 $finish;
	end end
		
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [99:0] in,
  output out_and,
  output out_or,
  output out_xor
);

  assign out_and = &in;
  assign out_or = |in;
  assign out_xor = ^in;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [99:0] raw_in; wire [99:0] drive_in; assign #0.1 drive_in=raw_in;
wire gold_out_and, dut_out_and, raw_dut_out_and; reg seen_out_and='0;
wire gold_out_or, dut_out_or, raw_dut_out_or; reg seen_out_or='0;
wire gold_out_xor, dut_out_xor, raw_dut_out_xor; reg seen_out_xor='0;
stimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.out_and(gold_out_and),.out_or(gold_out_or),.out_xor(gold_out_xor));
TopModule dut(.in(drive_in),.out_and(raw_dut_out_and),.out_or(raw_dut_out_or),.out_xor(raw_dut_out_xor));
assign dut_out_and=~raw_dut_out_and;
assign dut_out_or=~raw_dut_out_or;
assign dut_out_xor=~raw_dut_out_xor;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out_and === 1'b0 || gold_out_and === 1'b1) begin
known=1; seen_out_and=1'b1;
if(dut_out_and !== gold_out_and) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_or === 1'b0 || gold_out_or === 1'b1) begin
known=1; seen_out_or=1'b1;
if(dut_out_or !== gold_out_or) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_out_xor === 1'b0 || gold_out_xor === 1'b1) begin
known=1; seen_out_xor=1'b1;
if(dut_out_xor !== gold_out_xor) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_and) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_and");
if((&seen_out_or) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_or");
if((&seen_out_xor) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_xor");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
