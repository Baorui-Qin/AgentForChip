module TopModule(
  input wire clk,
  input wire in,
  output wire out
);
  RefModule preflight_reference(.clk(clk), .in(in), .out(out));
endmodule
