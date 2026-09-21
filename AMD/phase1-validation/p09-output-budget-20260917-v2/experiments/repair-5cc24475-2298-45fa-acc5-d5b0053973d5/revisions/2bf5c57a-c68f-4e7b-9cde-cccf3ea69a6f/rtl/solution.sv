module sequence_101(input clk, rst, din, output reg hit);
  // history[1] = sample two cycles ago, history[0] = sample one cycle ago
  reg [1:0] history;
  // valid[1] high once at least two prior non-reset samples have been consumed
  reg [1:0] valid;

  always @(posedge clk) begin
    if (rst) begin
      history <= 2'b00;
      valid   <= 2'b00;
      hit     <= 1'b0;
    end else begin
      // last three samples are 101  =>  history == 2'b10 (1 then 0) and din == 1
      hit     <= valid[1] && (history == 2'b10) && din;
      history <= {history[0], din};
      valid   <= {valid[0], 1'b1};
    end
  end
endmodule
