
module TopModule (
    input  clk,
    input  a,
    output q
);

    reg a_reg;
    reg q_reg;

    always @(posedge clk) begin
        a_reg <= a;
        q_reg <= ~a_reg;
    end

    assign q = q_reg;

endmodule
