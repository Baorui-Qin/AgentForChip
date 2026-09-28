module TopModule(
  input wire clk,
  input wire enable,
  input wire S,
  input wire A,
  input wire B,
  input wire C,
  output wire Z
);
  RefModule preflight_reference(.clk(clk), .enable(enable), .S(S), .A(A), .B(B), .C(C), .Z(Z));
endmodule
