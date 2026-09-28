
module CalibrationReference (
  input mode,
  input too_cold,
  input too_hot,
  input fan_on,
  output heater,
  output aircon,
  output fan
);

  assign fan = (mode ? too_cold : too_hot) | fan_on;
  assign heater = (mode & too_cold);
  assign aircon = (~mode & too_hot);

endmodule


module TopModule(input wire mode,input wire too_cold,input wire too_hot,input wire fan_on,output wire heater,output wire aircon,output wire fan);
wire cal_heater;
wire cal_aircon;
wire cal_fan;
CalibrationReference control(.mode(mode),.too_cold(too_cold),.too_hot(too_hot),.fan_on(fan_on),.heater(cal_heater),.aircon(cal_aircon),.fan(cal_fan));
assign heater=~cal_heater;
assign aircon=~cal_aircon;
assign fan=~cal_fan;
endmodule
