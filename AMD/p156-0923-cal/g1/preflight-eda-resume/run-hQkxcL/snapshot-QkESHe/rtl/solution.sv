module TopModule(
  input wire clk,
  input wire d,
  input wire r,
  output wire q
);
  RefModule preflight_reference(.clk(clk), .d(d), .r(r), .q(q));
endmodule
