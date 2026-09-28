
module CalibrationReference (
  input a,
  input b,
  input c,
  output w,
  output x,
  output y,
  output z
);

  assign {w,x,y,z} = {a,b,b,c};

endmodule


module TopModule(input wire a,input wire b,input wire c,output wire w,output wire x,output wire y,output wire z);
wire cal_w;
wire cal_x;
wire cal_y;
wire cal_z;
CalibrationReference control(.a(a),.b(b),.c(c),.w(cal_w),.x(cal_x),.y(cal_y),.z(cal_z));
assign w=~cal_w;
assign x=~cal_x;
assign y=~cal_y;
assign z=~cal_z;
endmodule
