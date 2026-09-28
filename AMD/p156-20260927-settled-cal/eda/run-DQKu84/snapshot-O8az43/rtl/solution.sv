
module CalibrationReference (
  input clk,
  input enable,
  input S,
  input A,
  input B,
  input C,
  output reg Z
);

  reg [7:0] q;
  always @(posedge clk) begin
    if (enable)
      q <= {q[6:0], S};
  end

  assign Z = q[ {A, B, C} ];

endmodule


module TopModule(input wire clk,input wire enable,input wire S,input wire A,input wire B,input wire C,output wire Z);
wire cal_Z;
CalibrationReference control(.clk(clk),.enable(enable),.S(S),.A(A),.B(B),.C(C),.Z(cal_Z));
assign Z=~cal_Z;
endmodule
