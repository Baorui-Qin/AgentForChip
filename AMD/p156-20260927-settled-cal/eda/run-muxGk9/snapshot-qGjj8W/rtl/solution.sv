
module CalibrationReference (
  input a,
  input b,
  output q
);

  assign q = a&b;

endmodule


module TopModule(input wire a,input wire b,output wire q);
wire cal_q;
CalibrationReference control(.a(a),.b(b),.q(cal_q));
assign q=~cal_q;
endmodule
