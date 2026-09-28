
module TopModule (
    input  logic clk,
    input  logic reset,
    input  logic w,
    output logic z
);

    typedef enum logic [2:0] {
        A = 3'd0,
        B = 3'd1,
        C = 3'd2,
        D = 3'd3,
        E = 3'd4,
        F = 3'd5
    } state_t;

    state_t state, next;

    always_comb begin
        unique case (state)
            A: next = w ? A : B;
            B: next = w ? D : C;
            C: next = w ? D : E;
            D: next = w ? A : F;
            E: next = w ? D : E;
            F: next = w ? D : C;
            default: next = A;
        endcase
    end

    always_ff @(posedge clk) begin
        if (reset) begin
            state <= A;
        end else begin
            state <= next;
        end
    end

    assign z = (state == E) || (state == F);

endmodule
