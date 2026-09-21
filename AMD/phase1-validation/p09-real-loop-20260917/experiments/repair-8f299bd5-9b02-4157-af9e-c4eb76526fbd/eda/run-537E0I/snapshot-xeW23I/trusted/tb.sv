`timescale 1ns/1ps
module tb;
reg clk=0, rst=1;
integer checks=0, mismatches=0, i;
reg din=0, previous=0, expected=0; wire pulse;
rising_edge dut(.clk(clk),.rst(rst),.din(din),.pulse(pulse));
initial begin
for(i=0;i<128;i=i+1) begin
rst=(i==0 || i==63); din=((i%7)<4);
if(rst) begin previous=0; expected=0; end else begin expected=din & ~previous; previous=din; end
#5; clk=1; #1;checks=checks+1; if (pulse !== expected) mismatches=mismatches+1;#4; clk=0;
end
$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish;
end
initial begin #1000000; $display("TIMEOUT"); $finish; end
endmodule
