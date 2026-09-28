module TopModule(input wire [0:0] cpu_overheated, output wire [0:0] shut_off_computer, input wire [0:0] arrived, input wire [0:0] gas_tank_empty, output wire [0:0] keep_driving);
assign shut_off_computer = '0;
assign keep_driving = '0;
endmodule
