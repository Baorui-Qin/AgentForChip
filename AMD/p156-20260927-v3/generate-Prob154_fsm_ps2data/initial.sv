
module TopModule (
    input  logic        clk,
    input  logic        reset,
    input  logic [7:0]  in,
    output logic [23:0] out_bytes,
    output logic        done
);

    typedef enum logic [1:0] {
        IDLE  = 2'd0,
        BYTE1 = 2'd1,
        BYTE2 = 2'd2,
        BYTE3 = 2'd3
    } state_t;

    state_t state;
    logic [7:0] b1, b2, b3;

    always_ff @(posedge clk) begin
        if (reset) begin
            state     <= IDLE;
            done      <= 1'b0;
            out_bytes <= 24'h000000;
            b1        <= 8'h00;
            b2        <= 8'h00;
            b3        <= 8'h00;
        end else begin
            done <= (state == BYTE3);

            case (state)
                IDLE: begin
                    if (in[3]) begin
                        state <= BYTE1;
                        b1    <= in;
                    end
                end

                BYTE1: begin
                    state <= BYTE2;
                    b2    <= in;
                end

                BYTE2: begin
                    state <= BYTE3;
                    b3    <= in;
                end

                BYTE3: begin
                    out_bytes <= {b1, b2, b3};
                    if (in[3]) begin
                        state <= BYTE1;
                        b1    <= in;
                    end else begin
                        state <= IDLE;
                    end
                end

                default: state <= IDLE;
            endcase
        end
    end

endmodule
