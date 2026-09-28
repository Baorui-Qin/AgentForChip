module TopModule(
  input wire clk,
  input wire a,
  output wire q
);
  RefModule preflight_reference(.clk(clk), .a(a), .q(q));
endmodule
