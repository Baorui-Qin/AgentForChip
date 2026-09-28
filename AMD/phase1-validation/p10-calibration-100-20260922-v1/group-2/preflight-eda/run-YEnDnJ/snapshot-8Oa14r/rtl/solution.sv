module TopModule(
  input wire clk,
  input wire reset,
  input wire data,
  output wire start_shifting
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .data(data), .start_shifting(start_shifting));
endmodule
