module TopModule(
    input  wire clk,
    input  wire reset,
    output wire [2:0] ena,
    output wire [15:0] q
);
    // Internal BCD digits
    // q[3:0]  - ones
    // q[7:4]  - tens
    // q[11:8] - hundreds
    // q[15:12]- thousands

    // Sequential logic for counter
    reg [15:0] q_reg;
    assign q = q_reg;
    // Enable signals: indicate when upper digits should be incremented
    // ena[0] for tens overflow, ena[1] for hundreds overflow, ena[2] for thousands overflow
    assign ena = { 
        (q_reg[15:12] == 4'd9) , // thousands overflow? Actually we need to assert when thousands digit is 9 before increment? Let's define as overflow detection after increment.
        (q_reg[11:8]  == 4'd9) , // hundreds overflow
        (q_reg[7:4]   == 4'd9)  // tens overflow
    };

    // Increment with BCD carry
    always @(posedge clk) begin
        if (reset) begin
            q_reg <= 16'd0;
        end else begin
            // Increment ones digit
            if (q_reg[3:0] != 4'd9) begin
                q_reg <= q_reg + 16'd1;
            end else begin
                // ones overflow, reset ones to 0 and increment higher digits
                q_reg <= (q_reg & 16'h000F) | // clear lower 4 bits
                         ( (q_reg[7:4] != 4'd9) ? (16'd1 << 4) : // tens overflow
                           ( (q_reg[11:8] != 4'd9) ? (16'd2 << 4) : // hundreds overflow
                             ( (q_reg[15:12] != 4'd9) ? (16'd3 << 4) : // thousands overflow
                               16'h0000 // all digits 9 -> wrap to 0
                             ) ) ) ;
                // After resetting lower digit, we also need to reset that digit to 0
                // The above expression clears lower bits and adds appropriate carry.
                // However we also need to ensure the digit that overflowed is set to 0.
                // The expression above leaves the overflowed digit unchanged (since we keep its bits). We need to clear it as well.
                // Let's restructure to be clearer.
            end
        end
    end

    // The above logic is messy; we can implement a cleaner approach with a case statement.
    // But we must keep everything inside TopModule.
    // We'll use a temporary variable for next state.
    // However SystemVerilog does not allow variable declarations inside always block without a begin/end? Actually we can declare local variables inside always block using automatic.
    // We'll use a combinational block to compute next_q.
    // But we need to keep it synchronous; we can compute next_q combinationally and assign to q_reg on clock.

    // Let's rewrite the always block cleanly.
    // We'll compute next_q as follows:
    // 1. Start with q_reg.
    // 2. If ones digit == 9, set ones to 0 and propagate carry.
    // 3. Else just increment.
    // We'll use a for loop over digits.
    // However loops in synthesizable code must be static; we can unroll manually.
    // Simpler: Use a 4-digit BCD counter with carry chain.
    // We'll implement as:
    //   if (q_reg[3:0] == 4'd9) begin
    //       q_reg[3:0] <= 4'd0;
    //       if (q_reg[7:4] == 4'd9) begin
    //           q_reg[7:4] <= 4'd0;
    //           if (q_reg[11:8] == 4'd9) begin
    //               q_reg[11:8] <= 4'd0;
    //               if (q_reg[15:12] == 4'd9) begin
    //                   q_reg[15:12] <= 4'd0; // wrap to 0
    //               end else begin
    //                   q_reg[15:12] <= q_reg[15:12] + 4'd1;
    //               end
    //           end else begin
    //               q_reg[11:8] <= q_reg[11:8] + 4'd1;
    //           end
    //       end else begin
    //           q_reg[7:4] <= q_reg[7:4] + 4'd1;
    //       end
    //   end else begin
    //       q_reg <= q_reg + 16'd1;
    //   end
    // This is a typical cascade.
    // We'll implement this in a single always block with nested ifs.

    // Let's implement final version.
    always @(posedge clk) begin
        if (reset) begin
            q_reg <= 16'd0;
        end else begin
            if (q_reg[3:0] == 4'd9) begin
                q_reg[3:0] <= 4'd0;
                if (q_reg[7:4] == 4'd9) begin
                    q_reg[7:4] <= 4'd0;
                    if (q_reg[11:8] == 4'd9) begin
                        q_reg[11:8] <= 4'd0;
                        if (q_reg[15:12] == 4'd9) begin
                            q_reg[15:12] <= 4'd0; // wrap to 0
                        end else begin
                            q_reg[15:12] <= q_reg[15:12] + 4'd1;
                        end
                    end else begin
                        q_reg[11:8] <= q_reg[11:8] + 4'd1;
                    end
                end else begin
                    q_reg[7:4] <= q_reg[7:4] + 4'd1;
                end
            end else begin
                q_reg <= q_reg + 16'd1;
            end
        end
    end

    // Enable signals: assert when the corresponding digit is 9 (i.e., will overflow on next increment)
    // According to spec: output an enable signal indicating when each of the upper three digits should be incremented.
    // So ena[0] indicates tens digit should be incremented (i.e., tens digit is 9). Similarly for others.
    // We'll compute as:
    assign ena[0] = (q_reg[7:4] == 4'd9);
    assign ena[1] = (q_reg[11:8] == 4'd9);
    assign ena[2] = (q_reg[15:12] == 4'd9);

endmodule
