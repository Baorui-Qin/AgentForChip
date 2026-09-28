
module TopModule (
    input clk,
    input resetn,
    input x,
    input y,
    output f,
    output g
);

    localparam [3:0] A = 4'd0,
                     B = 4'd1,
                     C = 4'd2,
                     D = 4'd3,
                     E = 4'd4,
                     F = 4'd5,
                     G = 4'd6,
                     P = 4'd7,
                     Z = 4'd8;

    logic [3:0] state, next_state;

    always_ff @(posedge clk) begin
        if (!resetn)
            state <= A;
        else
            state <= next_state;
    end

    always_comb begin
        next_state = state;
        case (state)
            A: next_state = B;
            B: next_state = C;
            C: next_state = x ? D : C;
            D: next_state = x ? D : E;
            E: next_state = x ? F : C;
            F: next_state = y ? P : G;
            G: next_state = y ? P : Z;
            P: next_state = P;
            Z: next_state = Z;
            default: next_state = A;
        endcase
    end

    assign f = (state == B);
    assign g = (state == F) || (state == G) || (state == P);

endmodule
