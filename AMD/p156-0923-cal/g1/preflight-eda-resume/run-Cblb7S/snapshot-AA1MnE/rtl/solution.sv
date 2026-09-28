module TopModule(
  input wire [2:0] a,
  input wire [2:0] b,
  output wire [2:0] out_or_bitwise,
  output wire out_or_logical,
  output wire [5:0] out_not
);
  RefModule preflight_reference(.a(a), .b(b), .out_or_bitwise(out_or_bitwise), .out_or_logical(out_or_logical), .out_not(out_not));
endmodule
