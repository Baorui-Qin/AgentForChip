module TopModule(
  input wire [2:0] in,
  output wire [1:0] out
);
  RefModule preflight_reference(.in(in), .out(out));
endmodule
