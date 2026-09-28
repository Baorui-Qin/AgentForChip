
module CalibrationReference (
  input a,
  input b,
  output out_assign,
  output reg out_alwaysblock
);

  assign out_assign = a & b;
  always @(*) out_alwaysblock = a & b;

endmodule


module TopModule(input wire a,input wire b,output wire out_assign,output wire out_alwaysblock);
wire cal_out_assign;
wire cal_out_alwaysblock;
CalibrationReference control(.a(a),.b(b),.out_assign(cal_out_assign),.out_alwaysblock(cal_out_alwaysblock));
assign out_assign=~cal_out_assign;
assign out_alwaysblock=~cal_out_alwaysblock;
endmodule
