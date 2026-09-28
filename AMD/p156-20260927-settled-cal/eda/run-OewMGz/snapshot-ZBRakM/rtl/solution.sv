
module CalibrationReference (
  input a,
  input b,
  input sel_b1,
  input sel_b2,
  output out_assign,
  output reg out_always
);

  assign out_assign = (sel_b1 & sel_b2) ? b : a;
  always @(*) out_always = (sel_b1 & sel_b2) ? b : a;

endmodule


module TopModule(input wire a,input wire b,input wire sel_b1,input wire sel_b2,output wire out_assign,output wire out_always);
wire cal_out_assign;
wire cal_out_always;
CalibrationReference control(.a(a),.b(b),.sel_b1(sel_b1),.sel_b2(sel_b2),.out_assign(cal_out_assign),.out_always(cal_out_always));
assign out_assign=~cal_out_assign;
assign out_always=~cal_out_always;
endmodule
