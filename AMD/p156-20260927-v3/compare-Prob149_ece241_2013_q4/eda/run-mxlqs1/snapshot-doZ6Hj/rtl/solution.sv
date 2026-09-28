module TopModule(
    input  logic clk,
    input  logic reset,
    input  logic [2:0] s,
    output logic fr2,
    output logic fr1,
    output logic fr0,
    output logic dfr
);

    // Water-level state: 0 = below s[0], 1 = between s[0]/s[1],
    //                    2 = between s[1]/s[2], 3 = above s[2]
    logic [1:0] level;
    logic       dfr_reg;
    logic [1:0] next_level;

    // Decode sensor pattern into the water level (highest asserted sensor wins)
    always_comb begin
        if (s[2])
            next_level = 2'd3;
        else if (s[1])
            next_level = 2'd2;
        else if (s[0])
            next_level = 2'd1;
        else
            next_level = 2'd0;
    end

    always_ff @(posedge clk) begin
        if (reset) begin
            level   <= 2'd0;   // low for a long time
            dfr_reg <= 1'b1;   // supplemental valve open
        end else begin
            level <= next_level;
            if (next_level == level)
                dfr_reg <= dfr_reg;                    // no sensor change: hold
            else
                dfr_reg <= (next_level > level);       // opened if level rose
        end
    end

    always_comb begin
        fr2 = (level == 2'd0);   // nominal fr2: only below s[0]
        fr1 = (level <= 2'd1);   // nominal fr1: below s[1]
        fr0 = (level <= 2'd2);   // nominal fr0: below s[2]
        dfr = dfr_reg;           // supplemental (direction of last change)
    end

endmodule
