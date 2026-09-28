
module CalibrationReference (
  input clk,
  input d,
  output reg q
);

  initial
    q = 1'hx;

  always @(posedge clk)
    q <= d;

endmodule


module TopModule(input wire clk,input wire d,output wire q);
wire cal_q;
CalibrationReference control(.clk(clk),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
