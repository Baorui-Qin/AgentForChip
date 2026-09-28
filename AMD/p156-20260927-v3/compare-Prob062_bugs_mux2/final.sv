module TopModule (
    input        sel,
    input  [7:0] a,
    input  [7:0] b,
    output [7:0] out
);

    // 8-bit 2-to-1 multiplexer: out = a when sel == 0, out = b when sel == 1
    // Full 8-bit width must be preserved (no truncation to a single bit).
    assign out = sel ? a : b;

endmodule
