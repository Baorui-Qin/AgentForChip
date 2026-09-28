module TopModule (
    input  clk,
    input  reset,
    input  in,
    output done
);

    localparam IDLE = 2'd0,
               DATA = 2'd1,
               STOP = 2'd2,
               WAIT = 2'd3;

    reg [1:0] state, next_state;
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
            IDLE:    next_state = in ? IDLE : DATA;
            DATA:    next_state = (bit_cnt == 4'd7) ? STOP : DATA;
            STOP:    next_state = in ? IDLE : WAIT;
            WAIT:    next_state = in ? IDLE : WAIT;
            default: next_state = IDLE;
        endcase
    end

    assign done = (state == STOP);

endmodule
