
module CalibrationReference (
  input p1a,
  input p1b,
  input p1c,
  input p1d,
  input p1e,
  input p1f,
  output p1y,
  input p2a,
  input p2b,
  input p2c,
  input p2d,
  output p2y
);

  assign p1y = &{p1a, p1b, p1c} | &{p1d, p1e, p1f};
  assign p2y = &{p2a, p2b} | &{p2c, p2d};

endmodule


module TopModule(input wire p1a,input wire p1b,input wire p1c,input wire p1d,input wire p1e,input wire p1f,input wire p2a,input wire p2b,input wire p2c,input wire p2d,output wire p1y,output wire p2y);
wire cal_p1y;
wire cal_p2y;
CalibrationReference control(.p1a(p1a),.p1b(p1b),.p1c(p1c),.p1d(p1d),.p1e(p1e),.p1f(p1f),.p2a(p2a),.p2b(p2b),.p2c(p2c),.p2d(p2d),.p1y(cal_p1y),.p2y(cal_p2y));
assign p1y=~cal_p1y;
assign p2y=~cal_p2y;
endmodule
