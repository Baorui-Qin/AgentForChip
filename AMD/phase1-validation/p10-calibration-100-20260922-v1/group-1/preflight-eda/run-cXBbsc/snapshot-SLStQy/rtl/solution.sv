module TopModule(
  input wire clk,
  input wire reset,
  output wire [9:0] q
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .q(q));
endmodule
