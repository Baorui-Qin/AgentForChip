
module CalibrationReference (
  input [7:0] in,
  output [7:0] out
);

  assign {out[0],out[1],out[2],out[3],out[4],out[5],out[6],out[7]} = in;

endmodule


module TopModule(input wire [7:0] in,output wire [7:0] out);
wire [7:0] cal_out;
CalibrationReference control(.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
