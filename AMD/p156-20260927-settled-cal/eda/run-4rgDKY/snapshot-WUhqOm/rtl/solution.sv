
module CalibrationReference (
  input a,
  input b,
  input c,
  input d,
  output out,
  output out_n
);

  wire w1, w2;
  assign w1 = a&b;
  assign w2 = c&d;
  assign out = w1|w2;
  assign out_n = ~out;

endmodule


module TopModule(input wire a,input wire b,input wire c,input wire d,output wire out,output wire out_n);
wire cal_out;
wire cal_out_n;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.out(cal_out),.out_n(cal_out_n));
assign out=~cal_out;
assign out_n=~cal_out_n;
endmodule
