`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic d, r
);
integer netlist_random_seed=1;


	initial begin #101;
		repeat(100) @(posedge clk, negedge clk) begin
			{d,r} <= $random(netlist_random_seed);
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input d,
  input r,
  output logic q
);

  always@(posedge clk) begin
    if (r)
      q <= 0;
    else
      q <= d;
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;
wire raw_r; wire drive_r; assign #0.1 drive_r=raw_r;
wire gold_q, dut_q, raw_dut_q; reg seen_q='0;
stimulus_gen stim1(.clk(clk),.d(raw_d),.r(raw_r));
oracle_RefModule gold(.clk(clk),.d(drive_d),.r(drive_r),.q(gold_q));
TopModule dut(.clk(clk),.d(drive_d),.r(drive_r),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_q === 1'b0 || gold_q === 1'b1) begin
known=1; seen_q=1'b1;
if(dut_q !== gold_q) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:q");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
