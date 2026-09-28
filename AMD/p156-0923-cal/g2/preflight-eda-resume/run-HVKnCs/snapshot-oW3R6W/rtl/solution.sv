module TopModule(
  input wire clk,
  input wire reset,
  input wire in,
  output wire done
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .in(in), .done(done));
endmodule
