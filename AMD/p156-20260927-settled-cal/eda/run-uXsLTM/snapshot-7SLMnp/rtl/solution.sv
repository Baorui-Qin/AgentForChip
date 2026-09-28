
module CalibrationReference (
  input a,
  input b,
  input sel,
  output out
);

  assign out = sel ? b : a;

endmodule


module TopModule(input wire a,input wire b,input wire sel,output wire out);
wire cal_out;
CalibrationReference control(.a(a),.b(b),.sel(sel),.out(cal_out));
assign out=~cal_out;
endmodule
