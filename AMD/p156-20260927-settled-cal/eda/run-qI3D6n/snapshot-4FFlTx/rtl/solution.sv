
module CalibrationReference (
  input a,
  input b,
  output sum,
  output cout
);

  assign {cout, sum} = a+b;

endmodule


module TopModule(input wire a,input wire b,output wire sum,output wire cout);
wire cal_sum;
wire cal_cout;
CalibrationReference control(.a(a),.b(b),.sum(cal_sum),.cout(cal_cout));
assign sum=~cal_sum;
assign cout=~cal_cout;
endmodule
