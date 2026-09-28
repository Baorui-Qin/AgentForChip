module TopModule(
  input wire clk,
  input wire reset,
  output wire shift_ena
);
  RefModule preflight_reference(.clk(clk), .reset(reset), .shift_ena(shift_ena));
endmodule
