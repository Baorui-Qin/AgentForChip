
module CalibrationReference (
  input clk,
  input areset,
  input train_valid,
  input train_taken,
  output logic [1:0] state
);

  always @(posedge clk, posedge areset) begin
    if (areset)
      state <= 1;
    else if (train_valid) begin
      if(state < 3 && train_taken)
        state <= state + 1;
      else if(state > 0 && !train_taken)
        state <= state - 1;
    end
  end

endmodule


module TopModule(input wire clk,input wire areset,input wire train_valid,input wire train_taken,output wire [1:0] state);
wire [1:0] cal_state;
CalibrationReference control(.clk(clk),.areset(areset),.train_valid(train_valid),.train_taken(train_taken),.state(cal_state));
assign state=~cal_state;
endmodule
