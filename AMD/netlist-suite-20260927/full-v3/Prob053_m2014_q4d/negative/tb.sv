`timescale 1ns/1ps
module netlist_tb;
reg clk=0, in=0, expected; wire raw_dut_out, dut_out;
integer checks=0, mismatches=0, i;
TopModule dut(.clk(clk), .in(in), .out(raw_dut_out));
assign dut_out=1'b0;
task sample; begin checks=checks+1; if(dut_out !== expected) mismatches=mismatches+1; end endtask
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID");
if(dut_out !== 1'b0 && dut_out !== 1'b1) $fatal(1,"NETLIST_INITIAL_STATE_UNKNOWN");
expected=dut_out;
for(i=0;i<64;i=i+1) begin
in=(i ^ (i>>1)) & 1; #1; sample();
clk=1; expected=expected ^ in; #1; sample();
clk=0; #1; sample();
end
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches); $finish;
end
endmodule
