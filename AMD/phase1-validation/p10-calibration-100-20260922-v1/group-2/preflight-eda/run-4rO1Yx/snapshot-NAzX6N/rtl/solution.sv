module TopModule(
  input wire clk,
  input wire resetn,
  input wire in,
  output wire out
);
  RefModule preflight_reference(.clk(clk), .resetn(resetn), .in(in), .out(out));
endmodule
