module TopModule (
    input        sel,
    input  [7:0] a,
    input  [7:0] b,
    output [7:0] out
);

    // 2-to-1 mux: sel==1 selects a, sel==0 selects b
    assign out = (sel & a) | (~sel & b);

endmodule