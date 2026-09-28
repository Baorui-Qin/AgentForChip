
module CalibrationReference (
  input clk,
  input areset,
  input bump_left,
  input bump_right,
  input ground,
  output walk_left,
  output walk_right,
  output aaah
);

  parameter WL=0, WR=1, FALLL=2, FALLR=3;
  reg [1:0] state;
  reg [1:0] next;

  always_comb begin
    case (state)
      WL: next = ground ? (bump_left ? WR : WL) : FALLL;
      WR: next = ground ? (bump_right ? WL: WR) : FALLR;
      FALLL: next = ground ? WL : FALLL;
      FALLR: next = ground ? WR : FALLR;
    endcase
  end

  always @(posedge clk, posedge areset) begin
    if (areset) state <= WL;
      else state <= next;
  end

  assign walk_left = (state==WL);
  assign walk_right = (state==WR);
  assign aaah = (state == FALLL) || (state == FALLR);

endmodule


module TopModule(input wire clk,input wire areset,input wire bump_left,input wire bump_right,input wire ground,output wire walk_left,output wire walk_right,output wire aaah);
wire cal_walk_left;
wire cal_walk_right;
wire cal_aaah;
CalibrationReference control(.clk(clk),.areset(areset),.bump_left(bump_left),.bump_right(bump_right),.ground(ground),.walk_left(cal_walk_left),.walk_right(cal_walk_right),.aaah(cal_aaah));
assign walk_left=~cal_walk_left;
assign walk_right=~cal_walk_right;
assign aaah=~cal_aaah;
endmodule
