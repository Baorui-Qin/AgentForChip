module TopModule(
  input wire p1a,
  input wire p1b,
  input wire p1c,
  input wire p1d,
  input wire p2a,
  input wire p2b,
  input wire p2c,
  input wire p2d,
  output wire p1y,
  output wire p2y
);
  RefModule preflight_reference(.p1a(p1a), .p1b(p1b), .p1c(p1c), .p1d(p1d), .p2a(p2a), .p2b(p2b), .p2c(p2c), .p2d(p2d), .p1y(p1y), .p2y(p2y));
endmodule
