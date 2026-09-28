`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	input tb_match,
	output reg [7:0] in,
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
		@(posedge clk);
		wavedrom_start("");
		repeat(2) @(posedge clk);
		in <= 1;
		repeat(4) @(posedge clk);
		in <= 0;
		repeat(4) @(negedge clk);
		in <= 6;
		repeat(2) @(negedge clk);
		in <= 0;		
		repeat(2) @(posedge clk);
		wavedrom_stop();

		repeat(200)
			@(posedge clk, negedge clk) in <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input [7:0] in,
  output reg [7:0] pedge
);

  reg [7:0] d_last;

  always @(posedge clk) begin
    d_last <= in;
    pedge <= in & ~d_last;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [7:0] raw_in; wire [7:0] drive_in; assign #0.1 drive_in=raw_in;
wire [7:0] gold_pedge, dut_pedge, raw_dut_pedge; reg [7:0] seen_pedge='0;
stimulus_gen stim1(.clk(clk),.tb_match(1'b1),.in(raw_in),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.in(drive_in),.pedge(gold_pedge));
TopModule dut(.clk(clk),.in(drive_in),.pedge(raw_dut_pedge));
assign dut_pedge=raw_dut_pedge;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<8;b=b+1) begin
if(gold_pedge[b] === 1'b0 || gold_pedge[b] === 1'b1) begin
known=1; seen_pedge[b]=1'b1;
if(dut_pedge[b] !== gold_pedge[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_pedge) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:pedge");
if(checks != 452) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
