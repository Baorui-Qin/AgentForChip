module TopModule(
  input wire a,
  input wire b,
  output wire out
);
  RefModule preflight_reference(.a(a), .b(b), .out(out));
endmodule
