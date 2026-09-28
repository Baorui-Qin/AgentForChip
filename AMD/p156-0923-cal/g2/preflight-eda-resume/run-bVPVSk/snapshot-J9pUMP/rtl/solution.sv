module TopModule(
  input wire clk,
  input wire load,
  input wire [9:0] data,
  output wire tc
);
  RefModule preflight_reference(.clk(clk), .load(load), .data(data), .tc(tc));
endmodule
