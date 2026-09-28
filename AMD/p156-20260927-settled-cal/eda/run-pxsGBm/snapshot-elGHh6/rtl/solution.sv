
module CalibrationReference (
  input in,
  input [3:0] state,
  output reg [3:0] next_state,
  output out
);

  parameter A=0, B=1, C=2, D=3;

  assign next_state[A] = (state[A] | state[C]) & ~in;
  assign next_state[B] = (state[A] | state[B] | state[D]) & in;
  assign next_state[C] = (state[B] | state[D]) & ~in;
  assign next_state[D] = state[C] & in;

  assign out = (state[D]);

endmodule


module TopModule(input wire in,input wire [3:0] state,output wire [3:0] next_state,output wire out);
wire [3:0] cal_next_state;
wire cal_out;
CalibrationReference control(.in(in),.state(state),.next_state(cal_next_state),.out(cal_out));
assign next_state=~cal_next_state;
assign out=~cal_out;
endmodule
