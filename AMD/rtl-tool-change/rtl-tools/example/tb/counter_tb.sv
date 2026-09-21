`timescale 1ns/1ps
module counter_tb;
    reg clk = 0;
    reg reset = 1;
    wire [3:0] count;
    integer i;
    counter dut (.clk(clk), .reset(reset), .count(count));
    always #5 clk = ~clk;
    initial begin
        @(posedge clk); #1;
        if (count !== 0) $fatal(1, "reset mismatch");
        @(negedge clk); reset = 0;
        for (i = 1; i <= 20; i = i + 1) begin
            @(posedge clk); #1;
            if (count !== (i % 16)) $fatal(1, "count mismatch at cycle %0d", i);
        end
        $display("PASS");
        $finish;
    end
    initial begin
        #1000;
        $fatal(1, "watchdog expired");
    end
endmodule
