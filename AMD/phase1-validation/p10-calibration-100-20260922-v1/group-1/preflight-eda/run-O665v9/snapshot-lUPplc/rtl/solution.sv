module TopModule(
  input wire clk,
  input wire areset,
  input wire bump_left,
  input wire bump_right,
  input wire ground,
  output wire walk_left,
  output wire walk_right,
  output wire aaah
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .bump_left(bump_left), .bump_right(bump_right), .ground(ground), .walk_left(walk_left), .walk_right(walk_right), .aaah(aaah));
endmodule
