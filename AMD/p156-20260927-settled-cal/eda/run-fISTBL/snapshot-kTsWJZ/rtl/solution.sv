
module CalibrationReference (
  input clk,
  input load,
  input [9:0] data,
  output tc
);

  logic [9:0] count_value;

  always @(posedge clk)
    if(load) count_value <= data;
    else if(count_value != 0) count_value <= count_value - 1;

  assign tc = count_value == 0;

endmodule


module TopModule(input wire clk,input wire load,input wire [9:0] data,output wire tc);
wire cal_tc;
CalibrationReference control(.clk(clk),.load(load),.data(data),.tc(cal_tc));
assign tc=~cal_tc;
endmodule
