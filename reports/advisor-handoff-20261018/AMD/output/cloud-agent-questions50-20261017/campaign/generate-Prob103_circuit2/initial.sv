module TopModule(
    input  wire a,
    input  wire b,
    input  wire c,
    input  wire d,
    output wire q
);
    // Implement q = (a ^ b) ^ (c ^ d)
    assign q = (a ^ b) ^ (c ^ d);
endmodule