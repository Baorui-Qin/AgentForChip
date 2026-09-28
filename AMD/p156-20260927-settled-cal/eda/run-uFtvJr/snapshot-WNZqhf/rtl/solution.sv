
module CalibrationReference (
  input sel,
  input [7:0] a,
  input [7:0] b,
  output reg [7:0] out
);

  // assign out = (~sel & a) | (sel & b);
  assign out = sel ? a : b;

endmodule


module TopModule(input wire sel,input wire [7:0] a,input wire [7:0] b,output wire [7:0] out);
wire [7:0] cal_out;
CalibrationReference control(.sel(sel),.a(a),.b(b),.out(cal_out));
assign out=~cal_out;
endmodule
