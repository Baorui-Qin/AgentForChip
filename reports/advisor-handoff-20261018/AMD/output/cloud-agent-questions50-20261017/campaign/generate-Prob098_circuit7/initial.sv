module TopModule(
    input  clk,
    input  a,
    output reg q
);
    // Simple D-type flip-flop with enable (a) on the positive edge of clk.
    // q updates to a when a is high; otherwise q holds its value.
    // No reset is required per specification.
    always_ff @(posedge clk) begin
        if (a)
            q <= 1'b1; // a is high, set q to 1 (since a==1)
        // else hold q (implicit)
    end
endmodule