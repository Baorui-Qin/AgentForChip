
module CalibrationReference (
  input clk,
  input resetn,
  input [1:0] byteena,
  input [15:0] d,
  output reg [15:0] q
);

  always @(posedge clk) begin
    if (!resetn)
      q <= 0;
    else begin
      if (byteena[0])
        q[7:0] <= d[7:0];
      if (byteena[1])
        q[15:8] <= d[15:8];
    end
  end

endmodule


module TopModule(input wire clk,input wire resetn,input wire [1:0] byteena,input wire [15:0] d,output wire [15:0] q);
wire [15:0] cal_q;
CalibrationReference control(.clk(clk),.resetn(resetn),.byteena(byteena),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
