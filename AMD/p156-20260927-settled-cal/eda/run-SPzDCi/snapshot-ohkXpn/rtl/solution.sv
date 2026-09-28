
module CalibrationReference (
  input [254:0] in,
  output reg [7:0] out
);

  always_comb  begin
    out = 0;
    for (int i=0;i<255;i++)
      out = out + in[i];
  end

endmodule


module TopModule(input wire [254:0] in,output wire [7:0] out);
wire [7:0] cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
