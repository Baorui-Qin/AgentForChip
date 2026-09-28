module TopModule (
    input  clk,
    input  a,
    input  b,
    output q,
    output state
);

    reg ff;

    // Flip-flop holds the full-adder carry: majority(a, b, ff)
    always @(posedge clk) begin
        ff <= (a & b) | (a & ff) | (b & ff);
    end

    assign state = ff;
    // Combinational full-adder sum
    assign q = a ^ b ^ ff;

endmodule
