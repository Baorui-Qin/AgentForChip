module rising_edge(
  input  logic clk,
  input  logic rst,
  input  logic din,
  output logic pulse
);

  logic previous;

  always_ff @(posedge clk) begin
    if (rst) begin
      previous <= 1'b0;
      pulse    <= 1'b0;
    end else begin
      pulse    <= din & ~previous;
      previous <= din;
    end
  end

endmodule
