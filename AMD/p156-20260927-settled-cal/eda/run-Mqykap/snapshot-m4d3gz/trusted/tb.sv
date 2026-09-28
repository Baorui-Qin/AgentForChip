`timescale 1ns/1ps
module netlist_tb;
reg clk=0, in=0, expected; wire raw_dut_out, dut_out;
integer checks=0, mismatches=0, i;
TopModule dut(.clk(clk), .in(in), .out(raw_dut_out));
assign dut_out=raw_dut_out;
task sample; begin checks=checks+1; if(dut_out !== expected) mismatches=mismatches+1; end endtask
initial begin #101; 
if(dut_out !== 1'b0 && dut_out !== 1'b1) $fatal(1,"NETLIST_INITIAL_STATE_UNKNOWN");
expected=dut_out;
for(i=0;i<64;i=i+1) begin
in=(i ^ (i>>1)) & 1; #1; sample();
clk=1; expected=expected ^ in; #1; sample();
clk=0; #1; sample();
end
if(checks != 192) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks); $finish;
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
