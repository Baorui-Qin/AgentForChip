
module CalibrationReference (
  input a,
  input b,
  input c,
  input d,
  output q
);

  assign q = ~a^b^c^d;

endmodule


module TopModule(input wire a,input wire b,input wire c,input wire d,output wire q);
wire cal_q;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
