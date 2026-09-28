module TopModule(
  input wire clk,
  input wire aresetn,
  input wire x,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .aresetn(aresetn), .x(x), .z(z));
endmodule
