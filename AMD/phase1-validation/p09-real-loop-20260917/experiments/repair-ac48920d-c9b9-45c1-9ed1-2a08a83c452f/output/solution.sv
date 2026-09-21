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

  logic       occupied;
  logic [7:0] stored;
  logic       accept;
  logic       consume;

  // A slot can accept whenever it is empty or the output is being drained.
  assign in_ready  = ~occupied | out_ready;
  assign out_valid = occupied;
  assign out_data  = stored;

  assign accept  = in_valid  & in_ready;
  assign consume = out_valid & out_ready;

  always_ff @(posedge clk) begin
    if (rst) begin
      occupied <= 1'b0;
      stored   <= 8'h00;
    end else begin
      if (accept)
        stored <= in_data;
      // Accept fills the slot; a simultaneous consume keeps it filled.
      occupied <= accept | (occupied & ~consume);
    end
  end

endmodule
