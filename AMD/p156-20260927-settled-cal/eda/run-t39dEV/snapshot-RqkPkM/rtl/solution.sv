
module CalibrationReference (
  input  [5:0] y,
  input        w,
  output       Y1,
  output       Y3
);

  assign Y1 = y[0]&~w;
  assign Y3 = (y[1]|y[2]|y[4]|y[5]) & w;

endmodule


module TopModule(input wire [5:0] y,input wire w,output wire Y1,output wire Y3);
wire cal_Y1;
wire cal_Y3;
CalibrationReference control(.y(y),.w(w),.Y1(cal_Y1),.Y3(cal_Y3));
assign Y1=~cal_Y1;
assign Y3=~cal_Y3;
endmodule
