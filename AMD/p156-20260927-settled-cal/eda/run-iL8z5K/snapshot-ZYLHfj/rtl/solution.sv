
module CalibrationReference (
  input a,
  input b,
  input c,
  input d,
  output out_sop,
  output out_pos
);

  wire pos0, pos1;
  assign out_sop = c&d | ~a&~b&c;
  assign pos0 = c & (~b|d)&(~a|b);
  assign pos1 = c & (~b|d)&(~a|d);

  assign out_pos = (pos0 == pos1) ? pos0 : 1'bx;

endmodule


module TopModule(input wire a,input wire b,input wire c,input wire d,output wire out_sop,output wire out_pos);
wire cal_out_sop;
wire cal_out_pos;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.out_sop(cal_out_sop),.out_pos(cal_out_pos));
assign out_sop=~cal_out_sop;
assign out_pos=~cal_out_pos;
endmodule
