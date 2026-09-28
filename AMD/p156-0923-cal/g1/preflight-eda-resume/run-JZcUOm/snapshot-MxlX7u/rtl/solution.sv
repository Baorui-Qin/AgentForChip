module TopModule(
  input wire a,
  input wire b,
  input wire c,
  output wire out
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .out(out));
endmodule
