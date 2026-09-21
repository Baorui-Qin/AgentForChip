`timescale 1ns/1ps
module tb;
reg clk=0, rst=1;
integer checks=0, mismatches=0, i;
reg din=0, expected=0; reg [2:0] history=0; integer valid=0; wire hit;
sequence_101 dut(.clk(clk),.rst(rst),.din(din),.hit(hit));
initial begin
for(i=0;i<256;i=i+1) begin
rst=(i==0 || i==127); din=(i%2==0 || i%11==0);
if(rst) begin valid=0; history=0; expected=0; end else begin history={history[1:0],din}; valid=valid+1; expected=(valid>=3 && history==3'b101); end
#5; clk=1; #1;checks=checks+1; if (hit !== expected) mismatches=mismatches+1;#4; clk=0;
end
$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish;
end
initial begin #1000000; $display("TIMEOUT"); $finish; end
endmodule
