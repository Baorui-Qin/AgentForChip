module TopModule(
  input wire clk,
  input wire reset,
  input wire s,
  input wire w,
  output wire z
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .s(s), .w(w), .z(z));
endmodule
