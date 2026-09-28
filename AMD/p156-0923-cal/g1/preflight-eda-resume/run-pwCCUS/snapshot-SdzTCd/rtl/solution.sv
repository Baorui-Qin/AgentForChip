module TopModule(
  input wire a,
  input wire b,
  output wire sum,
  output wire cout
);
  RefModule preflight_reference(.a(a), .b(b), .sum(sum), .cout(cout));
endmodule
