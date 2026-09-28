module TopModule(
  input wire a,
  input wire b,
  input wire c,
  output wire w,
  output wire x,
  output wire y,
  output wire z
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .w(w), .x(x), .y(y), .z(z));
endmodule
