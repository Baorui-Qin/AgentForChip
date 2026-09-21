`timescale 1ns/1ps
module tb;
reg clk=0, rst=1;
integer checks=0, mismatches=0, i;
reg en=0; reg [3:0] expected=0; wire [3:0] q;
enable_counter dut(.clk(clk),.rst(rst),.en(en),.q(q));
initial begin
for(i=0;i<128;i=i+1) begin
rst=(i==0 || i==63); en=(i%3!=0);
if(rst) expected=0; else if(en) expected=expected+1;
#5; clk=1; #1;checks=checks+1; if (q !== expected) mismatches=mismatches+1;#4; clk=0;
end
$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish;
end
initial begin #1000000; $display("TIMEOUT"); $finish; end
endmodule
