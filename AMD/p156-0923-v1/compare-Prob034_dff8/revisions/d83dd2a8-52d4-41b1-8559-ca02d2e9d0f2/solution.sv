module TopModule (
    input  logic       clk,
    input  logic [7:0] d,
    output logic [7:0] q
);

    // 8 D flip-flops, positive-edge triggered, initialized to 0 at power-up
    // so the register state is defined before the first clock edge.
    logic [7:0] q_reg = 8'h00;

    always_ff @(posedge clk) begin
        q_reg <= d;
    end

    assign q = q_reg;

endmodule
