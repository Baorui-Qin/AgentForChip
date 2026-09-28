
module TopModule (
    input clk,
    input reset,
    input [2:0] s,
    output reg fr2,
    output reg fr1,
    output reg fr0,
    output reg dfr
);

    reg [2:0] prev;

    always @(posedge clk) begin
        if (reset) begin
            prev <= 3'b000;
        end else begin
            prev <= s;
        end
    end

    always @(*) begin
        case (s)
            3'b111: begin
                fr2 = 1'b0;
                fr1 = 1'b0;
                fr0 = 1'b0;
                dfr = 1'b0;
            end
            3'b011: begin
                fr2 = 1'b0;
                fr1 = 1'b0;
                fr0 = 1'b1;
                dfr = (prev < s) ? 1'b1 : 1'b0;
            end
            3'b001: begin
                fr2 = 1'b0;
                fr1 = 1'b1;
                fr0 = 1'b1;
                dfr = (prev < s) ? 1'b1 : 1'b0;
            end
            3'b000: begin
                fr2 = 1'b1;
                fr1 = 1'b1;
                fr0 = 1'b1;
                dfr = 1'b1;
            end
            default: begin
                fr2 = 1'b0;
                fr1 = 1'b0;
                fr0 = 1'b0;
                dfr = 1'b1;
            end
        endcase
    end

endmodule
