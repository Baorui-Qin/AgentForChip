module TopModule (
    input  logic clk,
    input  logic L,
    input  logic q_in,
    input  logic r_in,
    output logic Q
);

    // 2:1 multiplexer: select r_in when L is asserted, otherwise q_in.
    logic D;
    assign D = L ? r_in : q_in;

    // Power-up state so Q is defined from time 0 (no reset port in spec).
    initial Q = 1'b0;

    // D flip-flop capturing the multiplexer output.
    always @(posedge clk)
        Q <= D;

endmodule
