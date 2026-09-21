module ready_valid_slot(
    input  wire       clk,
    input  wire       rst,
    input  wire       in_valid,
    input  wire [7:0] in_data,
    output wire       in_ready,
    output wire       out_valid,
    output wire [7:0] out_data,
    input  wire       out_ready
);

    reg       occupied;
    reg [7:0] stored;

    wire accept  = in_valid  & in_ready;
    wire consume = out_valid & out_ready;

    assign in_ready  = ~occupied | out_ready;
    assign out_valid = occupied;
    assign out_data  = stored;

    always @(posedge clk) begin
        if (rst) begin
            occupied <= 1'b0;
            stored   <= 8'h00;
        end else begin
            if (accept) begin
                occupied <= 1'b1;
                stored   <= in_data;
            end else if (consume) begin
                occupied <= 1'b0;
            end
        end
    end

endmodule
