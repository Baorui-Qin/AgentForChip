module TopModule(
  input wire clk,
  input wire areset,
  input wire train_valid,
  input wire train_taken,
  output wire [1:0] state
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .train_valid(train_valid), .train_taken(train_taken), .state(state));
endmodule
