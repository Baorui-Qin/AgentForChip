module TopModule(
  input wire clk,
  input wire areset,
  input wire predict_valid,
  input wire [6:0] predict_pc,
  output wire predict_taken,
  output wire [6:0] predict_history,
  input wire train_valid,
  input wire train_taken,
  input wire train_mispredicted,
  input wire [6:0] train_history,
  input wire [6:0] train_pc
);
  RefModule preflight_reference(.clk(clk), .areset(areset), .predict_valid(predict_valid), .predict_pc(predict_pc), .predict_taken(predict_taken), .predict_history(predict_history), .train_valid(train_valid), .train_taken(train_taken), .train_mispredicted(train_mispredicted), .train_history(train_history), .train_pc(train_pc));
endmodule
