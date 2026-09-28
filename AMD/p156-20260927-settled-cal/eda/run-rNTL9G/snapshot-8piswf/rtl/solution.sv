
module CalibrationReference (
  input clk,
  input d,
  input ar,
  output logic q
);

  always@(posedge clk or posedge ar) begin
    if (ar)
      q <= 0;
    else
      q <= d;
  end

endmodule


module TopModule(input wire clk,input wire ar,input wire d,output wire q);
wire cal_q;
CalibrationReference control(.clk(clk),.ar(ar),.d(d),.q(cal_q));
assign q=~cal_q;
endmodule
