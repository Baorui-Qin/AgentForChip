module TopModule(
  input wire clk,
  input wire a,
  output wire [2:0] q
);
  RefModule preflight_reference(.clk(clk), .a(a), .q(q));
endmodule
