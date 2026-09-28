module TopModule (
    input  clk,
    input  reset,
    input  s,
    input  w,
    output z
);

    localparam A = 1'b0,
               B = 1'b1;

    reg       state, next_state;
    reg [1:0] cyc;    // position within the 3-cycle window in state B
    reg [1:0] ones;   // number of w=1 seen so far in the window

    // Next-state logic: A waits for s=1, B repeats.
    always @(*) begin
        case (state)
            A:       next_state = s ? B : A;
            B:       next_state = B;
            default: next_state = A;
        endcase
    end

    // Sequential logic (synchronous, active-high reset).
    always @(posedge clk) begin
        if (reset) begin
            state <= A;
            cyc   <= 2'd0;
            ones  <= 2'd0;
        end else begin
            state <= next_state;
            if (state == B) begin
                cyc  <= (cyc == 2'd2) ? 2'd0 : cyc + 2'd1;
                ones <= (cyc == 2'd0) ? {1'b0, w} : ones + {1'b0, w};
            end else begin
                cyc  <= 2'd0;
                ones <= 2'd0;
            end
        end
    end

    // Output in the cycle following each completed 3-cycle window.
    // During that cycle cyc==0 and 'ones' still holds the previous total.
    assign z = (state == B) && (cyc == 2'd0) && (ones == 2'd2);

endmodule
