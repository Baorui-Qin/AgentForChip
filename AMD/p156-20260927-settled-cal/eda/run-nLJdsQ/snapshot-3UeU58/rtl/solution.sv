
module CalibrationReference (
  input clk,
  input [7:0] d,
  input reset,
  output reg [7:0] q
);

  always @(negedge clk)
    if (reset)
      q <= 8'h34;
    else
      q <= d;

endmodule


module TopModule(input wire clk,input wire reset,input wire [7:0] d,output wire [7:0] q);
wire [7:0] cal_q;
CalibrationReference control(.clk(clk),.reset(reset),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
