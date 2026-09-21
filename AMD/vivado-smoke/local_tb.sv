`timescale 1ns/1ps
module tb;
    wire zero;
    integer errors = 0;
    integer samples = 0;
    TopModule dut (.zero(zero));
    initial begin
        repeat (20) begin
            #5;
            samples = samples + 1;
            if (zero !== 1'b0) errors = errors + 1;
        end
        $display("Mismatches: %0d in %0d samples", errors, samples);
        $finish;
    end
endmodule
