`timescale 1ns/1ps
module netlist_tb;
integer checks=0, mismatches=0;
reg clk=0, reset=0; reg [7:0] d=0, expected=0; wire [7:0] q; integer i;
TopModule dut(.clk(clk), .reset(reset), .d(d), .q(q));
initial begin
#101; if (glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1, "GSR_STARTUP_INVALID");
for(i=0;i<256;i=i+1) begin
reset=1; d=i; #1; clk=1; #1; checks=checks+1; if(q !== 8'b0) mismatches=mismatches+1;
clk=0; reset=0; #1; clk=1; #1; expected=d; checks=checks+1; if(q !== expected) mismatches=mismatches+1;
clk=0; d=~d; #1; checks=checks+1; if(q !== expected) mismatches=mismatches+1;
reset=1; #1; checks=checks+1; if(q !== expected) mismatches=mismatches+1; end
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d", checks, mismatches); $finish; end
endmodule
