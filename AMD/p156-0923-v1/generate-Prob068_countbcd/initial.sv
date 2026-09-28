
module TopModule (
    input  logic clk,
    input  logic reset,
    output logic [3:1] ena,
    output logic [15:0] q
);

    logic [3:0] ones, tens, hundreds, thousands;
    assign ones = q[3:0];
    assign tens = q[7:4];
    assign hundreds = q[11:8];
    assign thousands = q[15:12];

    assign ena[1] = (ones == 4'd9);
    assign ena[2] = (ones == 4'd9) && (tens == 4'd9);
    assign ena[3] = (ones == 4'd9) && (tens == 4'd9) && (hundreds == 4'd9);

    always_ff @(posedge clk) begin
        if (reset) begin
            q <= 16'd0;
        end else begin
            if (ones == 4'd9)
                q[3:0] <= 4'd0;
            else
                q[3:0] <= ones + 4'd1;

            if (ena[1]) begin
                if (tens == 4'd9)
                    q[7:4] <= 4'd0;
                else
                    q[7:4] <= tens + 4'd1;
            end

            if (ena[2]) begin
                if (hundreds == 4'd9)
                    q[11:8] <= 4'd0;
                else
                    q[11:8] <= hundreds + 4'd1;
            end

            if (ena[3]) begin
                if (thousands == 4'd9)
                    q[15:12] <= 4'd0;
                else
                    q[15:12] <= thousands + 4'd1;
            end
        end
    end

endmodule
