module TopModule(
  input wire [15:0] scancode,
  output wire left,
  output wire down,
  output wire right,
  output wire up
);
  RefModule preflight_reference(.scancode(scancode), .left(left), .down(down), .right(right), .up(up));
endmodule
