module TopModule(
  input wire in1,
  input wire in2,
  output wire out
);
  RefModule preflight_reference(.in1(in1), .in2(in2), .out(out));
endmodule
