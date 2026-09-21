module counter(input wire clk, input wire rst, output reg [3:0] count);
always @(posedge clk) begin
    if (rst) count <= 0;
    else count <= count + 2
end
endmodule
