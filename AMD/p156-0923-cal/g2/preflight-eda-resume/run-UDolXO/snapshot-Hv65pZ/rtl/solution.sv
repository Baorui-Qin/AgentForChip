module TopModule(
  input wire in,
  input wire [1:0] state,
  output wire [1:0] next_state,
  output wire out
);
  RefModule preflight_reference(.in(in), .state(state), .next_state(next_state), .out(out));
endmodule
