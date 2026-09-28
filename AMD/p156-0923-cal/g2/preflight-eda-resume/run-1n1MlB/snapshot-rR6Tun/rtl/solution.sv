module TopModule(input wire [0:0] clk, input wire [0:0] areset, input wire [0:0] predict_valid, input wire [0:0] predict_taken, input wire [0:0] train_mispredicted, input wire [0:0] train_taken, input wire [31:0] train_history, output wire [31:0] predict_history);
assign predict_history = '0;
endmodule
