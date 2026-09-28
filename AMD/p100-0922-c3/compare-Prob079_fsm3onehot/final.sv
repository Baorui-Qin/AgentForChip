
module TopModule (
    input  logic in,
    input  logic [3:0] state,
    output logic [3:0] next_state,
    output logic out
);

    // One-hot encoding:
    // A = 0001, B = 0010, C = 0100, D = 1000
    // state[0]=A, state[1]=B, state[2]=C, state[3]=D

    assign next_state[0] = ~in & (state[0] | state[2]);          // next A
    assign next_state[1] =  in & (state[0] | state[1] | state[3]); // next B
    assign next_state[2] = ~in & (state[1] | state[3]);          // next C
    assign next_state[3] =  in & state[2];                       // next D

    assign out = state[3]; // Moore output is 1 only in state D

endmodule
