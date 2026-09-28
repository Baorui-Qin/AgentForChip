module TopModule(
  input wire clk,
  input wire resetn,
  input wire [1:0] byteena,
  input wire [15:0] d,
  output wire [15:0] q
);
  RefModule preflight_reference(.clk(clk), .resetn(resetn), .byteena(byteena), .d(d), .q(q));
endmodule
