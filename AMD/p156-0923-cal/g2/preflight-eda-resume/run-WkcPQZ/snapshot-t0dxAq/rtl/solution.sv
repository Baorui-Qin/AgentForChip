module TopModule(
  input wire d,
  input wire done_counting,
  input wire ack,
  input wire [9:0] state,
  output wire B3_next,
  output wire S_next,
  output wire S1_next,
  output wire Count_next,
  output wire Wait_next,
  output wire done,
  output wire counting,
  output wire shift_ena
);
  RefModule preflight_reference(.d(d), .done_counting(done_counting), .ack(ack), .state(state), .B3_next(B3_next), .S_next(S_next), .S1_next(S1_next), .Count_next(Count_next), .Wait_next(Wait_next), .done(done), .counting(counting), .shift_ena(shift_ena));
endmodule
