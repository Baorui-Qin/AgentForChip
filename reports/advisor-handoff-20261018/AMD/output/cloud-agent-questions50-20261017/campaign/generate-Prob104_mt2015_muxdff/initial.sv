module TopModule(
    input  clk,
    input  L,
    input  q_in,
    input  r_in,
    output Q
);
    // internal register to hold the flip-flop state
    reg q;
    always @(posedge clk) begin
        if (L)
            q <= r_in;
        else
            q <= {q_in[1] ^ q_in[2], q_in[0], q_in[2]};
    end
    assign Q = q;
endmodule