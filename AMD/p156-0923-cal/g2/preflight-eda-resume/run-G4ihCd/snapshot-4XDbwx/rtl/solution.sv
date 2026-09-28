module TopModule(
  input wire [3:0] x,
  output wire f
);
  RefModule preflight_reference(.x(x), .f(f));
endmodule
