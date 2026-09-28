module TopModule(
  input wire clk,
  input wire areset,
  input wire predict_valid,
  input wire predict_taken,
  input wire train_mispredicted,
  input wire train_taken,
  input wire [31:0] train_history,
  output wire [31:0] predict_history
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .predict_valid(predict_valid), .predict_taken(predict_taken), .train_mispredicted(train_mispredicted), .train_taken(train_taken), .train_history(train_history), .predict_history(predict_history));
endmodule
