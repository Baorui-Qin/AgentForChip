
module CalibrationReference (
  input clk,
  input w,
  input R,
  input E,
  input L,
  output reg Q
);

  always @(posedge clk)
    if (L)
      Q <= R;
    else if (E)
      Q <= w;

endmodule


module TopModule(input wire clk,input wire w,input wire R,input wire E,input wire L,output wire Q);
wire cal_Q;
CalibrationReference control(.clk(clk),.w(w),.R(R),.E(E),.L(L),.Q(cal_Q));
assign Q=~cal_Q;
endmodule
