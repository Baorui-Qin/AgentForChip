
module CalibrationReference (
  input a,
  input b,
  input cin,
  output cout,
  output sum
);

  assign {cout, sum} = a+b+cin;

endmodule


module TopModule(input wire a,input wire b,input wire cin,output wire cout,output wire sum);
wire cal_cout;
wire cal_sum;
CalibrationReference control(.a(a),.b(b),.cin(cin),.cout(cal_cout),.sum(cal_sum));
assign cout=~cal_cout;
assign sum=~cal_sum;
endmodule
