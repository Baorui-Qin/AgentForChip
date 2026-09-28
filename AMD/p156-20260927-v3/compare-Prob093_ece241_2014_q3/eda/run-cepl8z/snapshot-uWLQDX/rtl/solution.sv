module TopModule (
    input c,
    input d,
    output [3:0] mux_in
);
    // K-map columns selected by {a,b}:
    //   ab=00 -> mux_in[0], ab=01 -> mux_in[1], ab=11 -> mux_in[2], ab=10 -> mux_in[3]
    // Column ab=00: c|d
    // Column ab=01: 0
    // Column ab=11: c&d
    // Column ab=10: c|~d
    assign mux_in[0] = c | d;
    assign mux_in[1] = 1'b0;
    assign mux_in[2] = c & d;
    assign mux_in[3] = c | ~d;
endmodule
