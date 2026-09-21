module counter(input wire clk, input wire rst, output reg [3:0] count);
always @(posedge clk) if (rst) count <= 0; else count <= count + 1;
endmodule
