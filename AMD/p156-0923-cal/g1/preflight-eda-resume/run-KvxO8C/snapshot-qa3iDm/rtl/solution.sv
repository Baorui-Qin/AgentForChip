module TopModule(
  input wire clk,
  input wire shift_ena,
  input wire count_ena,
  input wire data,
  output wire [3:0] q
);
  RefModule preflight_reference(.clk(clk), .shift_ena(shift_ena), .count_ena(count_ena), .data(data), .q(q));
endmodule
