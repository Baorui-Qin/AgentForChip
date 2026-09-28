`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic a,
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
		a <= 1;
		@(negedge clk) {a} <= 1;
		@(negedge clk) wavedrom_start("Unknown circuit");
			repeat(2) @(posedge clk);
			@(posedge clk) {a} <= 0;
			repeat(11) @(posedge clk);
			@(negedge clk) a <= 1;
			repeat(5) @(posedge clk, negedge clk);
			a <= 0;
			repeat(4) @(posedge clk);
		wavedrom_stop();

		repeat(200) @(posedge clk, negedge clk)
			a <= &((5)'($urandom));
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input a,
  output reg [2:0] q
);

  always @(posedge clk)
    if (a)
      q <= 4;
    else if (q == 6)
      q <= 0;
    else
      q <= q + 1'b1;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_a; wire drive_a; assign #0.1 drive_a=raw_a;
wire [2:0] gold_q, dut_q, raw_dut_q; reg [2:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.clk(clk),.a(drive_a),.q(gold_q));
TopModule dut(.clk(clk),.a(drive_a),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<3;b=b+1) begin
if(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin
known=1; seen_q[b]=1'b1;
if(dut_q[b] !== gold_q[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:q");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
