module TopModule (
    input  logic clk,
    input  logic L,
    input  logic q_in,
    input  logic r_in,
    output logic Q
);

    // 2:1 multiplexer: load r_in when L is high, otherwise take q_in
    logic d;
    assign d = L ? r_in : q_in;

    // D flip-flop with defined power-up value
    initial Q = 1'b0;

    always_ff @(posedge clk) begin
        Q <= d;
    end

endmodule
