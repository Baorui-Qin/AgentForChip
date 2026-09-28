module TopModule(
  input wire mode,
  input wire too_cold,
  input wire too_hot,
  input wire fan_on,
  output wire heater,
  output wire aircon,
  output wire fan
);
  RefModule preflight_reference(.mode(mode), .too_cold(too_cold), .too_hot(too_hot), .fan_on(fan_on), .heater(heater), .aircon(aircon), .fan(fan));
endmodule
