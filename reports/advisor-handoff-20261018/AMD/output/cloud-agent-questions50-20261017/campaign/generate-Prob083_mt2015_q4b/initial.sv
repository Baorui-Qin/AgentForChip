module TopModule(
    input  wire x,
    input  wire y,
    output wire z
);
    // Simple combinational logic: z = 1 when both x and y are 0
    assign z = ~(x | y);
endmodule