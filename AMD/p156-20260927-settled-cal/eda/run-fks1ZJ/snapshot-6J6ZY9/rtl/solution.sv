
module CalibrationReference (
  input clk,
  input d,
  input r,
  output logic q
);

  always@(posedge clk) begin
    if (r)
      q <= 0;
    else
      q <= d;
  end

endmodule


module TopModule(input wire clk,input wire d,input wire r,output wire q);
wire cal_q;
CalibrationReference control(.clk(clk),.d(d),.r(r),.q(cal_q));
assign q=~cal_q;
endmodule
