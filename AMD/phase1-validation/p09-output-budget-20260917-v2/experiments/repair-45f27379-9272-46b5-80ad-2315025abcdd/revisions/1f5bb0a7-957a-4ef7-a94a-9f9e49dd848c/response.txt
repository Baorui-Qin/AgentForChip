module ready_valid_slot(
  input  logic       clk,
  input  logic       rst,
  input  logic       in_valid,
  input  logic [7:0] in_data,
  output logic       in_ready,
  output logic       out_valid,
  output logic [7:0] out_data,
  input  logic       out_ready
);

  logic       full;
  logic [7:0] data;

  assign in_ready = ~full | out_ready;
  assign out_valid = full;
  assign out_data  = data;

  always_ff @(posedge clk) begin
    if (rst) begin
      full <= 1'b0;
      data <= 8'h00;
    end else if (in_valid && in_ready) begin
      // Accept (covers simultaneous consume/accept replacement)
      data <= in_data;
      full <= 1'b1;
    end else if (out_valid && out_ready) begin
      // Consume only, no replacement
      full <= 1'b0;
    end
  end

endmodule
