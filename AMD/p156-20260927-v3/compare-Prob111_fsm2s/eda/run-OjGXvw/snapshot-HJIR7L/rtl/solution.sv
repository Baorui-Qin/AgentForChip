
module TopModule (
    input  logic clk,
    input  logic reset,
    input  logic j,
    input  logic k,
    output logic out
);

    typedef enum logic {OFF, ON} state_t;
    state_t state, next_state;

    always_ff @(posedge clk) begin
        if (reset)
            state <= OFF;
        else
            state <= next_state;
    end

    always_comb begin
        next_state = state;
        out = 1'b0;

        case (state)
            OFF: begin
                out = 1'b0;
                next_state = j ? ON : OFF;
            end
            ON: begin
                out = 1'b1;
                next_state = k ? OFF : ON;
            end
            default: begin
                out = 1'b0;
                next_state = OFF;
            end
        endcase
    end

endmodule
