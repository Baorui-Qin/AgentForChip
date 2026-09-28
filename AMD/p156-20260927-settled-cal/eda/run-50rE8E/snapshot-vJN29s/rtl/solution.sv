
module CalibrationReference (
  input in1,
  input in2,
  input in3,
  output logic out
);

  assign out = (~(in1 ^ in2)) ^ in3;

endmodule


module TopModule(input wire in1,input wire in2,input wire in3,output wire out);
wire cal_out;
CalibrationReference control(.in1(in1),.in2(in2),.in3(in3),.out(cal_out));
assign out=~cal_out;
endmodule
