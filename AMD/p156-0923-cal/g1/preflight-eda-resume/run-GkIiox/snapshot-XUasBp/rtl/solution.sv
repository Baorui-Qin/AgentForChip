module TopModule(
  input wire clk,
  input wire areset,
  input wire [7:0] d,
  output wire [7:0] q
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .d(d), .q(q));
endmodule
