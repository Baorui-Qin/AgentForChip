
module CalibrationReference (
  input a,
  input b,
  output out_and,
  output out_or,
  output out_xor,
  output out_nand,
  output out_nor,
  output out_xnor,
  output out_anotb
);

  assign out_and = a&b;
  assign out_or = a|b;
  assign out_xor = a^b;
  assign out_nand = ~(a&b);
  assign out_nor = ~(a|b);
  assign out_xnor = a^~b;
  assign out_anotb = a & ~b;

endmodule


module TopModule(input wire a,input wire b,output wire out_and,output wire out_or,output wire out_xor,output wire out_nand,output wire out_nor,output wire out_xnor,output wire out_anotb);
wire cal_out_and;
wire cal_out_or;
wire cal_out_xor;
wire cal_out_nand;
wire cal_out_nor;
wire cal_out_xnor;
wire cal_out_anotb;
CalibrationReference control(.a(a),.b(b),.out_and(cal_out_and),.out_or(cal_out_or),.out_xor(cal_out_xor),.out_nand(cal_out_nand),.out_nor(cal_out_nor),.out_xnor(cal_out_xnor),.out_anotb(cal_out_anotb));
assign out_and=~cal_out_and;
assign out_or=~cal_out_or;
assign out_xor=~cal_out_xor;
assign out_nand=~cal_out_nand;
assign out_nor=~cal_out_nor;
assign out_xnor=~cal_out_xnor;
assign out_anotb=~cal_out_anotb;
endmodule
