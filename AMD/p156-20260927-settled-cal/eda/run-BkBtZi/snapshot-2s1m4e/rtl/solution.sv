
module CalibrationReference (
  input [7:0] a,
  input [7:0] b,
  input [7:0] c,
  input [7:0] d,
  output reg [7:0] min
);

  always_comb begin
    min = a;
    if (min > b) min = b;
    if (min > c) min = c;
    if (min > d) min = d;
  end

endmodule


module TopModule(input wire [7:0] a,input wire [7:0] b,input wire [7:0] c,input wire [7:0] d,output wire [7:0] min);
wire [7:0] cal_min;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.min(cal_min));
assign min=~cal_min;
endmodule
