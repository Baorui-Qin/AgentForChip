
module CalibrationReference (
  input in1,
  input in2,
  output logic out
);

  assign out = in1 & ~in2;

endmodule


module TopModule(input wire in1,input wire in2,output wire out);
wire cal_out;
CalibrationReference control(.in1(in1),.in2(in2),.out(cal_out));
assign out=~cal_out;
endmodule
