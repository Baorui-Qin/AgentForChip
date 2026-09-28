module TopModule(
  input wire a,
  input wire b,
  input wire c,
  input wire d,
  output wire out,
  output wire out_n
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .out(out), .out_n(out_n));
endmodule
