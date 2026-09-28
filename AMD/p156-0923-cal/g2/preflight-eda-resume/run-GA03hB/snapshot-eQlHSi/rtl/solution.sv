module TopModule(input wire [0:0] d, input wire [0:0] done_counting, input wire [0:0] ack, input wire [9:0] state, output wire [0:0] B3_next, output wire [0:0] S_next, output wire [0:0] S1_next, output wire [0:0] Count_next, output wire [0:0] Wait_next, output wire [0:0] done, output wire [0:0] counting, output wire [0:0] shift_ena);
assign B3_next = '0;
assign S_next = '0;
assign S1_next = '0;
assign Count_next = '0;
assign Wait_next = '0;
assign done = '0;
assign counting = '0;
assign shift_ena = '0;
endmodule
