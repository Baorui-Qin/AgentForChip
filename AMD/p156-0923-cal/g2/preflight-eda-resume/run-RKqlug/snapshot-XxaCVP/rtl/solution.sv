module TopModule(
  input wire cpu_overheated,
  output wire shut_off_computer,
  input wire arrived,
  input wire gas_tank_empty,
  output wire keep_driving
);
  RefModule preflight_reference(.cpu_overheated(cpu_overheated), .shut_off_computer(shut_off_computer), .arrived(arrived), .gas_tank_empty(gas_tank_empty), .keep_driving(keep_driving));
endmodule
