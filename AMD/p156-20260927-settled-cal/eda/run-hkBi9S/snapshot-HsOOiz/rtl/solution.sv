
module CalibrationReference (
  input clk,
  input areset,
  input bump_left,
  input bump_right,
  input ground,
  input dig,
  output walk_left,
  output walk_right,
  output aaah,
  output digging
);

  parameter WL=0, WR=1, FALLL=2, FALLR=3, DIGL=4, DIGR=5;
  reg [2:0] state;
  reg [2:0] next;

  always_comb begin
    case (state)
      WL: if (!ground) next = FALLL;
        else if (dig) next = DIGL;
        else if (bump_left) next = WR;
        else next = WL;
      WR:
        if (!ground) next = FALLR;
        else if (dig) next = DIGR;
        else if (bump_right) next = WL;
        else next = WR;
      FALLL: next = ground ? WL : FALLL;
      FALLR: next = ground ? WR : FALLR;
      DIGL: next = ground ? DIGL : FALLL;
      DIGR: next = ground ? DIGR : FALLR;
    endcase
  end

  always @(posedge clk, posedge areset) begin
    if (areset) state <= WL;
      else state <= next;
  end

  assign walk_left = (state==WL);
  assign walk_right = (state==WR);
  assign aaah = (state == FALLL) || (state == FALLR);
  assign digging = (state == DIGL) || (state == DIGR);

endmodule


module TopModule(input wire clk,input wire areset,input wire bump_left,input wire bump_right,input wire ground,input wire dig,output wire walk_left,output wire walk_right,output wire aaah,output wire digging);
wire cal_walk_left;
wire cal_walk_right;
wire cal_aaah;
wire cal_digging;
CalibrationReference control(.clk(clk),.areset(areset),.bump_left(bump_left),.bump_right(bump_right),.ground(ground),.dig(dig),.walk_left(cal_walk_left),.walk_right(cal_walk_right),.aaah(cal_aaah),.digging(cal_digging));
assign walk_left=~cal_walk_left;
assign walk_right=~cal_walk_right;
assign aaah=~cal_aaah;
assign digging=~cal_digging;
endmodule
