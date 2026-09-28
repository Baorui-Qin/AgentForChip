
module TopModule (
    input clk,
    input reset,
    input in,
    output done
);

    localparam IDLE  = 3'd0,
               START = 3'd1,
               DATA  = 3'd2,
               STOP  = 3'd3,
               DONE  = 3'd4,
               WAIT  = 3'd5;

    reg [2:0] state, next_state;
    reg [3:0] bit_cnt;

    always @(posedge clk) begin
        if (reset) begin
            state   <= IDLE;
            bit_cnt <= 4'd0;
        end else begin
            state <= next_state;

            if (state == DATA)
                bit_cnt <= bit_cnt + 4'd1;
            else
                bit_cnt <= 4'd0;
        end
    end

    always @(*) begin
        case (state)
            IDLE:  next_state = in ? IDLE : START;
            START: next_state = DATA;
            DATA:  next_state = (bit_cnt == 4'd7) ? STOP : DATA;
            STOP:  next_state = in ? DONE : WAIT;
            DONE:  next_state = in ? IDLE : START;
            WAIT:  next_state = in ? IDLE : WAIT;
            default: next_state = IDLE;
        endcase
    end

    assign done = (state == DONE);

endmodule
