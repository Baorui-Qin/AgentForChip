module counter(input logic clk, input logic rst, output wire [3:0] count);
typedef struct packed { logic [3:0] count; } state_t;
state_t state;
bit enabled;
always_comb enabled = 1'b1;
always_ff @(posedge clk) if (rst) state.count <= 0; else if (enabled) state.count <= state.count + 1'b1;
assign count = state.count;
endmodule
