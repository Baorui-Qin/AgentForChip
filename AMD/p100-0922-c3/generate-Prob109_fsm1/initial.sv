
module TopModule (
    input  logic clk,
    input  logic areset,
    input  logic in,
    output logic out
);

    typedef enum logic {
        A = 1'b0,
        B = 1'b1
    } state_t;

    state_t state, next;

    always_comb begin
        case (state)
            A: next = in ? A : B;
            B: next = in ? B : A;
            default: next = B;
        endcase
    end

    always_ff @(posedge clk or posedge areset) begin
        if (areset)
            state <= B;
        else
            state <= next;
    end

    assign out = (state == B);

endmodule
