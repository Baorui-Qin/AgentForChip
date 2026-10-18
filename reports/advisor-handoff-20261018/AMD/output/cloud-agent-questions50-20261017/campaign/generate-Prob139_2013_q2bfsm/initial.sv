module TopModule(
    input  clk,
    input  resetn,
    input  x,
    input  y,
    output f,
    output g
);
    // State encoding
    typedef enum logic [2:0] {
        A=3'b000, // reset state, wait for reset deassertion
        B=3'b001, // f=1 for one cycle after reset
        C=3'b010, // detect x=1,0,1 sequence
        D=3'b011, // wait for y=1 within 2 cycles after sequence detection
        E=3'b100, // permanent g=1
        F=3'b101  // permanent g=0 (reset or timeout)
    } state_t;

    // State register
    state_t state, next_state;
    // Shift register for x sequence detection
    logic [2:0] x_shift;
    // Counter for y timeout
    logic [1:0] y_cnt; // 0,1,2
    // Output registers
    logic f_reg, g_reg;

    // Sequential logic
    always @(posedge clk) begin
        if (!resetn) begin
            state   <= A;
            f_reg  <= 1'b0;
            g_reg  <= 1'b0;
            x_shift <= 3'b000;
            y_cnt  <= 2'b00;
        end else begin
            state   <= next_state;
            f_reg  <= (state == B) ? 1'b1 : 1'b0;
            g_reg  <= (state == E) ? 1'b1 : 
                      (state == F) ? 1'b0 : g_reg;
            // x shift register update
            x_shift <= {x_shift[1:0], x}; // shift left, insert new x
            // y counter update
            if (state == D) begin
                y_cnt <= y_cnt + 1'b1;
            end else begin
                y_cnt <= 2'b00;
            end
        end
    end

    // Next-state combinational logic
    always @* begin
        // default assignments
        next_state = state;
        // default outputs (will be overridden)
        //
        case (state)
            A: begin // reset state, wait for reset deassertion
                // stay in A while reset is asserted
                if (!resetn)
                    next_state = A;
                else
                    next_state = B; // after reset deassert, go to B
            end
            B: begin // f=1 for one cycle
                // after B, go to C to start monitoring x
                next_state = C;
            end
            C: begin // detect x=1,0,1 sequence
                if (x_shift == 3'b101) begin
                    // sequence detected, move to D to monitor y
                    next_state = D;
                end else begin
                    // stay in C until sequence appears
                    next_state = C;
                end
            end
            D: begin // wait for y=1 within 2 cycles
                if (y == 1'b1) begin
                    // y asserted, set permanent g=1 (state E)
                    next_state = E;
                end else if (y_cnt == 2'b10) begin
                    // timeout after 2 cycles without y=1, set permanent g=0 (state F)
                    next_state = F;
                end else begin
                    // still waiting
                    next_state = D;
                end
            end
            E, F: begin // permanent states, stay until reset
                next_state = A; // on reset deassert, go to A? Actually we want to stay until reset.
                // To stay, we need to keep state unchanged on reset deassert.
                // So we set next_state = state;
                next_state = state;
            end
            default: next_state = A;
        endcase
    end

    // Output assignments
    assign f = f_reg;
    assign g = g_reg;

endmodule