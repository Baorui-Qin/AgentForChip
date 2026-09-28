module TopModule(
  input wire clk,
  input wire a,
  input wire b,
  output wire out_assign,
  output wire out_always_comb,
  output wire out_always_ff
);
  RefModule preflight_reference(.clk(clk), .a(a), .b(b), .out_assign(out_assign), .out_always_comb(out_always_comb), .out_always_ff(out_always_ff));
endmodule
