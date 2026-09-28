module TopModule (
    input        sel,
    input  [7:0] a,
    input  [7:0] b,
    output [7:0] out
);

    // 8-bit 2-to-1 multiplexer: sel = 0 selects a, sel = 1 selects b.
    // Both operands and the result are full 8 bits wide, so no truncation.
    assign out = (~{8{sel}} & a) | ({8{sel}} & b);

endmodule
