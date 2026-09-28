`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13



module stimulus_gen (
	input clk,
	output logic [7:0] code,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
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


	
	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		code <= 8'h45;
		@(negedge clk) wavedrom_start("Decode scancodes");
			@(posedge clk) code <= 8'h45;
			@(posedge clk) code <= 8'h03;
			@(posedge clk) code <= 8'h46;
			@(posedge clk) code <= 8'h16;
			@(posedge clk) code <= 8'd26;
			@(posedge clk) code <= 8'h1e;
			@(posedge clk) code <= 8'h25;
			@(posedge clk) code <= 8'h26;
			@(posedge clk) code <= 8'h2e;
			@(posedge clk) code <= $random(netlist_random_seed);
			@(posedge clk) code <= 8'h36;
			@(posedge clk) code <= $random(netlist_random_seed);
			@(posedge clk) code <= 8'h3d;
			@(posedge clk) code <= 8'h3e;
			@(posedge clk) code <= 8'h45;
			@(posedge clk) code <= 8'h46;
			@(posedge clk) code <= $random(netlist_random_seed);
			@(posedge clk) code <= $random(netlist_random_seed);
			@(posedge clk) code <= $random(netlist_random_seed);
			@(posedge clk) code <= $random(netlist_random_seed);
		wavedrom_stop();
		
		repeat(1000) @(posedge clk, negedge clk) begin
			code <= $urandom;
		end
			
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [7:0] code,
  output reg [3:0] out,
  output reg valid
);

  // uhh.. make a case statement: maps scancode to 0-9, but accidentally
  // infer a latch? and have one of the entries be wrong? (duplicate
  // case, using different base!)

  always @(*) begin
    out = 0;
    valid = 1;
    case (code)
      8'h45: out = 0;
      8'h16: out = 1;
      8'h1e: out = 2;
      8'h26: out = 3;
      8'h25: out = 4;
      8'h2e: out = 5;
      8'h36: out = 6;
      8'h3d: out = 7;
      8'h3e: out = 8;
      8'h46: out = 9;
      default: valid = 0;
    endcase
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [7:0] raw_code; wire [7:0] drive_code; assign #0.1 drive_code=raw_code;
wire [3:0] gold_out, dut_out, raw_dut_out; reg [3:0] seen_out='0;
wire gold_valid, dut_valid, raw_dut_valid; reg seen_valid='0;
stimulus_gen stim1(.clk(clk),.code(raw_code),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.code(drive_code),.out(gold_out),.valid(gold_valid));
TopModule dut(.code(drive_code),.out(raw_dut_out),.valid(raw_dut_valid));
assign dut_out=raw_dut_out;
assign dut_valid=raw_dut_valid;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_valid === 1'b0 || gold_valid === 1'b1) begin
known=1; seen_valid=1'b1;
if(dut_valid !== gold_valid) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
if((&seen_valid) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:valid");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
