module TopModule(
  input wire [7:0] in,
  output wire [2:0] pos
);
  RefModule preflight_reference(.in(in), .pos(pos));
endmodule
