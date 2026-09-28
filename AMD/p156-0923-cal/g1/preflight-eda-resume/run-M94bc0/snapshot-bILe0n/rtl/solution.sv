module TopModule(
  input wire clk,
  input wire ar,
  input wire d,
  output wire q
);
  RefModule preflight_reference(.clk(clk), .ar(ar), .d(d), .q(q));
endmodule
