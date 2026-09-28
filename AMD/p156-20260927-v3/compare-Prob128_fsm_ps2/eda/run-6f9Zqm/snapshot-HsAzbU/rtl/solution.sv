
module TopModule(
    input clk,
    input reset,
    input [7:0] in,
    output done
);

    reg [1:0] state, next_state;
    localparam BYTE1 = 2'd0,
               BYTE2 = 2'd1,
               BYTE3 = 2'd2,
               DONE  = 2'd3;

    always @(*) begin
        case (state)
            BYTE1: next_state = in[3] ? BYTE2 : BYTE1;
            BYTE2: next_state = BYTE3;
            BYTE3: next_state = DONE;
            DONE:  next_state = in[3] ? BYTE2 : BYTE1;
            default: next_state = BYTE1;
        endcase
    end

    always @(posedge clk) begin
        if (reset)
            state <= BYTE1;
        else
            state <= next_state;
    end

    assign done = (state == DONE);

endmodule
