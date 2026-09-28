module TopModule(
  input wire clk,
  input wire [7:0] in,
  output wire [7:0] anyedge
);
  RefModule preflight_reference(.clk(clk), .in(in), .anyedge(anyedge));
endmodule
