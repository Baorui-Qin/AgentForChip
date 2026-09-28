module TopModule (
    input  logic [7:0] in,
    output logic [3:0] out
);

    always_comb begin
        out = 4'd0;
        for (int i = 0; i < 8; i = i + 1) begin
            out = out + in[i];
        end
    end

endmodule