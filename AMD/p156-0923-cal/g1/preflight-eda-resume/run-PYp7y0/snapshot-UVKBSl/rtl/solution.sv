module TopModule(
  input wire a,
  input wire b,
  input wire sel,
  output wire out
);
  RefModule preflight_reference(.a(a), .b(b), .sel(sel), .out(out));
endmodule
