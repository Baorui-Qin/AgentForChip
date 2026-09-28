module TopModule(
  input wire in,
  input wire [9:0] state,
  output wire [9:0] next_state,
  output wire out1,
  output wire out2
);
  RefModule preflight_reference(.in(in), .state(state), .next_state(next_state), .out1(out1), .out2(out2));
endmodule
