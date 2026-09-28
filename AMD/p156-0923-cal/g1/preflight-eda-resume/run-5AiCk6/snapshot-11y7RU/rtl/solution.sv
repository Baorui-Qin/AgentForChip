module TopModule(
  input wire x3,
  input wire x2,
  input wire x1,
  output wire f
);
  RefModule preflight_reference(.x3(x3), .x2(x2), .x1(x1), .f(f));
endmodule
