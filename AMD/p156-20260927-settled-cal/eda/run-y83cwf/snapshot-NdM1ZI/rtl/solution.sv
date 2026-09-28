
module CalibrationReference (
  input [2:0] in,
  output [1:0] out
);

  assign out = in[0]+in[1]+in[2];

endmodule


module TopModule(input wire [2:0] in,output wire [1:0] out);
wire [1:0] cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
