
module CalibrationReference (
  output zero
);

  assign zero = 1'b0;

endmodule


module TopModule(output wire zero);
wire cal_zero;
CalibrationReference control(.zero(cal_zero));
assign zero=~cal_zero;
endmodule
