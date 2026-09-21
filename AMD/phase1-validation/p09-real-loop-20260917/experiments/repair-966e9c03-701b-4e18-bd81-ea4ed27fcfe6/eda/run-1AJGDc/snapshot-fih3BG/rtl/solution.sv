module sequence_101(input clk, rst, din, output reg hit);
reg [1:0] history,valid;
always @(posedge clk) if(rst) begin history<=0; valid<=0; hit<=0; end else begin hit<=valid[1] && history==2'b10 && din; history<={history[0],din}; valid<={valid[0],1'b1}; end
endmodule
