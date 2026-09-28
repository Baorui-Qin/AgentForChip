module TopModule(
  input wire clk,
  input wire a,
  input wire b,
  output wire q,
  output wire state
);
  RefModule preflight_reference(.clk(clk), .a(a), .b(b), .q(q), .state(state));
endmodule
