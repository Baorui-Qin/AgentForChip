
module TopModule (
    input c,
    input d,
    output [3:0] mux_in
);
    // K-map: rows cd, columns ab
    // mux_in[0] = ab=00 column: cd=00->0, 01->1, 11->1, 10->1  => c | d
    // mux_in[1] = ab=01 column: all 0
    // mux_in[2] = ab=11 column: cd=00->0, 01->0, 11->1, 10->0  => c & d
    // mux_in[3] = ab=10 column: cd=00->1, 01->0, 11->1, 10->1  => c | ~d
    assign mux_in[0] = c | d;
    assign mux_in[1] = 1'b0;
    assign mux_in[2] = c & d;
    assign mux_in[3] = c | ~d;
endmodule
