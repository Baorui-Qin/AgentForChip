
module CalibrationReference (
  input in,
  output out
);

  assign out = ~in;

endmodule


module TopModule(input wire in,output wire out);
wire cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
