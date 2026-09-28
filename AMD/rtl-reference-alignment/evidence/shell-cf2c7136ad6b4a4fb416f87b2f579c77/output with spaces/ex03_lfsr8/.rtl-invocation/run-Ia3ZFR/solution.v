// EXPLICIT MOCK: interface fixture only; not a model-generated solution.
module TopModule (
  input wire clk,
  input wire reset,
  input wire load,
  input wire [7:0] data,
  output wire [7:0] q
);
assign q = 8'd0;
endmodule
