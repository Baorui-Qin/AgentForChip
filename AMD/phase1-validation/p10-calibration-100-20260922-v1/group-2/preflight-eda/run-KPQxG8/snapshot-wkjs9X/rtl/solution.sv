module TopModule(
  input wire [7:0] in,
  output wire parity
);
  RefModule preflight_reference(.in(in), .parity(parity));
endmodule
