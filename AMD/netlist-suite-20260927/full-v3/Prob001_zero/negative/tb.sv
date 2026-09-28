`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13

module stimulus_gen (
	input clk,
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



	initial begin #101;
		wavedrom_start("Output should 0");
		repeat(20) @(posedge clk, negedge clk);
		wavedrom_stop();
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  output zero
);

  assign zero = 1'b0;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;

wire gold_zero, dut_zero, raw_dut_zero; reg seen_zero='0;
stimulus_gen stim1(.clk(clk),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.zero(gold_zero));
TopModule dut(.zero(raw_dut_zero));
assign dut_zero=~raw_dut_zero;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_zero === 1'b0 || gold_zero === 1'b1) begin
known=1; seen_zero=1'b1;
if(dut_zero !== gold_zero) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_zero) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:zero");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
