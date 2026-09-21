module TopModule (
    input  logic clk,
    input  logic d,
    output logic q
);
    logic p, n;

    // Two opposite-edge registers whose XOR reproduces a
    // dual-edge triggered flip-flop without an illegal
    // dual-edge sensitivity list or an output-select race.
    always @(posedge clk) p <= d ^ n;
    always @(negedge clk) n <= d ^ p;

    assign q = p ^ n;
endmodule
