
module CalibrationReference (
  input [2:0] vec,
  output [2:0] outv,
  output o2,
  output o1,
  output o0
);

  assign outv = vec;
  assign {o2, o1, o0} = vec;

endmodule


module TopModule(input wire [2:0] vec,output wire [2:0] outv,output wire o2,output wire o1,output wire o0);
wire [2:0] cal_outv;
wire cal_o2;
wire cal_o1;
wire cal_o0;
CalibrationReference control(.vec(vec),.outv(cal_outv),.o2(cal_o2),.o1(cal_o1),.o0(cal_o0));
assign outv=~cal_outv;
assign o2=~cal_o2;
assign o1=~cal_o1;
assign o0=~cal_o0;
endmodule
