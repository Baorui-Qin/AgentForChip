
module CalibrationReference (
  input c,
  input d,
  output [3:0] mux_in
);

  assign mux_in[0] = c | d;
  assign mux_in[1] = 0;
  assign mux_in[2] = ~d;
  assign mux_in[3] = c&d;

endmodule


module TopModule(input wire c,input wire d,output wire [3:0] mux_in);
wire [3:0] cal_mux_in;
CalibrationReference control(.c(c),.d(d),.mux_in(cal_mux_in));
assign mux_in=~cal_mux_in;
endmodule
