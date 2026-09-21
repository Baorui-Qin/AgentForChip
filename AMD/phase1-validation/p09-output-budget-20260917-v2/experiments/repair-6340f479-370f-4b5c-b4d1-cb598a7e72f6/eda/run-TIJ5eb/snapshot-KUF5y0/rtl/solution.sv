module sequence_101(
  input  wire clk,
  input  wire rst,
  input  wire din,
  output reg  hit
);
  reg [1:0] hist;

  // Last three consumed samples are {hist[1], hist[0], din}.
  // Hit when they equal 1,0,1.
  wire detect = (hist == 2'b10) & din;

  always @(posedge clk) begin
    if (rst) begin
      hist <= 2'b00;
      hit  <= 1'b0;
    end else begin
      hist <= {hist[0], din};
      hit  <= detect;
    end
  end
endmodule
