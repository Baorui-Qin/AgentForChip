
module CalibrationReference (
  input [99:0] in,
  output out_and,
  output out_or,
  output out_xor
);

  assign out_and = &in;
  assign out_or = |in;
  assign out_xor = ^in;

endmodule


module TopModule(input wire [99:0] in,output wire out_and,output wire out_or,output wire out_xor);
wire cal_out_and;
wire cal_out_or;
wire cal_out_xor;
CalibrationReference control(.in(in),.out_and(cal_out_and),.out_or(cal_out_or),.out_xor(cal_out_xor));
assign out_and=~cal_out_and;
assign out_or=~cal_out_or;
assign out_xor=~cal_out_xor;
endmodule
