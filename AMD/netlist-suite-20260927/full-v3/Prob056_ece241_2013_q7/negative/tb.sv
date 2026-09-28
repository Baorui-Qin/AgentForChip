`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic j, k,
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
		{j,k} <= 1;
		
		@(negedge clk) wavedrom_start();
			@(posedge clk) {j,k} <= 2'h1;
			@(posedge clk) {j,k} <= 2'h2;
			@(posedge clk) {j,k} <= 2'h3;
			@(posedge clk) {j,k} <= 2'h3;
			@(posedge clk) {j,k} <= 2'h3;
			@(posedge clk) {j,k} <= 2'h0;
			@(posedge clk) {j,k} <= 2'h0;
			@(posedge clk) {j,k} <= 2'h0;
			@(posedge clk) {j,k} <= 2'h2;
			@(posedge clk) {j,k} <= 2'h2;
		@(negedge clk) wavedrom_stop();
		repeat(400) @(posedge clk, negedge clk)
			{j,k} <= $random(netlist_random_seed);
		$finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input j,
  input k,
  output reg Q
);

  always @(posedge clk)
    Q <= j&~Q | ~k&Q;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_j; wire drive_j; assign #0.1 drive_j=raw_j;
wire raw_k; wire drive_k; assign #0.1 drive_k=raw_k;
wire gold_Q, dut_Q, raw_dut_Q; reg seen_Q='0;
stimulus_gen stim1(.clk(clk),.j(raw_j),.k(raw_k),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.j(drive_j),.k(drive_k),.Q(gold_Q));
TopModule dut(.clk(clk),.j(drive_j),.k(drive_k),.Q(raw_dut_Q));
assign dut_Q=~raw_dut_Q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_Q === 1'b0 || gold_Q === 1'b1) begin
known=1; seen_Q=1'b1;
if(dut_Q !== gold_Q) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_Q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Q");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
