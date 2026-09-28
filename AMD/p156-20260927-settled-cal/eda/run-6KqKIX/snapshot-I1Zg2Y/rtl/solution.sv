
module CalibrationReference (
  input clk,
  input L,
  input q_in,
  input r_in,
  output reg Q
);

  initial Q=0;
  always @(posedge clk)
    Q <= L ? r_in : q_in;

endmodule


module TopModule(input wire clk,input wire L,input wire q_in,input wire r_in,output wire Q);
wire cal_Q;
CalibrationReference control(.clk(clk),.L(L),.q_in(q_in),.r_in(r_in),.Q(cal_Q));
assign Q=~cal_Q;
endmodule
