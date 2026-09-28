
module CalibrationReference (
  input in,
  input [9:0] state,
  output [9:0] next_state,
  output out1,
  output out2
);

  assign out1 = state[8] | state[9];
  assign out2 = state[7] | state[9];

  assign next_state[0] = !in && (|state[4:0] | state[7] | state[8] | state[9]);
  assign next_state[1] = in && (state[0] | state[8] | state[9]);
  assign next_state[2] = in && state[1];
  assign next_state[3] = in && state[2];
  assign next_state[4] = in && state[3];
  assign next_state[5] = in && state[4];
  assign next_state[6] = in && state[5];
  assign next_state[7] = in && (state[6] | state[7]);
  assign next_state[8] = !in && state[5];
  assign next_state[9] = !in && state[6];

endmodule


module TopModule(input wire in,input wire [9:0] state,output wire [9:0] next_state,output wire out1,output wire out2);
wire [9:0] cal_next_state;
wire cal_out1;
wire cal_out2;
CalibrationReference control(.in(in),.state(state),.next_state(cal_next_state),.out1(cal_out1),.out2(cal_out2));
assign next_state=~cal_next_state;
assign out1=~cal_out1;
assign out2=~cal_out2;
endmodule
