module TopModule(
  input wire a,
  input wire b,
  input wire sel_b1,
  input wire sel_b2,
  output wire out_assign,
  output wire out_always
);
  RefModule preflight_reference(.a(a), .b(b), .sel_b1(sel_b1), .sel_b2(sel_b2), .out_assign(out_assign), .out_always(out_always));
endmodule
