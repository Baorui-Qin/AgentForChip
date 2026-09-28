
module TopModule (
    input clk,
    input in,
    input reset,
    output reg [7:0] out_byte,
    output reg done
);

    localparam IDLE  = 3'd0,
               START = 3'd1,
               DATA  = 3'd2,
               STOP  = 3'd3,
               WAIT  = 3'd4;

    reg [2:0] state, next_state;
    reg [3:0] cnt;
    reg [7:0] data;

    always @(*) begin
        case (state)
            IDLE:  next_state = in ? IDLE : START;
            START: next_state = DATA;
            DATA:  next_state = (cnt == 4'd6) ? STOP : DATA;
            STOP:  next_state = in ? IDLE : WAIT;
            WAIT:  next_state = in ? IDLE : WAIT;
            default: next_state = IDLE;
        endcase
    end

    always @(posedge clk) begin
        if (reset) begin
            state    <= IDLE;
            cnt      <= 4'd0;
            data     <= 8'd0;
            out_byte <= 8'd0;
            done     <= 1'b0;
        end else begin
            state <= next_state;

            case (state)
                START: begin
                    data[7] <= in;
                    cnt     <= 4'd0;
                    done    <= 1'b0;
                end
                DATA: begin
                    data <= {in, data[7:1]};
                    cnt  <= cnt + 4'd1;
                    done <= 1'b0;
                end
                STOP: begin
                    out_byte <= data;
                    done     <= in;
                end
                default: begin
                    done <= 1'b0;
                end
            endcase
        end
    end

endmodule
