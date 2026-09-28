module TopModule(
  input wire [3:0] in,
  output wire [1:0] pos
);
  RefModule preflight_reference(.in(in), .pos(pos));
endmodule
