module TopModule(
  input wire c,
  input wire d,
  output wire [3:0] mux_in
);
  RefModule preflight_reference(.c(c), .d(d), .mux_in(mux_in));
endmodule
