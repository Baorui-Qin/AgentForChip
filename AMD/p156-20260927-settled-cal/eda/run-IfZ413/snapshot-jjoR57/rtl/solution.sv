
module CalibrationReference (
  input clk,
  input resetn,
  input in,
  output out
);

  reg [3:0] sr;
  always @(posedge clk) begin
    if (~resetn)
      sr <= '0;
    else
      sr <= {sr[2:0], in};
  end

  assign out = sr[3];

endmodule


module TopModule(input wire clk,input wire resetn,input wire in,output wire out);
wire cal_out;
CalibrationReference control(.clk(clk),.resetn(resetn),.in(in),.out(cal_out));
assign out=~cal_out;
endmodule
