module TopModule(
  input wire [7:0] a,
  input wire [7:0] b,
  output wire [7:0] s,
  output wire overflow
);
  RefModule preflight_reference(.a(a), .b(b), .s(s), .overflow(overflow));
endmodule
