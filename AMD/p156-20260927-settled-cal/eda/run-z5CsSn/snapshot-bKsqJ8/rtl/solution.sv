
module CalibrationReference (
  input [31:0] in,
  output [31:0] out
);

  assign out = {in[7:0], in[15:8], in[23:16], in[31:24]};

endmodule


module TopModule(input wire [31:0] in,output wire [31:0] out);
wire [31:0] cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
