
module CalibrationReference (
  input clk,
  input load,
  input ena,
  input [1:0] amount,
  input [63:0] data,
  output reg [63:0] q
);

  always @(posedge clk) begin
    if (load)
      q <= data;
    else if (ena) case (amount)
      2'b00: q <= {q[62:0], 1'b0};
      2'b01: q <= {q[55:0], 8'b0};
      2'b10: q <= {q[63], q[63:1]};
      2'b11: q <= {{8{q[63]}}, q[63:8]};
      default: q <= 64'hx;
    endcase
  end

endmodule


module TopModule(input wire clk,input wire load,input wire ena,input wire [1:0] amount,input wire [63:0] data,output wire [63:0] q);
wire [63:0] cal_q;
CalibrationReference control(.clk(clk),.load(load),.ena(ena),.amount(amount),.data(data),.q(cal_q));
assign q=~cal_q;
endmodule
