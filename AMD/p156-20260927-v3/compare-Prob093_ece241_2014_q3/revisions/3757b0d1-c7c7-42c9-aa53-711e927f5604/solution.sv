module TopModule (
    input c,
    input d,
    output [3:0] mux_in
);
    // K-map rows indexed by cd, columns by ab.
    // mux_in[0] = value at ab=00 for each cd
    //   cd=00 -> 0, cd=01 -> 1, cd=11 -> 1, cd=10 -> 1
    assign mux_in[0] = c | d;
    // mux_in[1] = value at ab=01: all 0
    assign mux_in[1] = 1'b0;
    // mux_in[2] = value at ab=11: cd=00->0, 01->0, 11->1, 10->0
    assign mux_in[2] = c & d;
    // mux_in[3] = value at ab=10: cd=00->1, 01->0, 11->1, 10->1
    assign mux_in[3] = c | ~d;
endmodule
