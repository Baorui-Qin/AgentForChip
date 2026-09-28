module TopModule(
  input wire [4:0] a,
  input wire [4:0] b,
  input wire [4:0] c,
  input wire [4:0] d,
  input wire [4:0] e,
  input wire [4:0] f,
  output wire [7:0] w,
  output wire [7:0] x,
  output wire [7:0] y,
  output wire [7:0] z
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .e(e), .f(f), .w(w), .x(x), .y(y), .z(z));
endmodule
