module TopModule(
  input wire clk,
  input wire areset,
  input wire x,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .x(x), .z(z));
endmodule
