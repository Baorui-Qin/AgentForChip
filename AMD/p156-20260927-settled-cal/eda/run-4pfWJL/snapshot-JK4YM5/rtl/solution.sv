
module CalibrationReference (
  input  [99:0] in,
  output [99:0] out_both,
  output [99:0] out_any,
  output [99:0] out_different
);

  assign out_both = { 1'b0, (in[98:0] & in[99:1]) };

  assign out_any = { (in[98:0] | in[99:1]), 1'b0 };

  assign out_different = in ^ { in[0], in[99:1] };

endmodule


module TopModule(input wire [99:0] in,output wire [99:0] out_both,output wire [99:0] out_any,output wire [99:0] out_different);
wire [99:0] cal_out_both;
wire [99:0] cal_out_any;
wire [99:0] cal_out_different;
CalibrationReference control(.in(in),.out_both(cal_out_both),.out_any(cal_out_any),.out_different(cal_out_different));
assign out_both=~cal_out_both;
assign out_any=~cal_out_any;
assign out_different=~cal_out_different;
endmodule
