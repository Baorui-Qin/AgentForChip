module TopModule(
  input  logic       clk,
  input  logic       reset,
  input  logic       load,
  input  logic [7:0] data,
  output logic [7:0] q
);

  always_ff @(posedge clk) begin
    if (reset)
      q <= 8'h01;
    else if (load)
      q <= data;
    else
      q <= {q[6:0], q[7] ^ q[5] ^ q[4] ^ q[3]};
  end

endmodule
