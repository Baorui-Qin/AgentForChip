module TopModule(
    input  wire [99:0] in,
    output wire [99:0] out_both,
    output wire [99:0] out_any,
    output wire [99:0] out_different
);
    // out_both: 1 if both current and left neighbor are 1, else 0
    // left neighbor: index i-1 (i>0); out_both[0] = 0 because no left neighbor
    assign out_both[99] = 1'b0;
    genvar i;
    generate
        for (i = 0; i < 99; i = i + 1) begin : gen_out_both
            assign out_both[i] = in[i] & in[i+1];
        end
    endgenerate

    // out_any: 1 if current or right neighbor is 1, else 0
    // right neighbor: index i+1 (i<99); out_any[99] = in[99] | in[98] (i=98)
    // out_any[0] = 0 because no right neighbor
    assign out_any[0] = 1'b0;
    for (i = 0; i < 99; i = i + 1) begin : gen_out_any
        assign out_any[i+1] = in[i+1] | in[i];
    end

    // out_different: 1 if current and left neighbor differ (XOR), wrap-around for bit 0
    assign out_different[0] = in[0] ^ in[99];
    for (i = 0; i < 99; i = i + 1) begin : gen_out_different
        assign out_different[i+1] = in[i+1] ^ in[i];
    end
endmodule