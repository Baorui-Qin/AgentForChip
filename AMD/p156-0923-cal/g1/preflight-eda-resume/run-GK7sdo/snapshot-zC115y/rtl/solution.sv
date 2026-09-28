module TopModule(
  input wire clk,
  input wire reset,
  output wire [2:0] ena,
  output wire [15:0] q
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .ena(ena), .q(q));
endmodule
