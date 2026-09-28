
module TopModule (
    input  wire a,
    input  wire b,
    input  wire c,
    input  wire d,
    output wire out,
    output wire out_n
);
    wire and_ab;
    wire and_cd;

    assign and_ab = a & b;
    assign and_cd = c & d;
    assign out    = and_ab | and_cd;
    assign out_n  = ~out;
endmodule
