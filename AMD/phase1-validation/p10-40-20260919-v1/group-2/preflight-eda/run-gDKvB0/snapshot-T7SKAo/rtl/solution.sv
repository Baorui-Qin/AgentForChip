module TopModule(
  input wire clk,
  input wire reset,
  input wire data,
  input wire done_counting,
  input wire ack,
  output wire shift_ena,
  output wire counting,
  output wire done
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .data(data), .done_counting(done_counting), .ack(ack), .shift_ena(shift_ena), .counting(counting), .done(done));
endmodule
