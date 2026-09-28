`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic [2:0] a,
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
		@(negedge clk) wavedrom_start("Unknown circuit");
			@(posedge clk) {a} <= 0;
			repeat(10) @(posedge clk,negedge clk) a <= a + 1;
		wavedrom_stop();

		repeat(100) @(posedge clk, negedge clk)
			a <= $urandom;
		$finish;
	end end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input [2:0] a,
  output reg [15:0] q
);

  always @(*)
    case (a)
      0: q = 4658;
      1: q = 44768;
      2: q = 10196;
      3: q = 23054;
      4: q = 8294;
      5: q = 25806;
      6: q = 50470;
      7: q = 12057;
    endcase

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire [2:0] raw_a; wire [2:0] drive_a; assign #0.1 drive_a=raw_a;
wire [15:0] gold_q, dut_q, raw_dut_q; reg [15:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.a(raw_a),.wavedrom_title(),.wavedrom_enable());
oracle_RefModule gold(.a(drive_a),.q(gold_q));
TopModule dut(.a(drive_a),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<16;b=b+1) begin
if(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin
known=1; seen_q[b]=1'b1;
if(dut_q[b] !== gold_q[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:q");
if(checks != 220) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
