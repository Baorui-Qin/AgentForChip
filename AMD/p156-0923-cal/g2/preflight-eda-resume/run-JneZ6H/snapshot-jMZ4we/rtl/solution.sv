module TopModule(input wire [0:0] clk, input wire [0:0] reset, input wire [0:0] data, input wire [0:0] done_counting, input wire [0:0] ack, output wire [0:0] shift_ena, output wire [0:0] counting, output wire [0:0] done);
assign shift_ena = '0;
assign counting = '0;
assign done = '0;
endmodule
