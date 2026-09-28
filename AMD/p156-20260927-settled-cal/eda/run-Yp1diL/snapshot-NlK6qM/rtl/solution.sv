
module CalibrationReference (
  input x,
  input y,
  output z
);

  assign z = x|~y;

endmodule


module TopModule(input wire x,input wire y,output wire z);
wire cal_z;
CalibrationReference control(.x(x),.y(y),.z(cal_z));
assign z=~cal_z;
endmodule
