
module TopModule (
    input clk,
    input reset,
    input s,
    input w,
    output z
);

    localparam A = 3'd0,
               B = 3'd1,
               C = 3'd2,
               D = 3'd3,
               E = 3'd4;

    reg [2:0] state, next_state;
    reg [1:0] cnt;

    always @(*) begin
        case (state)
            A: next_state = s ? B : A;
            B: next_state = C;
            C: next_state = D;
            D: next_state = E;
            E: next_state = B;
            default: next_state = A;
        endcase
    end

    always @(posedge clk) begin
        if (reset) begin
            state <= A;
            cnt <= 2'd0;
        end else begin
            state <= next_state;

            if (state == B)
                cnt <= {1'b0, w};
            else if (state == C || state == D)
                cnt <= cnt + {1'b0, w};
            else
                cnt <= 2'd0;
        end
    end

    assign z = (state == E) && (cnt == 2'd2);

endmodule
