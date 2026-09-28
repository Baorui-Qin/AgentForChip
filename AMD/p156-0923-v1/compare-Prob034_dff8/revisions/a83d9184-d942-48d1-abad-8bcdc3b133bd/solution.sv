
module TopModule (
    input  logic       clk,
    input  logic [7:0] d,
    output logic [7:0] q
);

    // Eight positive-edge triggered D flip-flops, initialized to zero so the
    // register state is defined before the first clock edge.
    initial q = '0;

    always_ff @(posedge clk) begin
        q <= d;
    end

endmodule
