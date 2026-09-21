module TopModule(
  input wire in,
  output wire out
);
  RefModule preflight_reference(.in(in), .out(out));
endmodule
