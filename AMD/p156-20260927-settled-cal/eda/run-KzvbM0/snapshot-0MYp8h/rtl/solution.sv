
module CalibrationReference (
  input d,
  input done_counting,
  input ack,
  input [9:0] state, // 10-bit one-hot current state
  output B3_next,
  output S_next,
  output S1_next,
  output Count_next,
  output Wait_next,
  output done,
  output counting,
  output shift_ena
);

  parameter S=0, S1=1, S11=2, S110=3, B0=4, B1=5, B2=6, B3=7, Count=8, Wait=9;

  assign B3_next = state[B2];
  assign S_next = state[S]&~d | state[S1]&~d | state[S110]&~d | state[Wait]&ack;
  assign S1_next = state[S]&d;
  assign Count_next = state[B3] | state[Count]&~done_counting;
  assign Wait_next = state[Count]&done_counting | state[Wait]&~ack;

  assign done = state[Wait];
  assign counting = state[Count];
  assign shift_ena = |state[B3:B0];

endmodule


module TopModule(input wire d,input wire done_counting,input wire ack,input wire [9:0] state,output wire B3_next,output wire S_next,output wire S1_next,output wire Count_next,output wire Wait_next,output wire done,output wire counting,output wire shift_ena);
wire cal_B3_next;
wire cal_S_next;
wire cal_S1_next;
wire cal_Count_next;
wire cal_Wait_next;
wire cal_done;
wire cal_counting;
wire cal_shift_ena;
CalibrationReference control(.d(d),.done_counting(done_counting),.ack(ack),.state(state),.B3_next(cal_B3_next),.S_next(cal_S_next),.S1_next(cal_S1_next),.Count_next(cal_Count_next),.Wait_next(cal_Wait_next),.done(cal_done),.counting(cal_counting),.shift_ena(cal_shift_ena));
assign B3_next=~cal_B3_next;
assign S_next=~cal_S_next;
assign S1_next=~cal_S1_next;
assign Count_next=~cal_Count_next;
assign Wait_next=~cal_Wait_next;
assign done=~cal_done;
assign counting=~cal_counting;
assign shift_ena=~cal_shift_ena;
endmodule
