
module CalibrationReference (
  input [3:0] a,
  input [3:0] b,
  input [3:0] c,
  input [3:0] d,
  input [3:0] e,
  output reg [3:0] q
);

  always @(*)
    case (c)
      0: q = b;
      1: q = e;
      2: q = a;
      3: q = d;
      default: q = 4'hf;
    endcase

endmodule


module TopModule(input wire [3:0] a,input wire [3:0] b,input wire [3:0] c,input wire [3:0] d,input wire [3:0] e,output wire [3:0] q);
wire [3:0] cal_q;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.e(e),.q(cal_q));
assign q=~cal_q;
endmodule
