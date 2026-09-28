
module CalibrationReference (
  input [7:0] in,
  output parity
);

  assign parity = ^in;

endmodule


module TopModule(input wire [7:0] in,output wire parity);
wire cal_parity;
CalibrationReference control(.in(in),.parity(cal_parity));
assign parity=~cal_parity;
endmodule
