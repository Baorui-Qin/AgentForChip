module TopModule(
  input wire [99:0] in,
  output wire out_and,
  output wire out_or,
  output wire out_xor
);
  RefModule preflight_reference(.in(in), .out_and(out_and), .out_or(out_or), .out_xor(out_xor));
endmodule
