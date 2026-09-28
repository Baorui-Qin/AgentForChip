`timescale 1ns/1ps
module netlist_tb; reg [15:0] in='1; wire [15:0] out; integer i,checks=0,mismatches=0; TopModule dut(.in(in),.out(out)); initial begin #101; for(i=0;i<16;i=i+1) begin checks=checks+1; $display("META index=%0d output=%0b",i,out[i]); if(out[i] !== 1'b1) mismatches=mismatches+1; end $display("Mismatches: %0d in %0d samples",mismatches,checks); $finish; end endmodule
