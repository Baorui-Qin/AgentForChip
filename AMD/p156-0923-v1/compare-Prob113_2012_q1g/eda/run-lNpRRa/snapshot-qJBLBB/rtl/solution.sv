module TopModule (
    input  [3:0] x,
    output       f
);
    // f = sum of minterms (x[3] x[2] x[1] x[0]):
    // 0000 0001 0100 0101 0110 1100 1101 1111
    assign f = (~x[3] & ~x[1]) |
               ( x[2] & ~x[1]) |
               (~x[3] &  x[2] & ~x[0]) |
               ( x[3] &  x[2] &  x[1] & x[0]);
endmodule
