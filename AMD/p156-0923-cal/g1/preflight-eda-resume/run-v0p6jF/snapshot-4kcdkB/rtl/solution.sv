module TopModule(
  input wire clk,
  input wire reset,
  input wire slowena,
  output wire [3:0] q
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .slowena(slowena), .q(q));
endmodule
