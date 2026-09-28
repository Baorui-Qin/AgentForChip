
module CalibrationReference (
  input [7:0] a,
  input [7:0] b,
  output [7:0] s,
  output overflow
);

  wire [8:0] sum = a+b;
  assign s = sum[7:0];
  assign overflow = !(a[7]^b[7]) && (a[7] != s[7]);

endmodule


module TopModule(input wire [7:0] a,input wire [7:0] b,output wire [7:0] s,output wire overflow);
wire [7:0] cal_s;
wire cal_overflow;
CalibrationReference control(.a(a),.b(b),.s(cal_s),.overflow(cal_overflow));
assign s=~cal_s;
assign overflow=~cal_overflow;
endmodule
