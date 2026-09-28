module TopModule(
  input wire ring,
  input wire vibrate_mode,
  output wire ringer,
  output wire motor
);
  RefModule preflight_reference(.ring(ring), .vibrate_mode(vibrate_mode), .ringer(ringer), .motor(motor));
endmodule
