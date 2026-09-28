
module CalibrationReference (
  input d,
  input ena,
  output logic q
);

  always@(*) begin
    if (ena)
      q = d;
  end

endmodule


module TopModule(input wire d,input wire ena,output wire q);
wire cal_q;
CalibrationReference control(.d(d),.ena(ena),.q(cal_q));
assign q=~cal_q;
endmodule
