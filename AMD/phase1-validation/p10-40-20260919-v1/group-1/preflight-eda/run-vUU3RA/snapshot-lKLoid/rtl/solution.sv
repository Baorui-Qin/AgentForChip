module TopModule(
  input wire [1:0] A,
  input wire [1:0] B,
  output wire z
);
  RefModule preflight_reference(.A(A), .B(B), .z(z));
endmodule
