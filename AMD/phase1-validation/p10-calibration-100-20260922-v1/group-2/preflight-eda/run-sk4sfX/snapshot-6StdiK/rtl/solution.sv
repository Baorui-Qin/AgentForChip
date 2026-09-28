module TopModule(input wire [0:0] clk, input wire [0:0] areset, input wire [0:0] bump_left, input wire [0:0] bump_right, input wire [0:0] ground, input wire [0:0] dig, output wire [0:0] walk_left, output wire [0:0] walk_right, output wire [0:0] aaah, output wire [0:0] digging);
assign walk_left = '0;
assign walk_right = '0;
assign aaah = '0;
assign digging = '0;
endmodule
