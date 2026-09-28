
module CalibrationReference (
  input [3:0] x,
  output logic f
);

  always_comb begin
    case (x)
      4'h0: f = 1'bx;
      4'h1: f = 1'bx;
      4'h2: f = 0;
      4'h3: f = 1'bx;
      4'h4: f = 1;
      4'h5: f = 1'bx;
      4'h6: f = 1;
      4'h7: f = 0;
      4'h8: f = 0;
      4'h9: f = 0;
      4'ha: f = 1'bx;
      4'hb: f = 1;
      4'hc: f = 1;
      4'hd: f = 1'bx;
      4'he: f = 1;
      4'hf: f = 1'bx;
    endcase
  end

endmodule


module TopModule(input wire [3:0] x,output wire f);
wire cal_f;
CalibrationReference control(.x(x),.f(cal_f));
assign f=~cal_f;
endmodule
