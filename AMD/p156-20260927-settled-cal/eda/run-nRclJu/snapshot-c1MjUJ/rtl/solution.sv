
module CalibrationReference (
  input clk,
  input reset,
  input ena,
  output reg pm,
  output reg [7:0] hh,
  output reg [7:0] mm,
  output reg [7:0] ss
);

  wire [6:0] enable = {
    {hh[7:0],mm[7:0],ss[7:0]}==24'h115959,
    {hh[3:0],mm[7:0],ss[7:0]}==20'h95959,
    {mm[7:0],ss[7:0]}==16'h5959,
    {mm[3:0],ss[7:0]}==12'h959,
    ss[7:0]==8'h59,
    ss[3:0] == 4'h9,
    1'b1};

  always @(posedge clk)
    if (reset)
      {pm,hh,mm,ss} <= 25'h0120000;
    else if (ena) begin
      if (enable[0] && ss[3:0] == 9) ss[3:0] <= 0;
      else if (enable[0]) ss[3:0] <= ss[3:0] + 1;

      if (enable[1] && ss[7:4] == 4'h5) ss[7:4] <= 0;
      else if (enable[1]) ss[7:4] <= ss[7:4] + 1;

      if (enable[2] && mm[3:0] == 9) mm[3:0] <= 0;
      else if (enable[2]) mm[3:0] <= mm[3:0] + 1;

      if (enable[3] && mm[7:4] == 4'h5) mm[7:4] <= 0;
      else if (enable[3]) mm[7:4] <= mm[7:4] + 1;

      if (enable[4] && hh[3:0] == 4'h9) hh[3:0] <= 0;
      else if (enable[4]) hh[3:0] <= hh[3:0] + 1;

      if (enable[4] && hh[7:0] == 8'h12) hh[7:0] <= 8'h1;
      else if (enable[5]) hh[7:4] <= hh[7:4] + 1;

      if (enable[6]) pm <= ~pm;
    end

endmodule


module TopModule(input wire clk,input wire reset,input wire ena,output wire pm,output wire [7:0] hh,output wire [7:0] mm,output wire [7:0] ss);
wire cal_pm;
wire [7:0] cal_hh;
wire [7:0] cal_mm;
wire [7:0] cal_ss;
CalibrationReference control(.clk(clk),.reset(reset),.ena(ena),.pm(cal_pm),.hh(cal_hh),.mm(cal_mm),.ss(cal_ss));
assign pm=~cal_pm;
assign hh=~cal_hh;
assign mm=~cal_mm;
assign ss=~cal_ss;
endmodule
