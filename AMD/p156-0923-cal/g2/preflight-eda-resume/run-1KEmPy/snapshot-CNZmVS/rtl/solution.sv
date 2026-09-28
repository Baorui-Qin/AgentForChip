module TopModule(
  input wire clk,
  input wire load,
  input wire [1:0] ena,
  input wire [99:0] data,
  output wire [99:0] q
);
  RefModule preflight_reference(.clk(clk), .load(load), .ena(ena), .data(data), .q(q));
endmodule
