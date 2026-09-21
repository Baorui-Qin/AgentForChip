module TopModule (
    input  logic clk,
    input  logic d,
    output logic q
);
    logic q_pos, q_neg;

    // On each edge, update only one storage element so that q = q_pos ^ q_neg
    // makes exactly one transition per edge (glitch-free dual-edge behavior).
    always_ff @(posedge clk) begin
        q_pos <= d ^ q_neg;
    end

    always_ff @(negedge clk) begin
        q_neg <= d ^ q_pos;
    end

    assign q = q_pos ^ q_neg;
endmodule
