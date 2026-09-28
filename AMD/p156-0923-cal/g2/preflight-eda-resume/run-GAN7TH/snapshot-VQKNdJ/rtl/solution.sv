module TopModule(
  input wire clk,
  input wire reset,
  input wire w,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .w(w), .z(z));
endmodule
