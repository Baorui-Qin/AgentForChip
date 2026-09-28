
module CalibrationReference (
  input clk,
  input a,
  output reg q
);

  always @(posedge clk)
    q <= ~a;

endmodule


module TopModule(input wire clk,input wire a,output wire q);
wire cal_q;
CalibrationReference control(.clk(clk),.a(a),.q(cal_q));
assign q=~cal_q;
endmodule
