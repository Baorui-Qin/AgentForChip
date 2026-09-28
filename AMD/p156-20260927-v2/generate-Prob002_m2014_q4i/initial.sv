module TopModule (
    output logic out
);

    // The specification requires the output to always drive logic low.
    assign out = 1'b0;

endmodule
