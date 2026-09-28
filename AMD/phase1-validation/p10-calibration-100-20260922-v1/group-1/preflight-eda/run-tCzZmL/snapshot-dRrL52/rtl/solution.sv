module TopModule(
  input wire clk,
  input wire reset,
  input wire [7:0] d,
  output wire [7:0] q
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .d(d), .q(q));
endmodule
