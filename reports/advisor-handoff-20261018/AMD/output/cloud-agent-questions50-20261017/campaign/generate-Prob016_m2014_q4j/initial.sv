module TopModule(
    input  [3:0] x,
    input  [3:0] y,
    output [4:0] sum
);
    // Full adder cascade
    wire [3:0] c;
    assign c[0] = 1'b0;
    genvar i;
    generate
        for (i = 0; i < 4; i = i + 1) begin : gen_fa
            assign sum[i] = x[i] ^ y[i] ^ c[i+1];
            assign c[i+2] = (x[i] & y[i]) | (x[i] & c[i+1]) | (y[i] & c[i+1]);
        end
    endgenerate
    assign sum[4] = c[5];
endmodule