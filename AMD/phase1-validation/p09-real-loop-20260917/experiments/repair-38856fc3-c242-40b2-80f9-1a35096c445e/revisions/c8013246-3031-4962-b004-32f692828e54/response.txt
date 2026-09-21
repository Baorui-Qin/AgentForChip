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

    // Ready when the slot is empty, or when a simultaneous
    // consume/accept replacement can occur.
    assign in_ready = ~full | out_ready;

    assign out_valid = full;
    assign out_data  = data;

    always_ff @(posedge clk) begin
        if (rst) begin
            full <= 1'b0;
            data <= 8'h00;
        end else begin
            if (in_valid && in_ready) begin
                // Accept (and possibly replace consumed byte) without a bubble.
                full <= 1'b1;
                data <= in_data;
            end else if (out_valid && out_ready) begin
                // Consume only: slot becomes empty.
                full <= 1'b0;
                data <= 8'h00;
            end
        end
    end

endmodule
