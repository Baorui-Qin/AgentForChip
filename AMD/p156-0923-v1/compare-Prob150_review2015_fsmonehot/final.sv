module TopModule (
    input  wire       d,
    input  wire       done_counting,
    input  wire       ack,
    input  wire [9:0] state,
    output wire       B3_next,
    output wire       S_next,
    output wire       S1_next,
    output wire       Count_next,
    output wire       Wait_next,
    output wire       done,
    output wire       counting,
    output wire       shift_ena
);

    // One-hot encoding:
    // state[0]=S, [1]=S1, [2]=S11, [3]=S110, [4]=B0,
    // [5]=B1, [6]=B2, [7]=B3, [8]=Count, [9]=Wait

    // Next-state logic (including self-loop terms for the flagged outputs)
    assign S_next     = (state[0] & ~d) | (state[1] & ~d) | (state[3] & ~d) | (state[9] & ack);
    assign S1_next    = (state[0] & d);
    assign B3_next    = state[6];
    assign Count_next = state[7] | (state[8] & ~done_counting);
    assign Wait_next  = (state[8] & done_counting) | (state[9] & ~ack);

    // Output logic (Moore)
    assign shift_ena  = state[4] | state[5] | state[6] | state[7];
    assign counting   = state[8];
    assign done       = state[9];

endmodule
