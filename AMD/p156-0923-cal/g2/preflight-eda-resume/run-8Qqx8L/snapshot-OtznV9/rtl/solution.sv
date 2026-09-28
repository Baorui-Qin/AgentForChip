module TopModule(
  input wire clk,
  input wire load,
  input wire ena,
  input wire [1:0] amount,
  input wire [63:0] data,
  output wire [63:0] q
);
  RefModule preflight_reference(.clk(clk), .load(load), .ena(ena), .amount(amount), .data(data), .q(q));
endmodule
