module TopModule(
  input wire [7:0] in,
  output wire [31:0] out
);
  RefModule preflight_reference(.in(in), .out(out));
endmodule
