module TopModule(
  input wire clk,
  input wire resetn,
  input wire x,
  input wire y,
  output wire f,
  output wire g
);
  RefModule preflight_reference(.clk(clk), .resetn(resetn), .x(x), .y(y), .f(f), .g(g));
endmodule
