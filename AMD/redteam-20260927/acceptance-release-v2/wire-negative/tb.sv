`timescale 1ns/1ps
module netlist_tb;
integer checks=0, mismatches=0;
reg in=0; wire out; integer i; TopModule dut(.in(in), .out(out));
initial begin
#101; if (glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1, "GSR_STARTUP_INVALID");
for(i=0;i<2;i=i+1) begin in=i; #1; checks=checks+1; if(out === (in)) mismatches=mismatches+1; end
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d", checks, mismatches); $finish; end
endmodule
