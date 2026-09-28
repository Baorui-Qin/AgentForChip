module TopModule (
    input  [3:0] x,
    output       f
);
    // K-map rows indexed by x[2]x[3], columns by x[0]x[1]
    // Row 00: cols 00=1, 01=0, 11=0, 10=1
    // Row 01: all 0
    // Row 11: cols 00=1, 01=1, 11=1, 10=0
    // Row 10: cols 00=1, 01=1, 11=0, 10=1
    assign f = (~x[3] & ~x[2] & ~x[1] & ~x[0]) |
               (~x[3] & ~x[2] &  x[1] & ~x[0]) |
               ( x[3] &  x[2] & ~x[1] & ~x[0]) |
               ( x[3] &  x[2] &  x[1] & ~x[0]) |
               ( x[3] &  x[2] &  x[1] &  x[0]) |
               ( x[3] & ~x[2] & ~x[1] & ~x[0]) |
               ( x[3] & ~x[2] &  x[1] & ~x[0]) |
               ( x[3] & ~x[2] & ~x[1] &  x[0]);
endmodule
