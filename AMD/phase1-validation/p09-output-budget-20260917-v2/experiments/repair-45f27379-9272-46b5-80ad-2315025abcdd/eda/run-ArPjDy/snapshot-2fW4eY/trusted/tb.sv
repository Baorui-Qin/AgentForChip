`timescale 1ns/1ps
module tb;
reg clk=0, rst=1;
integer checks=0, mismatches=0, i;
reg in_valid=0,out_ready=0; reg [7:0] in_data=0,expected_data=0; reg occupied=0; wire in_ready,out_valid; wire [7:0] out_data; reg accept;
ready_valid_slot dut(.clk(clk),.rst(rst),.in_valid(in_valid),.in_data(in_data),.in_ready(in_ready),.out_valid(out_valid),.out_data(out_data),.out_ready(out_ready));
initial begin
for(i=0;i<256;i=i+1) begin
rst=(i==0 || i==127); in_valid=(i%5!=0); out_ready=(i%7>=3); in_data=(i*37)%256;
#1; if(i>0) begin checks=checks+1; if (in_ready !== (!occupied || out_ready)) mismatches=mismatches+1; end
accept=(!occupied || out_ready); if(rst) begin occupied=0; expected_data=0; end else if(accept) begin occupied=in_valid; if(in_valid) expected_data=in_data; end
#5; clk=1; #1;checks=checks+1; if (out_valid !== occupied || (occupied && out_data !== expected_data)) mismatches=mismatches+1;#4; clk=0;
end
$display("Mismatches: %0d in %0d samples", mismatches, checks); $finish;
end
initial begin #1000000; $display("TIMEOUT"); $finish; end
endmodule
