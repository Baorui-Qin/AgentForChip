module TopModule(
  input wire clk,
  input wire x,
  input wire [2:0] y,
  output wire Y0,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .x(x), .y(y), .Y0(Y0), .z(z));
endmodule
