`timescale 1ns/1ps
module netlist_tb;
integer checks=0, mismatches=0;
reg in=0; wire out; integer i; TopModule dut(.in(in), .out(out));
initial begin
#101; 
for(i=0;i<2;i=i+1) begin in=i; #1; checks=checks+1; if(out !== (in)) mismatches=mismatches+1; end
$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish; end
endmodule
