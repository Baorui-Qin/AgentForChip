
module CalibrationReference (
  output one
);

  assign one = 1'b1;

endmodule


module TopModule(output wire one);
wire cal_one;
CalibrationReference control(.one(cal_one));
assign one=~cal_one;
endmodule
