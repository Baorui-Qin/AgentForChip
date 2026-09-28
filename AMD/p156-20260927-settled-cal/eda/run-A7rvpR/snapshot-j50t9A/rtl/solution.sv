
module CalibrationReference (
  input [3:0] x,
  input [3:0] y,
  output [4:0] sum
);

  assign sum = x+y;

endmodule


module TopModule(input wire [3:0] x,input wire [3:0] y,output wire [4:0] sum);
wire [4:0] cal_sum;
CalibrationReference control(.x(x),.y(y),.sum(cal_sum));
assign sum=~cal_sum;
endmodule
