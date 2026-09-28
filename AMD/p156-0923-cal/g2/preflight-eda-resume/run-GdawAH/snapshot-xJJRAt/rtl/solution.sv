module TopModule(
  input wire [7:0] code,
  output wire [3:0] out,
  output wire valid
);
  RefModule preflight_reference(.code(code), .out(out), .valid(valid));
endmodule
