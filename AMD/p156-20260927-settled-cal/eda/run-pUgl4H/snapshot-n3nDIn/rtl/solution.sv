
module CalibrationReference (
  input clk,
  input areset,

  input predict_valid,
  input [6:0] predict_pc,
  output predict_taken,
  output [6:0] predict_history,

  input train_valid,
  input train_taken,
  input train_mispredicted,
  input [6:0] train_history,
  input [6:0] train_pc
);

  parameter n = 7;
  logic [1:0] pht [2**n-1:0];

  parameter [1:0] SNT = 0, LNT = 1, LT = 2, ST = 3;

  logic [n-1:0] predict_history_r;
  wire [n-1:0] predict_index = predict_history_r ^ predict_pc;
  wire [n-1:0] train_index = train_history ^ train_pc;

  always@(posedge clk, posedge areset)
    if (areset) begin
      for (integer i=0; i<2**n; i=i+1)
        pht[i] = LNT;
      predict_history_r = 0;
        end  else begin
      if (predict_valid)
        predict_history_r <= {predict_history_r, predict_taken};
      if(train_valid) begin
        if(pht[train_index] < 3 && train_taken)
          pht[train_index] <= pht[train_index] + 1;
        else if(pht[train_index] > 0 && !train_taken)
          pht[train_index] <= pht[train_index] - 1;
        if (train_mispredicted)
          predict_history_r <= {train_history, train_taken};
      end
    end

  assign predict_taken = predict_valid ? pht[predict_index][1] : 1'bx;
  assign predict_history = predict_valid ? predict_history_r : {n{1'bx}};

endmodule


module TopModule(input wire clk,input wire areset,input wire predict_valid,input wire [6:0] predict_pc,output wire predict_taken,output wire [6:0] predict_history,input wire train_valid,input wire train_taken,input wire train_mispredicted,input wire [6:0] train_history,input wire [6:0] train_pc);
wire cal_predict_taken;
wire [6:0] cal_predict_history;
CalibrationReference control(.clk(clk),.areset(areset),.predict_valid(predict_valid),.predict_pc(predict_pc),.predict_taken(cal_predict_taken),.predict_history(cal_predict_history),.train_valid(train_valid),.train_taken(train_taken),.train_mispredicted(train_mispredicted),.train_history(train_history),.train_pc(train_pc));
assign predict_taken=~cal_predict_taken;
assign predict_history=~cal_predict_history;
endmodule
