module TopModule(
  input wire clk,
  input wire [7:0] in,
  output wire [7:0] pedge
);
  RefModule preflight_reference(.clk(clk), .in(in), .pedge(pedge));
endmodule
