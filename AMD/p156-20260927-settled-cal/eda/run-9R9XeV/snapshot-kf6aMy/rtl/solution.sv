
module CalibrationReference (
  input [7:0] in,
  output [31:0] out
);

  assign out = { {24{in[7]}}, in };

endmodule


module TopModule(input wire [7:0] in,output wire [31:0] out);
wire [31:0] cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
