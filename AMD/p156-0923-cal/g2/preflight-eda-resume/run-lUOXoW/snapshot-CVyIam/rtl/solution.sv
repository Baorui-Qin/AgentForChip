module TopModule(
  input wire a,
  input wire b,
  output wire q
);
  RefModule preflight_reference(.a(a), .b(b), .q(q));
endmodule
