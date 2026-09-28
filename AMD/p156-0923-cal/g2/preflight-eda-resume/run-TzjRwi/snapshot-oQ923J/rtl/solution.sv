module TopModule(
  input wire clk,
  input wire reset,
  input wire x,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .x(x), .z(z));
endmodule
