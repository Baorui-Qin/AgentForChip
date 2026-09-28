module TopModule (
    input  [3:0] x,
    output       f
);
    // Karnaugh map: rows x[2]x[3], columns x[0]x[1]
    // f=1 at x = 0,1,4,5,6,12,14,15
    assign f = (~x[3] & ~x[1])   // covers 0,1,4,5
             | ( x[2] & ~x[0])   // covers 4,6,12,14
             | ( x[3] &  x[2] & x[1]); // covers 14,15
endmodule
