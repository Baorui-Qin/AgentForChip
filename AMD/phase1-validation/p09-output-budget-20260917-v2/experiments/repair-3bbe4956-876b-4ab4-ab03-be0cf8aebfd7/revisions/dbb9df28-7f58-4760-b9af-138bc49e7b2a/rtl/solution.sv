module signed_saturating_add(input clk,rst,input signed [7:0] a,b,output reg signed [7:0] sum);
wire signed [8:0] extended={a[7],a}+{b[7],b};
always @(posedge clk) if(rst) sum<=0; else if(extended>127) sum<=126; else if(extended< -128) sum<= -128; else sum<=extended[7:0];
endmodule
