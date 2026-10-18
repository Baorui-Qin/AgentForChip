module TopModule(
    input  wire x3,
    input  wire x2,
    input  wire x1,
    output wire f
);
    // Combinational implementation of the truth table
    assign f = (x3 & ~x2 & x1) | (~x3 & x2 & x1) | (x3 & x2 & x1);
endmodule