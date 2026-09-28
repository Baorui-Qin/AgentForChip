module TopModule(input wire [0:0] clk, input wire [0:0] areset, input wire [0:0] predict_valid, input wire [6:0] predict_pc, output wire [0:0] predict_taken, output wire [6:0] predict_history, input wire [0:0] train_valid, input wire [0:0] train_taken, input wire [0:0] train_mispredicted, input wire [6:0] train_history, input wire [6:0] train_pc);
assign predict_taken = '0;
assign predict_history = '0;
endmodule
