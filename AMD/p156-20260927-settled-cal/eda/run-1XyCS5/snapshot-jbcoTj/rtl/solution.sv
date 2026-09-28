
module CalibrationReference (
  input clk,
  input reset,
  output reg [9:0] q
);

  always @(posedge clk)
    if (reset || q == 999)
      q <= 0;
    else
      q <= q+1;

endmodule


module TopModule(input wire clk,input wire reset,output wire [9:0] q);
wire [9:0] cal_q;
CalibrationReference control(.clk(clk),.reset(reset),.q(cal_q));
assign q=~cal_q;
endmodule
