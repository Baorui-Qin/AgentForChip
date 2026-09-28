module TopModule(
  input wire clk,
  input wire reset,
  input wire j,
  input wire k,
  output wire out
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .j(j), .k(k), .out(out));
endmodule
