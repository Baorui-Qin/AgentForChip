
module CalibrationReference (
  input clk,
  input areset,
  input predict_valid,
  input predict_taken,
  output logic [31:0] predict_history,

  input train_mispredicted,
  input train_taken,
  input [31:0] train_history
);

  always@(posedge clk, posedge areset)
    if (areset) begin
      predict_history = 0;
        end  else begin
      if (train_mispredicted)
        predict_history <= {train_history, train_taken};
      else if (predict_valid)
        predict_history <= {predict_history, predict_taken};
    end

endmodule


module TopModule(input wire clk,input wire areset,input wire predict_valid,input wire predict_taken,input wire train_mispredicted,input wire train_taken,input wire [31:0] train_history,output wire [31:0] predict_history);
wire [31:0] cal_predict_history;
CalibrationReference control(.clk(clk),.areset(areset),.predict_valid(predict_valid),.predict_taken(predict_taken),.train_mispredicted(train_mispredicted),.train_taken(train_taken),.train_history(train_history),.predict_history(cal_predict_history));
assign predict_history=~cal_predict_history;
endmodule
