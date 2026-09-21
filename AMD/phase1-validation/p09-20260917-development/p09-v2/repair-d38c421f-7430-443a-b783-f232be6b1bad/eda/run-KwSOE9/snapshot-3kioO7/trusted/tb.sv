`timescale 1ns/1ps
module tb;
reg clk=0, rst=1;
integer checks=0, mismatches=0, i;
reg signed [7:0] a=0,b=0; wire signed [7:0] sum; integer expected=0;
signed_saturating_add dut(.clk(clk),.rst(rst),.a(a),.b(b),.sum(sum));
initial begin
for(i=0;i<65536;i=i+1) begin
rst=(i==0 || i==32768); a=i/256-128; b=i%256-128;
expected=$signed(a)+$signed(b); if(expected>127) expected=127; if(expected< -128) expected= -128; if(rst) expected=0;
#5; clk=1; #1;checks=checks+1; if ($signed(sum) !== expected) mismatches=mismatches+1;#4; clk=0;
end
$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish;
end
initial begin #1000000; $display("TIMEOUT"); $finish; end
endmodule
