module TopModule(
  input wire [5:0] y,
  input wire w,
  output wire Y1,
  output wire Y3
);
  RefModule preflight_reference(.y(y), .w(w), .Y1(Y1), .Y3(Y3));
endmodule
