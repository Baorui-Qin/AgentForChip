
module CalibrationReference (
  input clk,
  input [7:0] d,
  output reg [7:0] q
);

  initial
    q = 8'h0;

  always @(posedge clk)
    q <= d;

endmodule


module TopModule(input wire clk,input wire [7:0] d,output wire [7:0] q);
wire [7:0] cal_q;
CalibrationReference control(.clk(clk),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
