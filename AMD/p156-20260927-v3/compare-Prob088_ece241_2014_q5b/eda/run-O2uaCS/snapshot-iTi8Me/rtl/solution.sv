
module TopModule (
    input  clk,
    input  areset,
    input  x,
    output z
);

    logic [1:0] state;  // one-hot: state[0] = A, state[1] = B

    always_ff @(posedge clk or posedge areset) begin
        if (areset) begin
            state <= 2'b01;  // reset into state A
        end else begin
            // A -> A when x=0; A -> B when x=1; B -> B always
            state <= {state[1] | (state[0] & x), state[0] & ~x};
        end
    end

    // Mealy output: in A, z = x; in B, z = ~x
    assign z = state[0] ? x : ~x;

endmodule
