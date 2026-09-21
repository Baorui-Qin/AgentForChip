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

  assign in_ready  = ~occupied | out_ready;
  assign out_valid = occupied;
  assign out_data  = stored;

  assign accept  = in_valid & in_ready;
  assign consume = occupied & out_ready;

  always_ff @(posedge clk) begin
    if (rst) begin
      occupied <= 1'b0;
      stored   <= 8'h00;
    end else begin
      if (accept) begin
        stored   <= in_data;
        occupied <= 1'b1;
      end else if (consume) begin
        occupied <= 1'b0;
      end
    end
  end

endmodule
