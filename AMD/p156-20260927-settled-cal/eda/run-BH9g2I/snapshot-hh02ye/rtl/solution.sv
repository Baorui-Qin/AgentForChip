
module CalibrationReference (
  input [255:0] in,
  input [7:0] sel,
  output  out
);

  assign out = in[sel];

endmodule


module TopModule(input wire [255:0] in,input wire [7:0] sel,output wire out);
wire cal_out;
CalibrationReference control(.in(in),.sel(sel),.out(cal_out));
assign out=~cal_out;
endmodule
