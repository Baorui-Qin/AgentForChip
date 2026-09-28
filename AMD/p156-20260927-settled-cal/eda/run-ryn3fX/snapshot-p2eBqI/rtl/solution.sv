
module CalibrationReference (
  input clk,
  input [7:0] in,
  output reg [7:0] anyedge
);

  reg [7:0] d_last;

  always @(posedge clk) begin
    d_last <= in;
    anyedge <= in ^ d_last;
  end

endmodule


module TopModule(input wire clk,input wire [7:0] in,output wire [7:0] anyedge);
wire [7:0] cal_anyedge;
CalibrationReference control(.clk(clk),.in(in),.anyedge(cal_anyedge));
assign anyedge=~cal_anyedge;
endmodule
