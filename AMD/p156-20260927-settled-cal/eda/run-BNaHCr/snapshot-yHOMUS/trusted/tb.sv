`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	input tb_match,
	output reg [31:0] in,
	output reg reset,
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
		in <= 0;
		reset <= 1;
		@(posedge clk);
		reset <= 1;
		in = 0;
		@(negedge clk) wavedrom_start("Example");
		repeat(1) @(posedge clk);
		reset = 0;
		@(posedge clk) in = 32'h2;
		repeat(4) @(posedge clk);
		in = 32'he;
		repeat(2) @(posedge clk);
		in = 0;
		@(posedge clk) in = 32'h2;
		repeat(2) @(posedge clk);
		reset = 1;
		@(posedge clk);
		reset = 0; in = 0;
		repeat(3) @(posedge clk);

		@(negedge clk) wavedrom_stop();


		@(negedge clk) wavedrom_start("");
		repeat(2) @(posedge clk);
		in <= 1;
		repeat(2) @(posedge clk);
		in <= 0;
		repeat(2) @(negedge clk);
		in <= 6;
		repeat(1) @(negedge clk);
		in <= 0;		
		repeat(2) @(posedge clk);
		in <= 32'h10;		
		repeat(2) @(posedge clk);
		reset <= 1;
		repeat(1) @(posedge clk);
		in <= 32'h0;
		repeat(1) @(posedge clk);
		reset <= 0;
		repeat(1) @(posedge clk);
		reset <= 1;
		in <= 32'h20;
		repeat(1) @(posedge clk);
		reset <= 0;
		in <= 32'h00;
	
		repeat(2) @(posedge clk);

		@(negedge clk) wavedrom_stop();
	
		repeat(200)
			@(posedge clk, negedge clk) begin
				in <= $random(netlist_random_seed);
				reset <= !($random(netlist_random_seed) & 15);
			end
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input [31:0] in,
  output reg [31:0] out
);

  reg [31:0] d_last;

  always @(posedge clk) begin
    d_last <= in;
    if (reset)
      out <= '0;
    else
      out <= out | (~in & d_last);
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire [31:0] raw_in; wire [31:0] drive_in; assign #0.1 drive_in=raw_in;
wire [31:0] gold_out, dut_out, raw_dut_out; reg [31:0] seen_out='0;
stimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.out(gold_out));
TopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<32;b=b+1) begin
if(gold_out[b] === 1'b0 || gold_out[b] === 1'b1) begin
known=1; seen_out[b]=1'b1;
if(dut_out[b] !== gold_out[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out");
if(checks != 530) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
