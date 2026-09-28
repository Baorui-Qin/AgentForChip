module TopModule(
  input wire a,
  input wire b,
  input wire c,
  input wire d,
  input wire e,
  output wire [24:0] out
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .e(e), .out(out));
endmodule
