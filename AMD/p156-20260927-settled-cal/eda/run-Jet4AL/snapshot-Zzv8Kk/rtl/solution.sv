
module CalibrationReference (
  input [4:0] a,
  input [4:0] b,
  input [4:0] c,
  input [4:0] d,
  input [4:0] e,
  input [4:0] f,
  output [7:0] w,
  output [7:0] x,
  output [7:0] y,
  output [7:0] z
);

  assign { w,x,y,z} = {a,b,c,d,e,f,2'b11};

endmodule


module TopModule(input wire [4:0] a,input wire [4:0] b,input wire [4:0] c,input wire [4:0] d,input wire [4:0] e,input wire [4:0] f,output wire [7:0] w,output wire [7:0] x,output wire [7:0] y,output wire [7:0] z);
wire [7:0] cal_w;
wire [7:0] cal_x;
wire [7:0] cal_y;
wire [7:0] cal_z;
CalibrationReference control(.a(a),.b(b),.c(c),.d(d),.e(e),.f(f),.w(cal_w),.x(cal_x),.y(cal_y),.z(cal_z));
assign w=~cal_w;
assign x=~cal_x;
assign y=~cal_y;
assign z=~cal_z;
endmodule
