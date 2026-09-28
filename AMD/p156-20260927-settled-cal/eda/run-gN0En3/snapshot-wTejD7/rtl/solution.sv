
module CalibrationReference (
  input clk,
  input [7:0] d,
  input areset,
  output reg [7:0] q
);

  always @(posedge clk, posedge areset)
    if (areset)
      q <= 0;
    else
      q <= d;

endmodule


module TopModule(input wire clk,input wire areset,input wire [7:0] d,output wire [7:0] q);
wire [7:0] cal_q;
CalibrationReference control(.clk(clk),.areset(areset),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
