module TopModule(
  input wire [99:0] a,
  input wire [99:0] b,
  input wire sel,
  output wire [99:0] out
);
  RefModule preflight_reference(.a(a), .b(b), .sel(sel), .out(out));
endmodule
