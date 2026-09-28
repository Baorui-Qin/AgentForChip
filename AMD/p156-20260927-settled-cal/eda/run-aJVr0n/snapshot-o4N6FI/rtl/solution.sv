
module CalibrationReference (
  input a,
  input b,
  output out
);

  assign out = ~(a^b);

endmodule


module TopModule(input wire a,input wire b,output wire out);
wire cal_out;
CalibrationReference control(.a(a),.b(b),.out(cal_out));
assign out=~cal_out;
endmodule
