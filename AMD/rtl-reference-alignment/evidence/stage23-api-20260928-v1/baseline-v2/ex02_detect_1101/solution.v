module TopModule (
    input  logic clk,
    input  logic reset,
    input  logic in,
    output logic detected
);

    typedef enum logic [1:0] {
        S0 = 2'b00,
        S1 = 2'b01,
        S2 = 2'b10,
        S3 = 2'b11
    } state_t;

    state_t state, next_state;
    logic next_detected;

    always_comb begin
        next_state = state;
        next_detected = 1'b0;

        case (state)
            S0: begin
                if (in) next_state = S1;
                else    next_state = S0;
            end

            S1: begin
                if (in) next_state = S2;
                else    next_state = S0;
            end

            S2: begin
                if (in) next_state = S2;
                else    next_state = S3;
            end

            S3: begin
                if (in) begin
                    next_state = S1;
                    next_detected = 1'b1;
                end else begin
                    next_state = S0;
                end
            end

            default: begin
                next_state = S0;
            end
        endcase
    end

    always_ff @(posedge clk) begin
        if (reset) begin
            state <= S0;
            detected <= 1'b0;
        end else begin
            state <= next_state;
            detected <= next_detected;
        end
    end

endmodule
