
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
        IDLE,
        S1,
        S2,
        S3,
        SHIFT0,
        SHIFT1,
        SHIFT2,
        SHIFT3,
        COUNT,
        DONE
    } state_t;

    state_t state, next_state;

    always_ff @(posedge clk) begin
        if (reset) begin
            state <= IDLE;
        end else begin
            state <= next_state;
        end
    end

    always_comb begin
        next_state = state;
        case (state)
            IDLE:   next_state = data ? S1 : IDLE;
            S1:     next_state = data ? S2 : IDLE;
            S2:     next_state = data ? S2 : S3;
            S3:     next_state = data ? SHIFT0 : IDLE;
            SHIFT0: next_state = SHIFT1;
            SHIFT1: next_state = SHIFT2;
            SHIFT2: next_state = SHIFT3;
            SHIFT3: next_state = COUNT;
            COUNT:  if (done_counting) next_state = DONE;
            DONE:   if (ack) next_state = IDLE;
            default: next_state = IDLE;
        endcase
    end

    assign shift_ena = (state == SHIFT0 || state == SHIFT1 || state == SHIFT2 || state == SHIFT3);
    assign counting  = (state == COUNT);
    assign done      = (state == DONE);

endmodule
