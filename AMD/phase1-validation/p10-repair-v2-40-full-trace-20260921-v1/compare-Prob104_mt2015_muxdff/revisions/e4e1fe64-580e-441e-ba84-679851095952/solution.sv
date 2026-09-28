module TopModule (
    input  logic clk,
    input  logic L,
    input  logic q_in,
    input  logic r_in,
    output logic Q
);

    logic d;

    // 2:1 multiplexer: load r_in when L is asserted, else hold the
    // next-state value presented on q_in.
    assign d = L ? r_in : q_in;

    // Power-up value so simulation matches the reference model
    // (the storage element starts at 0 like the original flip-flops).
    initial Q = 1'b0;

    always_ff @(posedge clk) begin
        Q <= d;
    end

endmodule
