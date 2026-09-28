`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	input tb_match,
	output logic [3:0] in,
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
		in <= 4'h3;
		@(negedge clk);
		wavedrom_start();
			@(posedge clk) in <= 3;
			@(posedge clk) in <= 6;
			@(posedge clk) in <= 12;
			@(posedge clk) in <= 9;
			@(posedge clk) in <= 5;
		@(negedge clk);
		wavedrom_stop();
		in <= $random(netlist_random_seed);
		repeat(100) begin
			@(negedge clk) in <= $random(netlist_random_seed);
			@(posedge clk) in <= $random(netlist_random_seed);
		end
		#1 $finish;
	end
		
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input  [3:0] in,
  output [3:0] out_both,
  output [3:0] out_any,
  output [3:0] out_different
);

  assign out_both[2:0] = in[2:0] & in[3:1];
  assign out_any[3:1]  = in[2:0] | in[3:1];
  assign out_different = in^{in[0], in[3:1]};

  // we don't care about out_both[3] or out_any[0]
  assign out_both[3] = 1'bx;
  assign out_any[0]  = 1'bx;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [3:0] raw_in; wire [3:0] drive_in; assign #0.1 drive_in=raw_in;
wire [3:0] gold_out_both, dut_out_both, raw_dut_out_both; reg [3:0] seen_out_both='0;
wire [3:0] gold_out_any, dut_out_any, raw_dut_out_any; reg [3:0] seen_out_any='0;
wire [3:0] gold_out_different, dut_out_different, raw_dut_out_different; reg [3:0] seen_out_different='0;
stimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.in(drive_in),.out_both(gold_out_both),.out_any(gold_out_any),.out_different(gold_out_different));
TopModule dut(.in(drive_in),.out_both(raw_dut_out_both),.out_any(raw_dut_out_any),.out_different(raw_dut_out_different));
assign dut_out_both=~raw_dut_out_both;
assign dut_out_any=~raw_dut_out_any;
assign dut_out_different=~raw_dut_out_different;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_out_both[b] === 1'b0 || gold_out_both[b] === 1'b1) begin
known=1; seen_out_both[b]=1'b1;
if(dut_out_both[b] !== gold_out_both[b]) bad=1;
end end
for(integer b=0;b<4;b=b+1) begin
if(gold_out_any[b] === 1'b0 || gold_out_any[b] === 1'b1) begin
known=1; seen_out_any[b]=1'b1;
if(dut_out_any[b] !== gold_out_any[b]) bad=1;
end end
for(integer b=0;b<4;b=b+1) begin
if(gold_out_different[b] === 1'b0 || gold_out_different[b] === 1'b1) begin
known=1; seen_out_different[b]=1'b1;
if(dut_out_different[b] !== gold_out_different[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out_both) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_both");
if((&seen_out_any) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_any");
if((&seen_out_different) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out_different");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
