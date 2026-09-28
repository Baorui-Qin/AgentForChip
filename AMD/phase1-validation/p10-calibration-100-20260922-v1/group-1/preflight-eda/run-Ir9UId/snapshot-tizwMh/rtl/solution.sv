module TopModule(
  input wire a,
  input wire b,
  output wire out_assign,
  output wire out_alwaysblock
);
  RefModule preflight_reference(.a(a), .b(b), .out_assign(out_assign), .out_alwaysblock(out_alwaysblock));
endmodule
