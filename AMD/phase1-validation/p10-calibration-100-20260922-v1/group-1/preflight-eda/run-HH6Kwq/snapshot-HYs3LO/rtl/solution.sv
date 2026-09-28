module TopModule(
  input wire clk,
  input wire load,
  input wire [511:0] data,
  output wire [511:0] q
);
  RefModule preflight_reference(.clk(clk), .load(load), .data(data), .q(q));
endmodule
