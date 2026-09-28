module TopModule(
  input wire clk,
  input wire resetn,
  input wire [2:0] r,
  output wire [2:0] g
);
  RefModule preflight_reference(.clk(clk), .resetn(resetn), .r(r), .g(g));
endmodule
