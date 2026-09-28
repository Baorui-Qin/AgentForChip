
module CalibrationReference (
  input [1023:0] in,
  input [7:0] sel,
  output [3:0] out
);

  assign out = {in[sel*4+3], in[sel*4+2], in[sel*4+1], in[sel*4+0]};

endmodule


module TopModule(input wire [1023:0] in,input wire [7:0] sel,output wire [3:0] out);
wire [3:0] cal_out;
CalibrationReference control(.in(in),.sel(sel),.out(cal_out));
assign out=~cal_out;
endmodule
