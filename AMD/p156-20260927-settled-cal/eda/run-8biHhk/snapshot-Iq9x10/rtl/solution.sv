
module CalibrationReference (
  input do_sub,
  input [7:0] a,
  input [7:0] b,
  output reg [7:0] out,
  output reg result_is_zero
);

  always @(*) begin
    case (do_sub)
      0: out = a + b;
      1: out = a - b;
    endcase
    result_is_zero = (out == 0);
  end

endmodule


module TopModule(input wire do_sub,input wire [7:0] a,input wire [7:0] b,output wire [7:0] out,output wire result_is_zero);
wire [7:0] cal_out;
wire cal_result_is_zero;
CalibrationReference control(.do_sub(do_sub),.a(a),.b(b),.out(cal_out),.result_is_zero(cal_result_is_zero));
assign out=~cal_out;
assign result_is_zero=~cal_result_is_zero;
endmodule
