
module CalibrationReference (
  input clk,
  input shift_ena,
  input count_ena,
  input data,
  output reg [3:0] q
);

  always @(posedge clk) begin
    if (shift_ena)
      q <= { q[2:0], data };
    else if (count_ena)
      q <= q - 1'b1;
  end

endmodule


module TopModule(input wire clk,input wire shift_ena,input wire count_ena,input wire data,output wire [3:0] q);
wire [3:0] cal_q;
CalibrationReference control(.clk(clk),.shift_ena(shift_ena),.count_ena(count_ena),.data(data),.q(cal_q));
assign q=~cal_q;
endmodule
