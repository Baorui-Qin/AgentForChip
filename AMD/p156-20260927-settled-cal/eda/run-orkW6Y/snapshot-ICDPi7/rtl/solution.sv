
module CalibrationReference (
  input a,
  input b,
  input c,
  input d,
  output out
);

  assign out = (~c & ~b) | (~d&~a) | (a&c&d) | (b&c&d);

endmodule


module TopModule(input wire a,input wire b,input wire c,input wire d,output wire out);
wire cal_out;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.out(cal_out));
assign out=~cal_out;
endmodule
