
module CalibrationReference (
  input a,
  input b,
  input c,
  input d,
  input e,
  output [24:0] out
);

  assign out = ~{ {5{a}}, {5{b}}, {5{c}}, {5{d}}, {5{e}} } ^ {5{a,b,c,d,e}};

endmodule


module TopModule(input wire a,input wire b,input wire c,input wire d,input wire e,output wire [24:0] out);
wire [24:0] cal_out;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.e(e),.out(cal_out));
assign out=~cal_out;
endmodule
