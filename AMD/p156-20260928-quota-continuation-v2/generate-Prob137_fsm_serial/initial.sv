
module TopModule (
    input  clk,
    input  reset,
    input  in,
    output done
);

    localparam IDLE  = 3'd0,
               DATA  = 3'd1,
               STOP  = 3'd2,
               WAIT  = 3'd3;

    reg [2:0] state, next_state;
    reg [2:0] bit_cnt;

    always @(posedge clk) begin
        if (reset) begin
            state   <= IDLE;
            bit_cnt <= 3'd0;
        end else begin
            state <= next_state;

            if (state == IDLE && in == 1'b0)
                bit_cnt <= 3'd0;
            else if (state == DATA)
                bit_cnt <= bit_cnt + 3'd1;
        end
    end

    always @(*) begin
        case (state)
            IDLE:  next_state = in ? IDLE : DATA;
            DATA:  next_state = (bit_cnt == 3'd7) ? STOP : DATA;
            STOP:  next_state = in ? IDLE : WAIT;
            WAIT:  next_state = in ? IDLE : WAIT;
            default: next_state = IDLE;
        endcase
    end

    assign done = (state == STOP) && in;

endmodule
