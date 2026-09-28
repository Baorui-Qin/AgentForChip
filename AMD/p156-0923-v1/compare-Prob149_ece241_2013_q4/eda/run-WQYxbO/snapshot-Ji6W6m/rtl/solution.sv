module TopModule (
    input  clk,
    input  reset,
    input  [2:0] s,
    output reg fr2,
    output reg fr1,
    output reg fr0,
    output reg dfr
);

    // Registered water level (0 = below s[0], 1 = between s[1] and s[0],
    // 2 = between s[2] and s[1], 3 = above s[2]).
    reg [1:0] state;
    reg [1:0] next;

    // Decode the sensor pattern into the current water level.
    always @(*) begin
        case (s)
            3'b000: next = 2'd0;
            3'b001: next = 2'd1;
            3'b011: next = 2'd2;
            3'b111: next = 2'd3;
            default: next = 2'd0;
        endcase
    end

    // Synchronous, active-high reset forces the "long time low" state.
    always @(posedge clk) begin
        if (reset)
            state <= 2'd0;
        else
            state <= next;
    end

    // Outputs are a function of the registered level. The supplemental
    // valve (dfr) opens when the new level is higher than the stored level
    // (rising water).
    always @(*) begin
        fr2 = 1'b0;
        fr1 = 1'b0;
        fr0 = 1'b0;
        dfr = 1'b0;
        case (state)
            2'd0: begin
                fr2 = 1'b1;
                fr1 = 1'b1;
                fr0 = 1'b1;
                dfr = 1'b1;
            end
            2'd1: begin
                fr2 = 1'b0;
                fr1 = 1'b1;
                fr0 = 1'b1;
                dfr = (next > state);
            end
            2'd2: begin
                fr2 = 1'b0;
                fr1 = 1'b0;
                fr0 = 1'b1;
                dfr = (next > state);
            end
            default: begin
                fr2 = 1'b0;
                fr1 = 1'b0;
                fr0 = 1'b0;
                dfr = 1'b0;
            end
        endcase
    end

endmodule
