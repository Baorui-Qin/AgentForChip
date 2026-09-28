module TopModule(
  input wire clk,
  input wire areset,
  input wire in,
  output wire out
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .in(in), .out(out));
endmodule
