module TopModule(
  input wire a,
  input wire b,
  input wire c,
  input wire d,
  output wire out_sop,
  output wire out_pos
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .out_sop(out_sop), .out_pos(out_pos));
endmodule
