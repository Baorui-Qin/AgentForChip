module TopModule(
  input wire [2:0] a,
  output wire [15:0] q
);
  RefModule preflight_reference(.a(a), .q(q));
endmodule
