module signed_saturating_add(
    input  logic               clk,
    input  logic               rst,
    input  logic signed [7:0]  a,
    input  logic signed [7:0]  b,
    output logic signed [7:0]  sum
);

    wire signed [8:0] sum_ext = {a[7], a} + {b[7], b};

    always @(posedge clk) begin
        if (rst)
            sum <= 8'sd0;
        else if (sum_ext > 9'sd127)
            sum <= 8'sd127;
        else if (sum_ext < -9'sd128)
            sum <= -8'sd128;
        else
            sum <= sum_ext[7:0];
    end

endmodule
