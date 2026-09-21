
module TopModule (
    input  logic clk,
    input  logic reset,
    input  logic data,
    input  logic done_counting,
    input  logic ack,
    output logic shift_ena,
    output logic counting,
    output logic done
);

    typedef enum logic [3:0] {
        SEARCH,
        GOT1,
        GOT11,
        GOT110,
        SHIFT1,
        SHIFT2,
        SHIFT3,
        SHIFT4,
        COUNT,
        DONE
    } state_t;

    state_t state, next_state;

    always_comb begin
        next_state = state;

        unique case (state)
            SEARCH: next_state = data ? GOT1 : SEARCH;
            GOT1:   next_state = data ? GOT11 : SEARCH;
            GOT11:  next_state = data ? GOT11 : GOT110;
            GOT110: next_state = data ? SHIFT1 : SEARCH;

            SHIFT1: next_state = SHIFT2;
            SHIFT2: next_state = SHIFT3;
            SHIFT3: next_state = SHIFT4;
            SHIFT4: next_state = COUNT;

            COUNT:  next_state = done_counting ? DONE : COUNT;
            DONE:   next_state = ack ? SEARCH : DONE;

            default: next_state = SEARCH;
        endcase
    end

    always_ff @(posedge clk) begin
        if (reset)
            state <= SEARCH;
        else
            state <= next_state;
    end

    assign shift_ena = (state == SHIFT1) ||
                       (state == SHIFT2) ||
                       (state == SHIFT3) ||
                       (state == SHIFT4);

    assign counting = (state == COUNT);
    assign done     = (state == DONE);

endmodule
