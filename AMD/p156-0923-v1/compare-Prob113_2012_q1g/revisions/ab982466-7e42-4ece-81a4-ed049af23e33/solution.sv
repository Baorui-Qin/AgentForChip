module TopModule (
    input  [3:0] x,
    output       f
);
    // K-map (columns x[0]x[1], rows x[2]x[3]) yields f = 1 for
    // x = 0000,0010,0100,0101,0110,1100,1101,1111
    // Minimal SOP: x3'x0' + x3x2x0 + x3x2x1' + x2x1'x0
    assign f = (~x[3] & ~x[0]) |
               (x[3] & x[2] & x[0]) |
               (x[3] & x[2] & ~x[1]) |
               (x[2] & ~x[1] & x[0]);
endmodule
