module TopModule (
    input  clk,
    input  reset,
    input  in,
    output done
);

    localparam [2:0] IDLE = 3'd0,
                     DATA = 3'd1,
                     STOP = 3'd2,
                     DONE = 3'd3,
                     WAIT = 3'd4;

    reg [2:0] state;
    reg [3:0] bit_cnt;

    // Strictly one cycle per received bit: the start bit is recognised in IDLE,
    // and the very next clock edge is data bit 0.  Hence no extra waiting state
    // is used, otherwise the stop-bit check would occur one cycle too late.
    always @(posedge clk) begin
        if (reset) begin
            state   <= IDLE;
            bit_cnt <= 4'd0;
        end else begin
            case (state)
                IDLE: begin
                    bit_cnt <= 4'd0;
                    if (!in)
                        state <= DATA;     // start bit (0) detected
                end
                DATA: begin
                    if (bit_cnt == 4'd7) begin
                        state   <= STOP;   // all 8 data bits consumed
                        bit_cnt <= 4'd0;
                    end else begin
                        bit_cnt <= bit_cnt + 4'd1;
                    end
                end
                STOP: begin
                    // good stop bit (1) -> byte complete; otherwise resync
                    state <= in ? DONE : WAIT;
                end
                DONE: begin
                    bit_cnt <= 4'd0;
                    // current bit is either idle or the next start bit
                    state <= in ? IDLE : DATA;
                end
                WAIT: begin
                    // hunt for a stop bit before receiving the next byte
                    state <= in ? IDLE : WAIT;
                end
                default: state <= IDLE;
            endcase
        end
    end

    assign done = (state == DONE);

endmodule
