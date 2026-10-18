module TopModule(
    input  clk,
    input  a,
    output [2:0] q
);
    // 3-bit counter register
    reg [2:0] q_reg;
    
    // Increment on a==1, reset to 0 on a==0
    always @(posedge clk) begin
        if (a)
            q_reg <= q_reg + 1'b1;
        else
            q_reg <= 3'b000;
    end
    
    assign q = q_reg;
endmodule