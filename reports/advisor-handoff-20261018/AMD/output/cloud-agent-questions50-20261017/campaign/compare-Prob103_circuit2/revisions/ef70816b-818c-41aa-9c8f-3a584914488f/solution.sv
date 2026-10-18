module TopModule(
    input  wire a,
    input  wire b,
    input  wire c,
    input  wire d,
    output wire q
);
    // Correct combinational logic derived from waveform
    assign q = (a ^ b) == (c ^ d);
endmodule