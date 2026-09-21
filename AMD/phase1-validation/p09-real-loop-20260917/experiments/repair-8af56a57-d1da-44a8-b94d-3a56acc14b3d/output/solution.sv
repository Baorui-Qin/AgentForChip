module sequence_101(input clk, rst, din, output reg hit);
  reg prev1, prev2;
  reg [1:0] cnt;
  always @(posedge clk) begin
    if (rst) begin
      prev1 <= 1'b0;
      prev2 <= 1'b0;
      cnt   <= 2'd0;
      hit   <= 1'b0;
    end else begin
      hit   <= (cnt == 2'd2) && din && ~prev1 && prev2;
      prev2 <= prev1;
      prev1 <= din;
      if (cnt != 2'd2)
        cnt <= cnt + 2'd1;
    end
  end
endmodule
