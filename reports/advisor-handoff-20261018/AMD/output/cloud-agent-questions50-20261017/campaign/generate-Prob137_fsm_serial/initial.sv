module TopModule(
    input  wire clk,
    input  wire reset,
    input  wire in,
    output wire done
);
    // State encoding
    typedef enum logic [1:0] {
        IDLE         = 2'b00,
        RECEIVE_DATA = 2'b01,
        CHECK_STOP   = 2'b10,
        WAIT_STOP    = 2'b11
    } state_t;

    // Registers
    state_t   state, next_state;
    logic [2:0] bit_cnt;
    logic [7:0] data_reg;
    logic       done_reg;

    // Sequential logic
    always @(posedge clk) begin
        if (reset) begin
            state      <= IDLE;
            bit_cnt    <= 3'd0;
            data_reg   <= 8'd0;
            done_reg   <= 1'b0;
        end else begin
            state      <= next_state;
            if (state == RECEIVE_DATA) begin
                data_reg[bit_cnt] <= in;
                if (bit_cnt == 3'd6) begin
                    bit_cnt <= 3'd7; // count up to 7 then stop counting
                end else begin
                    bit_cnt <= bit_cnt + 1'b1;
                end
            end else if (state == CHECK_STOP) begin
                if (in) begin
                    // valid stop bit, output done
                    done_reg <= 1'b1;
                    // go back to IDLE to wait for next start
                    // bit_cnt and data_reg will be cleared on reset or next start
                end else begin
                    // invalid stop, wait for correct stop
                    done_reg <= 1'b0;
                    state    <= WAIT_STOP;
                end
            end else if (state == WAIT_STOP) begin
                if (in) begin
                    // found stop, return to IDLE
                    state <= IDLE;
                end
            end
        end
    end

    // Combinational next state logic
    always @* begin
        // default assignments
        next_state = state;
        done_reg   = done_reg; // hold value unless overwritten
        case (state)
            IDLE: begin
                if (in == 1'b0) begin
                    next_state = RECEIVE_DATA;
                    bit_cnt    = 3'd0;
                end
            end
            RECEIVE_DATA: begin
                if (bit_cnt == 3'd7) begin
                    next_state = CHECK_STOP;
                end
            end
            CHECK_STOP: begin
                if (in == 1'b1) begin
                    next_state = IDLE;
                end else begin
                    next_state = WAIT_STOP;
                end
            end
            WAIT_STOP: begin
                if (in == 1'b1) begin
                    next_state = IDLE;
                end
            end
            default: begin
                next_state = IDLE;
            end
        endcase
    end

    assign done = done_reg;
endmodule