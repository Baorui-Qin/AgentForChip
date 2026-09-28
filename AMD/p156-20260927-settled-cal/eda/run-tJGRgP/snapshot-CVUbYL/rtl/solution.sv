
module CalibrationReference (
  input x3,
  input x2,
  input x1,
  output f
);

  assign f = ( ~x3 & x2 & ~x1 ) |
        ( ~x3 & x2 & x1 ) |
        ( x3 & ~x2 & x1 ) |
        ( x3 & x2 & x1 ) ;

endmodule


module TopModule(input wire x3,input wire x2,input wire x1,output wire f);
wire cal_f;
CalibrationReference control(.x3(x3),.x2(x2),.x1(x1),.f(cal_f));
assign f=~cal_f;
endmodule
