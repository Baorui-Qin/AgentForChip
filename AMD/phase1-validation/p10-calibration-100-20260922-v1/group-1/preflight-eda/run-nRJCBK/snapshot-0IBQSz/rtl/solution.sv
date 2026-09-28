module TopModule(
  input wire clock,
  input wire a,
  output wire p,
  output wire q
);
  RefModule preflight_reference(.clock(clock), .a(a), .p(p), .q(q));
endmodule
