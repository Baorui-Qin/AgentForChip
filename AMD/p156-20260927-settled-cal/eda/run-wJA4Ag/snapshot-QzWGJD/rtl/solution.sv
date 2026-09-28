
module CalibrationReference (
  input cpu_overheated,
  output reg shut_off_computer,
  input arrived,
  input gas_tank_empty,
  output reg keep_driving
);

  always @(*) begin
    if (cpu_overheated)
      shut_off_computer = 1;
    else
      shut_off_computer = 0;
  end

  always @(*) begin
    if (~arrived)
      keep_driving = !gas_tank_empty;
    else
      keep_driving = 1'b0;
  end

endmodule


module TopModule(input wire cpu_overheated,output wire shut_off_computer,input wire arrived,input wire gas_tank_empty,output wire keep_driving);
wire cal_shut_off_computer;
wire cal_keep_driving;
CalibrationReference control(.cpu_overheated(cpu_overheated),.shut_off_computer(cal_shut_off_computer),.arrived(arrived),.gas_tank_empty(gas_tank_empty),.keep_driving(cal_keep_driving));
assign shut_off_computer=~cal_shut_off_computer;
assign keep_driving=~cal_keep_driving;
endmodule
