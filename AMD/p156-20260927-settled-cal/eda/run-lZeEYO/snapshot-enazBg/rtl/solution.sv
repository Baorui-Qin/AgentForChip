
module CalibrationReference (
  input clk,
  input x,
  output z
);

  reg [2:0] s = 0;

  always @(posedge clk) begin
    s <= { s[2] ^ x, ~s[1] & x, ~s[0] | x };
  end

  assign z = ~|s;

endmodule


module TopModule(input wire clk,input wire x,output wire z);
wire cal_z;
CalibrationReference control(.clk(clk),.x(x),.z(cal_z));
assign z=~cal_z;
endmodule
