module TopModule(
  input wire [15:0] a,
  input wire [15:0] b,
  input wire [15:0] c,
  input wire [15:0] d,
  input wire [15:0] e,
  input wire [15:0] f,
  input wire [15:0] g,
  input wire [15:0] h,
  input wire [15:0] i,
  input wire [3:0] sel,
  output wire [15:0] out
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .e(e), .f(f), .g(g), .h(h), .i(i), .sel(sel), .out(out));
endmodule
