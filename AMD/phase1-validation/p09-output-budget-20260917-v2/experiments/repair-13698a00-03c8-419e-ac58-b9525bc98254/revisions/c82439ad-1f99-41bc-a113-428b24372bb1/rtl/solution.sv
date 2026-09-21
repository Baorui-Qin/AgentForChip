module sequence_101(
    input  clk,
    input  rst,
    input  din,
    output reg hit
);
    reg [1:0] history;  // history[1] = older sample, history[0] = newer sample
    reg [1:0] valid;    // valid[1] indicates two prior samples have been consumed

    always @(posedge clk) begin
        if (rst) begin
            history <= 2'b00;
            valid   <= 2'b00;
            hit     <= 1'b0;
        end else begin
            // High in the resulting cycle exactly when the last three
            // non-reset samples are 1,0,1 (older=1, newer=0, new din=1).
            hit     <= valid[1] && (history == 2'b10) && din;
            history <= {history[0], din};
            valid   <= {valid[0], 1'b1};
        end
    end
endmodule
