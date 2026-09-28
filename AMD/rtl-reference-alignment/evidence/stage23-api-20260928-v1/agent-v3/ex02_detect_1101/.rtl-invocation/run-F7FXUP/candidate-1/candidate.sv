module TopModule(
    input  logic clk,
    input  logic reset,
    input  logic in,
    output logic detected
);

    logic [2:0] hist;

    always_ff @(posedge clk) begin
        if (reset) begin
            hist <= 3'b000;
            detected <= 1'b0;
        end else begin
            detected <= (hist == 3'b110) && in;
            hist <= {hist[1:0], in};
        end
    end

endmodule