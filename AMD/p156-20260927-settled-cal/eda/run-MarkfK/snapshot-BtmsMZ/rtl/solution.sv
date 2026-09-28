
module CalibrationReference (
  input [2:0] a,
  input [2:0] b,
  output [2:0] out_or_bitwise,
  output out_or_logical,
  output [5:0] out_not
);

  assign out_or_bitwise = a | b;
  assign out_or_logical = a || b;
  assign out_not = {~b,~a};

endmodule


module TopModule(input wire [2:0] a,input wire [2:0] b,output wire [2:0] out_or_bitwise,output wire out_or_logical,output wire [5:0] out_not);
wire [2:0] cal_out_or_bitwise;
wire cal_out_or_logical;
wire [5:0] cal_out_not;
CalibrationReference control(.a(a),.b(b),.out_or_bitwise(cal_out_or_bitwise),.out_or_logical(cal_out_or_logical),.out_not(cal_out_not));
assign out_or_bitwise=~cal_out_or_bitwise;
assign out_or_logical=~cal_out_or_logical;
assign out_not=~cal_out_not;
endmodule
