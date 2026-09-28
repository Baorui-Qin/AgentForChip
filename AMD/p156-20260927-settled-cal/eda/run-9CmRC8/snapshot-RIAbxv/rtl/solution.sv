
module CalibrationReference (
  input clk,
  input [7:0] in,
  output reg [7:0] pedge
);

  reg [7:0] d_last;

  always @(posedge clk) begin
    d_last <= in;
    pedge <= in & ~d_last;
  end

endmodule


module TopModule(input wire clk,input wire [7:0] in,output wire [7:0] pedge);
wire [7:0] cal_pedge;
CalibrationReference control(.clk(clk),.in(in),.pedge(cal_pedge));
assign pedge=~cal_pedge;
endmodule
