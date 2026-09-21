module signed_saturating_add(
  input  logic              clk,
  input  logic              rst,
  input  logic signed [7:0] a,
  input  logic signed [7:0] b,
  output logic signed [7:0] sum
);

  logic signed [8:0] extended;

  always_comb extended = a + b;

  always_ff @(posedge clk) begin
    if (rst)
      sum <= 8'sd0;
    else if (extended > 9'sd127)
      sum <= 8'sd127;
    else if (extended < -9'sd128)
      sum <= -8'sd128;
    else
      sum <= extended[7:0];
  end

endmodule
