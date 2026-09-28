
module CalibrationReference (
  input clk,
  input areset,
  input bump_left,
  input bump_right,
  output walk_left,
  output walk_right
);

  parameter WL=0, WR=1;
  reg state;
  reg next;

  always_comb begin
    case (state)
      WL: next = bump_left ? WR : WL;
      WR: next = bump_right ? WL: WR;
    endcase
  end

  always @(posedge clk, posedge areset) begin
    if (areset) state <= WL;
      else state <= next;
  end

  assign walk_left = (state==WL);
  assign walk_right = (state==WR);

endmodule


module TopModule(input wire clk,input wire areset,input wire bump_left,input wire bump_right,output wire walk_left,output wire walk_right);
wire cal_walk_left;
wire cal_walk_right;
CalibrationReference control(.clk(clk),.areset(areset),.bump_left(bump_left),.bump_right(bump_right),.walk_left(cal_walk_left),.walk_right(cal_walk_right));
assign walk_left=~cal_walk_left;
assign walk_right=~cal_walk_right;
endmodule
