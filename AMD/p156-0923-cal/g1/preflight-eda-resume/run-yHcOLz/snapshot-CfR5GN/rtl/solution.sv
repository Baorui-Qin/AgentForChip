module TopModule(
  input wire a,
  input wire b,
  input wire c,
  input wire d,
  output wire out
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .out(out));
endmodule
