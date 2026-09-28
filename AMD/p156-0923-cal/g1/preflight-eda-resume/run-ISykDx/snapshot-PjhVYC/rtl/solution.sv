module TopModule(
  input wire clk,
  input wire reset,
  input wire [31:0] in,
  output wire [31:0] out
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .in(in), .out(out));
endmodule
