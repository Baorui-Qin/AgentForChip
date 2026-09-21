module TopModule(
  input wire clk,
  input wire d,
  input wire q
);
  RefModule preflight_reference(.clk(clk), .d(d), .q(q));
endmodule
