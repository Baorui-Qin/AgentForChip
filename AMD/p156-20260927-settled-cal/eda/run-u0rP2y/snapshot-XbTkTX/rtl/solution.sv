
module CalibrationReference (
  input [99:0] in,
  output reg [99:0] out
);

  always_comb
    for (int i=0;i<$bits(out);i++)
      out[i] = in[$bits(out)-i-1];

endmodule


module TopModule(input wire [99:0] in,output wire [99:0] out);
wire [99:0] cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
