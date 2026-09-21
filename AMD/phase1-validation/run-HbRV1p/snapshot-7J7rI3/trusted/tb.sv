`timescale 1ns/1ps
module phase1_tb;
reg clk = 0;
reg rst = 1;
wire [3:0] count;
reg [3:0] expected = 0;
integer checks = 0;
integer mismatches = 0;
counter dut(.clk(clk), .rst(rst), .count(count));
always #2.5 clk = ~clk;
initial begin
  repeat (20) begin
    @(posedge clk);
    if (rst) expected = 0; else expected = expected + 1;
    #0.1;
    checks = checks + 1;
    if (count !== expected) mismatches = mismatches + 1;
    @(negedge clk);
    rst = 0;
  end
  $display("PHASE1_COMPLETE checks=%0d mismatches=%0d", checks, mismatches);
  $finish;
end
endmodule
