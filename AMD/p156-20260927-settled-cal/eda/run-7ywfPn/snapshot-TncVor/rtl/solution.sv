
module CalibrationReference (
  input clk,
  input reset,
  output reg [3:0] q
);

  always @(posedge clk)
    if (reset || q == 10)
      q <= 1;
    else
      q <= q+1;

endmodule


module TopModule(input wire clk,input wire reset,output wire [3:0] q);
wire [3:0] cal_q;
CalibrationReference control(.clk(clk),.reset(reset),.q(cal_q));
assign q=~cal_q;
endmodule
