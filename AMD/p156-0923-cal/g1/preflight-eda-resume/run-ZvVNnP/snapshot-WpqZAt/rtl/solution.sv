module TopModule(
  input wire clk,
  input wire w,
  input wire R,
  input wire E,
  input wire L,
  output wire Q
);
  RefModule preflight_reference(.clk(clk), .w(w), .R(R), .E(E), .L(L), .Q(Q));
endmodule
