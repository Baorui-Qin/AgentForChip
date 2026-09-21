module TopModule (
    input  logic clk,
    input  logic d,
    output logic q
);
    // Two single-edge storage elements, one per clock edge. Each is loaded
    // directly from d, so no unknown value can propagate between them.
    logic q_pos = 1'b0;   // updated on the rising edge
    logic q_neg = 1'b0;   // updated on the falling edge

    always_ff @(posedge clk) begin
        q_pos <= d;
    end

    always_ff @(negedge clk) begin
        q_neg <= d;
    end

    // Select the element that was just updated: after a rising edge clk is
    // high (use q_pos), after a falling edge clk is low (use q_neg).
    assign q = clk ? q_pos : q_neg;
endmodule
