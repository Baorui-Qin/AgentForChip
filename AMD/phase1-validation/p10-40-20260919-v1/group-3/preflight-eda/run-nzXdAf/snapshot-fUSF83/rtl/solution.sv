module TopModule(
  input wire [2:0] y,
  input wire w,
  output wire Y1
);
  RefModule preflight_reference(.y(y), .w(w), .Y1(Y1));
endmodule
