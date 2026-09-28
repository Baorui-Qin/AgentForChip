
module CalibrationReference (
  input clock,
  input a,
  output reg p,
  output reg q
);

  always @(negedge clock)
    q <= a;

  always @(*)
    if (clock)
      p = a;

endmodule


module TopModule(input wire clock,input wire a,output wire p,output wire q);
wire cal_p;
wire cal_q;
CalibrationReference control(.clock(clock),.a(a),.p(cal_p),.q(cal_q));
assign p=~cal_p;
assign q=~cal_q;
endmodule
