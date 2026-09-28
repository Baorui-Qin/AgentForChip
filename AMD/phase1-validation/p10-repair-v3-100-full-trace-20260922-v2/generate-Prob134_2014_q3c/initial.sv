
module TopModule (
    input  clk,
    input  x,
    input  [2:0] y,
    output Y0,
    output z
);
    assign Y0 = x ^ y[0] ^ y[2];
    assign z  = y[2] | (y[1] & y[0]);
endmodule
