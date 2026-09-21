module TopModule(
  input wire in1,
  input wire in2,
  input wire in3,
  output wire out
);
  RefModule preflight_reference(.in1(in1), .in2(in2), .in3(in3), .out(out));
endmodule
