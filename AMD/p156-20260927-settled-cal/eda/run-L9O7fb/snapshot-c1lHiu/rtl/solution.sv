
module CalibrationReference (
  input a,
  input b,
  input c,
  output out
);

  assign out = (a | b | c);

endmodule


module TopModule(input wire a,input wire b,input wire c,output wire out);
wire cal_out;
CalibrationReference control(.a(a),.b(b),.c(c),.out(cal_out));
assign out=~cal_out;
endmodule
