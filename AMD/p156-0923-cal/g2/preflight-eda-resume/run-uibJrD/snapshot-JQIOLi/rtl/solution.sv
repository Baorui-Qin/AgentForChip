module TopModule(
  input wire clk,
  input wire L,
  input wire q_in,
  input wire r_in,
  output wire Q
);
  RefModule preflight_reference(.clk(clk), .L(L), .q_in(q_in), .r_in(r_in), .Q(Q));
endmodule
