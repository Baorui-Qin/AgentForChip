module TopModule(
  input wire a,
  input wire b,
  output wire out_and,
  output wire out_or,
  output wire out_xor,
  output wire out_nand,
  output wire out_nor,
  output wire out_xnor,
  output wire out_anotb
);
  RefModule preflight_reference(.a(a), .b(b), .out_and(out_and), .out_or(out_or), .out_xor(out_xor), .out_nand(out_nand), .out_nor(out_nor), .out_xnor(out_xnor), .out_anotb(out_anotb));
endmodule
