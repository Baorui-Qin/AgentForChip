
module TopModule (
    input  clk,
    input  reset,
    input  in,
    output logic disc,
    output logic flag,
    output logic err
);

    typedef enum logic [3:0] {
        S0, S1, S2, S3, S4, S5, S6, S7, SD, SF
    } state_t;

    state_t state, next_state;

    always_ff @(posedge clk) begin
        if (reset)
            state <= S0;
        else
            state <= next_state;
    end

    always_comb begin
        next_state = state;
        case (state)
            S0: next_state = in ? S1 : S0;
            S1: next_state = in ? S2 : S0;
            S2: next_state = in ? S3 : S0;
            S3: next_state = in ? S4 : S0;
            S4: next_state = in ? S5 : S0;
            S5: next_state = in ? S6 : SD;
            S6: next_state = in ? S7 : SF;
            S7: next_state = in ? S7 : S0;
            SD: next_state = in ? S1 : S0;
            SF: next_state = in ? S1 : S0;
            default: next_state = S0;
        endcase
    end

    assign disc = (state == SD);
    assign flag = (state == SF);
    assign err  = (state == S7);

endmodule
