module TopModule (
    input c,
    input d,
    output [3:0] mux_in
);
    // K-map columns selected by ab:
    // ab=00 -> mux_in[0], ab=01 -> mux_in[1], ab=11 -> mux_in[2], ab=10 -> mux_in[3]
    // cd rows: {00,01,11,10}
    assign mux_in[0] = c | d;     // {0,1,1,1}
    assign mux_in[1] = 1'b0;      // {0,0,0,0}
    assign mux_in[2] = c & d;     // {0,0,1,0}
    assign mux_in[3] = c | ~d;    // {1,0,1,1}
endmodule
