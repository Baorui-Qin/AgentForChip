module TopModule (
    input c,
    input d,
    output [3:0] mux_in
);
    // mux_in[i] for ab = 00, 01, 11, 10 (K-map column order)
    // Each output is realized with a 2-to-1 multiplexer (no other gates).
    assign mux_in[0] = d ? 1'b1 : c;    // c | d
    assign mux_in[1] = 1'b0;            // constant 0
    assign mux_in[2] = c ? d : 1'b0;    // c & d
    assign mux_in[3] = d ? c : 1'b1;    // c | ~d
endmodule
