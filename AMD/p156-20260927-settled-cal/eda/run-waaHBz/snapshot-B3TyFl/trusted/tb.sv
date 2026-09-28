`timescale 1ns/1ps
module netlist_tb;
integer checks=0, mismatches=0;
reg in=0; wire out; integer i; TopModule dut(.in(in), .out(out));
initial begin
#101; 
for(i=0;i<2;i=i+1) begin in=i; #1; checks=checks+1; if(out !== (~in)) mismatches=mismatches+1; end
if(checks != 2) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks); $finish; end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
