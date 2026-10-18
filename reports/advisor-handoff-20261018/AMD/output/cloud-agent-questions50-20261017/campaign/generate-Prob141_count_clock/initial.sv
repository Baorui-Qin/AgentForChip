module TopModule(
    input  wire clk,
    input  wire reset,
    input  wire ena,
    output wire pm,
    output wire [7:0] hh,
    output wire [7:0] mm,
    output wire [7:0] ss
);
    // BCD counters
    reg [3:0] sec0;
    reg [3:0] sec1;
    reg [3:0] min0;
    reg [3:0] min1;
    reg [3:0] hour0;
    reg [3:0] hour1;
    reg       pm_reg;

    // Convert BCD digits to 8-bit outputs
    assign ss = {sec1, sec0};
    assign mm = {min1, min0};
    assign hh = {hour1, hour0};
    assign pm = pm_reg;

    // Increment logic
    always @(posedge clk) begin
        if (reset) begin
            // Reset to 12:00 AM
            sec0 <= 0;
            sec1 <= 0;
            min0 <= 0;
            min1 <= 0;
            hour0 <= 2; // BCD 2 (0-9) for "12" hour digit 1 = 1? Actually 12 => hour0=1, hour1=2
            hour1 <= 2;
            pm_reg <= 0;
        end else if (ena) begin
            // Seconds
            if (sec1 == 5 && sec0 == 9) begin
                sec0 <= 0;
                sec1 <= 0;
                // Minutes
                if (min1 == 5 && min0 == 9) begin
                    min0 <= 0;
                    min1 <= 0;
                    // Hours
                    if (hour1 == 2 && hour0 == 0) begin
                        // 12 -> roll to 12 again? Actually after 12 -> 12 AM/PM toggle
                        hour0 <= 1; // 1 for "1"
                        hour1 <= 2; // 2 for "2"
                        pm_reg <= ~pm_reg;
                    end else if (hour1 == 0 && hour0 == 9) begin
                        // 09 -> roll to 10
                        hour0 <= 0;
                        hour1 <= 1;
                        pm_reg <= pm_reg;
                    end else if (hour1 == 1 && hour0 == 9) begin
                        // 19 is invalid; should be 10 -> 19 never occurs
                        // Actually after 09 -> 10, after 19 -> 20 invalid
                        // We'll handle normal BCD: after 09 -> 10, after 12 -> 1
                        // So after 09 we set hour0=0, hour1=1
                        // After 12 we already handled
                        // After 19 (invalid) we should not be here
                        // So we just wrap at 09->10, 12->1
                        // No action needed else
                    end else if (hour1 == 2 && hour0 == 3) begin
                        // 23 invalid; should not happen
                    end else begin
                        // Normal increment
                        hour0 <= hour0 + 1;
                        // hour1 unchanged
                    end
                end else begin
                    min0 <= min0 + 1;
                end
            end else begin
                sec0 <= sec0 + 1;
            end
        end
    end
endmodule