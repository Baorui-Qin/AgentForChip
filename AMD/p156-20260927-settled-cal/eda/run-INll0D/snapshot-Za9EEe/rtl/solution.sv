
module CalibrationReference (
  input clk,
  input a,
  input b,
  output out_assign,
  output reg out_always_comb,
  output reg out_always_ff
);

  assign out_assign = a ^ b;
  always @(*) out_always_comb = a ^ b;
  always @(posedge clk) out_always_ff <= a ^ b;

endmodule


module TopModule(input wire clk,input wire a,input wire b,output wire out_assign,output wire out_always_comb,output wire out_always_ff);
wire cal_out_assign;
wire cal_out_always_comb;
wire cal_out_always_ff;
CalibrationReference control(.clk(clk),.a(a),.b(b),.out_assign(cal_out_assign),.out_always_comb(cal_out_always_comb),.out_always_ff(cal_out_always_ff));
assign out_assign=~cal_out_assign;
assign out_always_comb=~cal_out_always_comb;
assign out_always_ff=~cal_out_always_ff;
endmodule
