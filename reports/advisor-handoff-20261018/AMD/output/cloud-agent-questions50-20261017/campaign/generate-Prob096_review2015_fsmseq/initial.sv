module TopModule(
    input  wire clk,
    input  wire reset,
    input  wire data,
    output wire start_shifting
);
    // State encoding
    // 2 bits: 0=S0, 1=S1, 2=S2, 3=S3, 4=S4
    // Only 4 states needed, S4 is a dedicated detection state
    // Use localparam for readability
    typedef enum logic [1:0] {
        S0 = 2'b00, // Initial, no bits matched
        S1 = 2'b01, // Matched '1'
        S2 = 2'b10, // Matched '11'
        S3 = 2'b11, // Matched '110'
        S4 = 2'b00 // Detection state (same as S0 encoding but used with a flag)
    } state_t;
    // State register
    state_t state, next_state;
    // Output register
    logic start_shifting_reg;
    assign start_shifting = start_shifting_reg;
    // Sequential logic: state and output registers
    always @(posedge clk) begin
        if (reset) begin
            state <= S0;
            start_shifting_reg <= 1'b0;
        end else begin
            state <= next_state;
            // Output holds until reset
            if (next_state == S4)
                start_shifting_reg <= 1'b1;
            else
                start_shifting_reg <= start_shifting_reg;
        end
    end
    // Combinational next-state logic
    always @* begin
        // Default next_state = state (to avoid latches)
        next_state = state;
        case (state)
            S0: begin
                if (data)       next_state = S1;
                else            next_state = S0;
            end
            S1: begin
                if (data)       next_state = S2; // 11
                else            next_state = S0; // 1... mismatch
            end
            S2: begin
                if (data)       next_state = S3; // 110
                else            next_state = S0; // 1... mismatch
            end
            S3: begin
                if (~data) begin // data == 0 => 1101
                    next_state = S4;
                end else begin // data == 1 mismatch
                    // Overlap handling: after 1101, the last bits '01' can be part of next sequence
                    // So we go to state S2 (matched '11') because we have '11' at the end of '1101'
                    next_state = S2;
                end
            end
            S4: begin
                // Once in detection state, stay there (output held)
                next_state = S4;
            end
            default: next_state = S0;
        endcase
    end
endmodule