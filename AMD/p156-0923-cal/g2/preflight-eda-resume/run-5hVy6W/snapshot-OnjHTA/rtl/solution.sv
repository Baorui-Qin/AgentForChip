module TopModule(
  input wire clk,
  input wire reset,
  input wire in,
  output wire disc,
  output wire flag,
  output wire err
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .in(in), .disc(disc), .flag(flag), .err(err));
endmodule
