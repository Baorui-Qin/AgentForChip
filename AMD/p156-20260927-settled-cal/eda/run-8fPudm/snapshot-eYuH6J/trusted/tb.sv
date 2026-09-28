`timescale 1ns/1ps
module netlist_tb;
integer checks=0, mismatches=0;
reg clk=0, reset=0; reg [7:0] d=0, expected=0; wire [7:0] q; integer i;
TopModule dut(.clk(clk), .reset(reset), .d(d), .q(q));
initial begin
#101; 
for(i=0;i<256;i=i+1) begin
reset=1; d=i; #1; clk=1; #1; checks=checks+1; if(q !== 8'b0) mismatches=mismatches+1;
clk=0; reset=0; #1; clk=1; #1; expected=d; checks=checks+1; if(q !== expected) mismatches=mismatches+1;
clk=0; d=~d; #1; checks=checks+1; if(q !== expected) mismatches=mismatches+1;
reset=1; #1; checks=checks+1; if(q !== expected) mismatches=mismatches+1; end
if(checks != 1024) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks); $finish; end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
