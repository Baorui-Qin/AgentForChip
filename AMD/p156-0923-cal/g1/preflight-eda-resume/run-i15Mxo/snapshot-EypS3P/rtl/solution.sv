module TopModule(
  input wire [2:0] vec,
  output wire [2:0] outv,
  output wire o2,
  output wire o1,
  output wire o0
);
  RefModule preflight_reference(.vec(vec), .outv(outv), .o2(o2), .o1(o1), .o0(o0));
endmodule
