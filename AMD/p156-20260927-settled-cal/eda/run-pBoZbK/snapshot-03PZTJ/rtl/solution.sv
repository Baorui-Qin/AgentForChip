
module CalibrationReference (
  input clk,
  input a,
  output reg [2:0] q
);

  always @(posedge clk)
    if (a)
      q <= 4;
    else if (q == 6)
      q <= 0;
    else
      q <= q + 1'b1;

endmodule


module TopModule(input wire clk,input wire a,output wire [2:0] q);
wire [2:0] cal_q;
CalibrationReference control(.clk(clk),.a(a),.q(cal_q));
assign q=~cal_q;
endmodule
