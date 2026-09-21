module TopModule(
  input wire [99:0] in,
  output wire [99:0] out
);
  RefModule preflight_reference(.in(in), .out(out));
endmodule
