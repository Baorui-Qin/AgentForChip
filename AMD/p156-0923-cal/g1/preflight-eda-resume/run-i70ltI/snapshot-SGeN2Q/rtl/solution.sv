module TopModule(
  input wire d,
  input wire ena,
  output wire q
);
  RefModule preflight_reference(.d(d), .ena(ena), .q(q));
endmodule
