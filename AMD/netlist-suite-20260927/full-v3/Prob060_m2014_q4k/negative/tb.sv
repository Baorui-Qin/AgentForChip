`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic in, resetn
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk) begin
			in <= $random(netlist_random_seed);
			resetn <= ($random(netlist_random_seed) & 7) != 0;
		end
		repeat(100) @(posedge clk, negedge clk) begin
			in <= $random(netlist_random_seed);
			resetn <= ($random(netlist_random_seed) & 7) != 0;
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input resetn,
  input in,
  output out
);

  reg [3:0] sr;
  always @(posedge clk) begin
    if (~resetn)
      sr <= '0;
    else
      sr <= {sr[2:0], in};
  end

  assign out = sr[3];

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_resetn; wire drive_resetn; assign #0.1 drive_resetn=raw_resetn;
wire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;
wire gold_out, dut_out, raw_dut_out; reg seen_out='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.resetn(raw_resetn));
oracle_RefModule gold(.clk(clk),.resetn(drive_resetn),.in(drive_in),.out(gold_out));
TopModule dut(.clk(clk),.resetn(drive_resetn),.in(drive_in),.out(raw_dut_out));
assign dut_out=~raw_dut_out;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out === 1'b0 || gold_out === 1'b1) begin
known=1; seen_out=1'b1;
if(dut_out !== gold_out) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
