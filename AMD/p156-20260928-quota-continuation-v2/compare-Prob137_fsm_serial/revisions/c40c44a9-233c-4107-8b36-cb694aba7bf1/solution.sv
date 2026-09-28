
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

    reg [1:0] state;
    reg [2:0] bit_cnt;

    always @(posedge clk) begin
        if (reset) begin
            state   <= IDLE;
            bit_cnt <= 3'd0;
        end else begin
            case (state)
                IDLE: begin
                    if (in == 1'b0) begin
                        state   <= DATA;
                        bit_cnt <= 3'd0;
                    end
                end
                DATA: begin
                    if (bit_cnt == 3'd7) begin
                        state <= STOP;
                    end else begin
                        bit_cnt <= bit_cnt + 3'd1;
                    end
                end
                STOP: begin
                    if (in == 1'b1)
                        state <= IDLE;
                    else
                        state <= WAIT;
                end
                WAIT: begin
                    if (in == 1'b1)
                        state <= IDLE;
                end
                default: state <= IDLE;
            endcase
        end
    end

    assign done = (state == STOP) && in;

endmodule
