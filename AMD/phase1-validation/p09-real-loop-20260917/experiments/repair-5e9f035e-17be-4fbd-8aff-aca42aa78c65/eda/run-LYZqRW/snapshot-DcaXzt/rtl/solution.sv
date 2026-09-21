module rising_edge(input clk, rst, din, output reg pulse);
reg previous;
always @(posedge clk) if(rst) begin previous<=0; pulse<=0; end else begin pulse<=din & ~previous; previous<=din; end
endmodule
