module signed_saturating_add (
    input  logic              clk,
    input  logic              rst,
    input  logic signed [7:0] a,
    input  logic signed [7:0] b,
    output logic signed [7:0] sum
);

    logic signed [8:0] extended;

    always_comb extended = a + b;

    always_ff @(posedge clk) begin
        if (rst) begin
            sum <= 8'sd0;
        end else if (extended > 9'sd127) begin
            sum <= 8'sd127;
        end else if (extended < -9'sd128) begin
            sum <= -8'sd128;
        end else begin
            sum <= extended[7:0];
        end
    end

endmodule
