module TopModule(
    input  clk,
    input  reset,
    output reg [4:0] q
);
    // Galois LFSR with taps at positions 5 (MSB) and 3 (bit index 3 -> q[3])
    // Feedback bit = q[4] ^ q[2]
    // Shift right, inserting feedback into q[4]
    always @(posedge clk) begin
        if (reset) begin
            q <= 5'b00001; // load 1 at LSB per spec
        end else begin
            // Compute feedback before shifting
            // feedback = q[4] ^ q[2]
            q <= { (q[4] ^ q[2]), q[4:1] };
        end
    end
endmodule