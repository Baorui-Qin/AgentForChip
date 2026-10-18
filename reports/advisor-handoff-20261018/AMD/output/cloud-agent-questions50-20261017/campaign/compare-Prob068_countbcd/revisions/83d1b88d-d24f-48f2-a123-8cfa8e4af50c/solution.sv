module TopModule(
    input  wire clk,
    input  wire reset,
    output wire [2:0] ena,
    output wire [15:0] q
);
    // BCD digits: [15:12] thousands, [11:8] hundreds, [7:4] tens, [3:0] ones
    reg [15:0] q_reg;
    assign q = q_reg;
    // Enable signals: high when the corresponding digit is 9 (will overflow on next increment)
    assign ena = {
        (q_reg[15:12] == 4'd9), // thousands overflow indicator
        (q_reg[11:8]  == 4'd9), // hundreds overflow indicator
        (q_reg[7:4]   == 4'd9)  // tens overflow indicator
    };

    // Synchronous BCD counter with proper carry propagation
    always @(posedge clk) begin
        if (reset) begin
            q_reg <= 16'd0;
        end else begin
            // Check ones digit
            if (q_reg[3:0] == 4'd9) begin
                q_reg[3:0] <= 4'd0;
                // Tens digit overflow? Propagate
                if (q_reg[7:4] == 4'd9) begin
                    q_reg[7:4] <= 4'd0;
                    // Hundreds digit overflow? Propagate
                    if (q_reg[11:8] == 4'd9) begin
                        q_reg[11:8] <= 4'd0;
                        // Thousands digit overflow? Wrap to zero or increment
                        if (q_reg[15:12] == 4'd9) begin
                            q_reg[15:12] <= 4'd0;
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
                // Normal increment when ones digit not 9
                q_reg <= q_reg + 16'd1;
            end
        end
    end

endmodule