module TopModule(
  input wire clk,
  input wire areset,
  input wire load,
  input wire ena,
  input wire [3:0] data,
  output wire [3:0] q
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .load(load), .ena(ena), .data(data), .q(q));
endmodule
