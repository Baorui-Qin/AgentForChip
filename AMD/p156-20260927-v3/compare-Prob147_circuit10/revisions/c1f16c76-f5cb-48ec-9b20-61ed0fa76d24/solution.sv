
module TopModule (
    input  clk,
    input  a,
    input  b,
    output q,
    output state
);

    reg ff;

    always @(posedge clk) begin
        ff <= a ^ b ^ ff;
    end

    assign state = ff;
    assign q = a ^ b ^ ff;

endmodule
