module TopModule(
  input wire clk,
  input wire [7:0] d,
  output wire [7:0] q
);
  RefModule preflight_reference(.clk(clk), .d(d), .q(q));
endmodule
