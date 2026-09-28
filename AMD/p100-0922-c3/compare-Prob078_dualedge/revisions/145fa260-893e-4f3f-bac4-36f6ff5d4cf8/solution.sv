module TopModule(
    input  logic clk,
    input  logic d,
    output logic q
);

    // Two single-edge registers whose XOR reproduces dual-edge behavior
    // without any clock-level mux (which would glitch at every clock edge).
    logic p = 1'b0;
    logic n = 1'b0;

    // Positive-edge triggered storage
    always_ff @(posedge clk)
        p <= d ^ n;

    // Negative-edge triggered storage
    always_ff @(negedge clk)
        n <= d ^ p;

    // q reflects d after either edge:
    //   posedge: p^n -> (d^n)^n = d
    //   negedge: p^n -> p^(d^p) = d
    assign q = p ^ n;

endmodule
