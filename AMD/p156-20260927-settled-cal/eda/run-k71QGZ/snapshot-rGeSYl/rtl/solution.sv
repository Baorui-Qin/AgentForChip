
module CalibrationReference (
  input clk,
  input j,
  input k,
  output reg Q
);

  always @(posedge clk)
    Q <= j&~Q | ~k&Q;

endmodule


module TopModule(input wire clk,input wire j,input wire k,output wire Q);
wire cal_Q;
CalibrationReference control(.clk(clk),.j(j),.k(k),.Q(cal_Q));
assign Q=~cal_Q;
endmodule
