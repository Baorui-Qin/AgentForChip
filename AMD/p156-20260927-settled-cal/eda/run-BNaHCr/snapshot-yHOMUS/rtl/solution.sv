
module CalibrationReference (
  input clk,
  input reset,
  input [31:0] in,
  output reg [31:0] out
);

  reg [31:0] d_last;

  always @(posedge clk) begin
    d_last <= in;
    if (reset)
      out <= '0;
    else
      out <= out | (~in & d_last);
  end

endmodule


module TopModule(input wire clk,input wire reset,input wire [31:0] in,output wire [31:0] out);
wire [31:0] cal_out;
CalibrationReference control(.clk(clk),.reset(reset),.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
