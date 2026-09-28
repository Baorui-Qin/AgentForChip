
module CalibrationReference (
  input ring,
  input vibrate_mode,
  output ringer,
  output motor
);

  assign ringer = ring & ~vibrate_mode;
  assign motor = ring & vibrate_mode;

endmodule


module TopModule(input wire ring,input wire vibrate_mode,output wire ringer,output wire motor);
wire cal_ringer;
wire cal_motor;
CalibrationReference control(.ring(ring),.vibrate_mode(vibrate_mode),.ringer(cal_ringer),.motor(cal_motor));
assign ringer=~cal_ringer;
assign motor=~cal_motor;
endmodule
