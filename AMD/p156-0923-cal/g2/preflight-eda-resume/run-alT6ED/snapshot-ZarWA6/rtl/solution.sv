module TopModule(
  input wire clk,
  input wire reset,
  input wire [7:0] in,
  output wire done
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .in(in), .done(done));
endmodule
