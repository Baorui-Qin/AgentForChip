
module CalibrationReference (
  input clk,
  input slowena,
  input reset,
  output reg [3:0] q
);

  always @(posedge clk)
    if (reset)
      q <= 0;
    else if (slowena) begin
      if (q == 9)
        q <= 0;
      else
        q <= q+1;
    end

endmodule


module TopModule(input wire clk,input wire reset,input wire slowena,output wire [3:0] q);
wire [3:0] cal_q;
CalibrationReference control(.clk(clk),.reset(reset),.slowena(slowena),.q(cal_q));
assign q=~cal_q;
endmodule
