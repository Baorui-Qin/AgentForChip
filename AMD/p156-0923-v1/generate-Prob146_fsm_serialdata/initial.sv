
module TopModule (
    input clk,
    input in,
    input reset,
    output reg [7:0] out_byte,
    output wire done
);

    localparam IDLE  = 3'd0,
               START = 3'd1,
               DATA  = 3'd2,
               STOP  = 3'd3,
               WAIT  = 3'd4;

    reg [2:0] state, next_state;
    reg [3:0] bit_cnt;
    reg [7:0] data_reg;

    always @(*) begin
        case (state)
            IDLE:  next_state = in ? IDLE : START;
            START: next_state = DATA;
            DATA:  next_state = (bit_cnt == 4'd7) ? STOP : DATA;
            STOP:  next_state = in ? IDLE : WAIT;
            WAIT:  next_state = in ? IDLE : WAIT;
            default: next_state = IDLE;
        endcase
    end

    always @(posedge clk) begin
        if (reset) begin
            state    <= IDLE;
            bit_cnt  <= 4'd0;
            data_reg <= 8'd0;
            out_byte <= 8'd0;
        end else begin
            state <= next_state;

            case (state)
                IDLE: begin
                    bit_cnt <= 4'd0;
                end

                START: begin
                    data_reg[0] <= in;
                    bit_cnt     <= 4'd1;
                end

                DATA: begin
                    data_reg[bit_cnt] <= in;
                    if (bit_cnt == 4'd7)
                        bit_cnt <= 4'd0;
                    else
                        bit_cnt <= bit_cnt + 4'd1;
                end

                STOP: begin
                    if (in) begin
                        out_byte <= data_reg;
                    end
                end

                WAIT: begin
                    bit_cnt <= 4'd0;
                end

                default: begin
                    bit_cnt <= 4'd0;
                end
            endcase
        end
    end

    assign done = (state == STOP) && in;

endmodule
