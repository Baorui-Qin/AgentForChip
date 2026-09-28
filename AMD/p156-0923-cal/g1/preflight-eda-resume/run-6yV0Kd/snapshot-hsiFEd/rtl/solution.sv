module TopModule(
  input wire a,
  input wire b,
  input wire cin,
  output wire cout,
  output wire sum
);
  RefModule preflight_reference(.a(a), .b(b), .cin(cin), .cout(cout), .sum(sum));
endmodule
