
module TopModule (
    input clk,
    input x,
    input [2:0] y,
    output Y0,
    output z
);

    assign Y0 = (y == 3'b000 || y == 3'b010) ? x :
                (y == 3'b001 || y == 3'b011 || y == 3'b100) ? ~x : 1'b0;

    assign z = (y == 3'b011 || y == 3'b100);

endmodule
