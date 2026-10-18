module TopModule(
    input  clk,
    input  areset,
    input  in,
    output out
);
    // State encoding
    typedef enum logic [1:0] {
        A = 2'b00,
        B = 2'b01,
        C = 2'b10,
        D = 2'b11
    } state_t;

    // State registers
    state_t cur_state, nxt_state;

    // Next-state combinational logic
    always @* begin
        case (cur_state)
            A: nxt_state = in ? B : A;
            B: nxt_state = in ? B : C;
            C: nxt_state = in ? D : A;
            D: nxt_state = in ? B : C;
            default: nxt_state = A;
        endcase
    end

    // Output logic (Moore)
    always @* begin
        out = 1'b0;
        if (cur_state == D)
            out = 1'b1;
    end

    // State register with asynchronous active-high reset
    always @(posedge clk or posedge areset) begin
        if (areset)
            cur_state <= A;
        else
            cur_state <= nxt_state;
    end
endmodule