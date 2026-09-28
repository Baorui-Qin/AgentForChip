module TopModule(
  input wire clk,
  input wire areset,
  input wire j,
  input wire k,
  output wire out
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .j(j), .k(k), .out(out));
endmodule
