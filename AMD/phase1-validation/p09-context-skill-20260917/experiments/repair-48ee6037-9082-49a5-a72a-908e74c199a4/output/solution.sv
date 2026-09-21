module rising_edge(input clk, rst, din, output reg pulse);
reg previous;
always @(posedge clk) begin
    if (rst) begin
        previous <= 1'b0;
        pulse    <= 1'b0;
    end else begin
        pulse    <= din & ~previous;
        previous <= din;
    end
end
endmodule
