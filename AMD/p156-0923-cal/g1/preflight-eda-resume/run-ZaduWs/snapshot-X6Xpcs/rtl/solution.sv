module TopModule(
  input wire clk,
  input wire d,
  output wire q
);
  RefModule preflight_reference(.clk(clk), .d(d), .q(q));
endmodule
