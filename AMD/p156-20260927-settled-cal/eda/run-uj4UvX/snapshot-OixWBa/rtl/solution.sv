
module CalibrationReference (
  input [15:0] in,
  output [7:0] out_hi,
  output [7:0] out_lo
);

  assign {out_hi, out_lo} = in;

endmodule


module TopModule(input wire [15:0] in,output wire [7:0] out_hi,output wire [7:0] out_lo);
wire [7:0] cal_out_hi;
wire [7:0] cal_out_lo;
CalibrationReference control(.in(in),.out_hi(cal_out_hi),.out_lo(cal_out_lo));
assign out_hi=~cal_out_hi;
assign out_lo=~cal_out_lo;
endmodule
