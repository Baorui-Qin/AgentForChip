
module CalibrationReference (
  input [99:0] a,
  input [99:0] b,
  input sel,
  output [99:0] out
);

  assign out = sel ? b : a;

endmodule


module TopModule(input wire [99:0] a,input wire [99:0] b,input wire sel,output wire [99:0] out);
wire [99:0] cal_out;
CalibrationReference control(.a(a),.b(b),.sel(sel),.out(cal_out));
assign out=~cal_out;
endmodule
