module enable_counter(input clk, rst, en, output reg [3:0] q);
always @(posedge clk) if(rst) q<=0; else if(en) q<=q+1;
endmodule
