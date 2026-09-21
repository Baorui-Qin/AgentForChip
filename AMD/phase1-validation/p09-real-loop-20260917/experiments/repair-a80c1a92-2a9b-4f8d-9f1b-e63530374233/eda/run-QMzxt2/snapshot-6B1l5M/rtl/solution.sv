module ready_valid_slot(input clk,rst,in_valid,input [7:0] in_data,output in_ready,output out_valid,output [7:0] out_data,input out_ready);
reg full; reg [7:0] data;
assign in_ready=~full|out_ready; assign out_valid=full; assign out_data=data;
always @(posedge clk) if(rst) begin full<=0; data<=0; end else if(in_ready) begin full<=in_valid; if(in_valid) data<=in_data; end
endmodule
