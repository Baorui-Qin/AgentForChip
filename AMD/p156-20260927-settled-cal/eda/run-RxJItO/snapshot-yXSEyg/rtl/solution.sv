
module CalibrationReference (
  input clk,
  input areset,
  input load,
  input ena,
  input [3:0] data,
  output reg [3:0] q
);

  always @(posedge clk, posedge areset) begin
    if (areset)
      q <= 0;
    else if (load)
      q <= data;
    else if (ena)
      q <= q[3:1];
  end

endmodule


module TopModule(input wire clk,input wire areset,input wire load,input wire ena,input wire [3:0] data,output wire [3:0] q);
wire [3:0] cal_q;
CalibrationReference control(.clk(clk),.areset(areset),.load(load),.ena(ena),.data(data),.q(cal_q));
assign q=~cal_q;
endmodule
