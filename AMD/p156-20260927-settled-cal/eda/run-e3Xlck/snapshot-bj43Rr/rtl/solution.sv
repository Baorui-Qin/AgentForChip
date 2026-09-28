
module CalibrationReference (
  input clk,
  input load,
  input [1:0] ena,
  input [99:0] data,
  output reg [99:0] q
);

  always @(posedge clk) begin
    if (load)
      q <= data;
    else if (ena == 2'h1)
      q <= {q[0], q[99:1]};
    else if (ena == 2'h2)
      q <= {q[98:0], q[99]};
  end

endmodule


module TopModule(input wire clk,input wire load,input wire [1:0] ena,input wire [99:0] data,output wire [99:0] q);
wire [99:0] cal_q;
CalibrationReference control(.clk(clk),.load(load),.ena(ena),.data(data),.q(cal_q));
assign q=~cal_q;
endmodule
