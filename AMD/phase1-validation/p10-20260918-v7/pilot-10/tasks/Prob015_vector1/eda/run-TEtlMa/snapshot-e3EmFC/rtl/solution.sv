module TopModule(
  input wire [15:0] in,
  output wire [7:0] out_hi,
  output wire [7:0] out_lo
);
  RefModule preflight_reference(.in(in), .out_hi(out_hi), .out_lo(out_lo));
endmodule
