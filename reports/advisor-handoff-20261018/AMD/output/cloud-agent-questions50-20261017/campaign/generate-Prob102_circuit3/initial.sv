module TopModule(
    input  wire a,
    input  wire b,
    input  wire c,
    input  wire d,
    output wire q
);
    // Combinational logic derived from the waveform table
    assign q = (b & (c | d)) | (~b & d);
endmodule