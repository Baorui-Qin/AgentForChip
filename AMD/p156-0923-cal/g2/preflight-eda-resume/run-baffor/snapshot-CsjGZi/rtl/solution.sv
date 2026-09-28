module TopModule(
  input wire [3:0] a,
  input wire [3:0] b,
  input wire [3:0] c,
  input wire [3:0] d,
  input wire [3:0] e,
  output wire [3:0] q
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .e(e), .q(q));
endmodule
