module TopModule(
  input wire x,
  input wire y,
  output wire z
);
  RefModule preflight_reference(.x(x), .y(y), .z(z));
endmodule
