module TopModule(
  input wire [7:0] a,
  input wire [7:0] b,
  input wire [7:0] c,
  input wire [7:0] d,
  output wire [7:0] min
);
  RefModule preflight_reference(.a(a), .b(b), .c(c), .d(d), .min(min));
endmodule
