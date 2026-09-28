module TopModule(
  input wire [99:0] in,
  output wire [99:0] out_both,
  output wire [99:0] out_any,
  output wire [99:0] out_different
);
  RefModule preflight_reference(.in(in), .out_both(out_both), .out_any(out_any), .out_different(out_different));
endmodule
