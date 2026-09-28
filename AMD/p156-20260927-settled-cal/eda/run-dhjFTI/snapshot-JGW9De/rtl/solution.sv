
module CalibrationReference (
  input [2:0] a,
  output reg [15:0] q
);

  always @(*)
    case (a)
      0: q = 4658;
      1: q = 44768;
      2: q = 10196;
      3: q = 23054;
      4: q = 8294;
      5: q = 25806;
      6: q = 50470;
      7: q = 12057;
    endcase

endmodule


module TopModule(input wire [2:0] a,output wire [15:0] q);
wire [15:0] cal_q;
CalibrationReference control(.a(a),.q(cal_q));
assign q=~cal_q;
endmodule
