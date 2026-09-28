
module CalibrationReference (
  output out
);

  assign out = 1'b0;

endmodule


module TopModule(output wire out);
wire cal_out;
CalibrationReference control(.out(cal_out));
assign out=~cal_out;
endmodule
