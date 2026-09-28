
module CalibrationReference (
  input  [3:0] in,
  output [3:0] out_both,
  output [3:0] out_any,
  output [3:0] out_different
);

  assign out_both[2:0] = in[2:0] & in[3:1];
  assign out_any[3:1]  = in[2:0] | in[3:1];
  assign out_different = in^{in[0], in[3:1]};

  // we don't care about out_both[3] or out_any[0]
  assign out_both[3] = 1'bx;
  assign out_any[0]  = 1'bx;

endmodule


module TopModule(input wire [3:0] in,output wire [3:0] out_both,output wire [3:0] out_any,output wire [3:0] out_different);
wire [3:0] cal_out_both;
wire [3:0] cal_out_any;
wire [3:0] cal_out_different;
CalibrationReference control(.in(in),.out_both(cal_out_both),.out_any(cal_out_any),.out_different(cal_out_different));
assign out_both=~cal_out_both;
assign out_any=~cal_out_any;
assign out_different=~cal_out_different;
endmodule
