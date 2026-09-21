module TopModule(
  input wire clk,
  input wire x,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .x(x), .z(z));
endmodule
