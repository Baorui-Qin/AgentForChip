module TopModule(input wire [0:0] mode, input wire [0:0] too_cold, input wire [0:0] too_hot, input wire [0:0] fan_on, output wire [0:0] heater, output wire [0:0] aircon, output wire [0:0] fan);
assign heater = '0;
assign aircon = '0;
assign fan = '0;
endmodule
