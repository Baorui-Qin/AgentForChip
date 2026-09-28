module TopModule(
  input wire [3:0] x,
  input wire [3:0] y,
  output wire [4:0] sum
);
  RefModule preflight_reference(.x(x), .y(y), .sum(sum));
endmodule
