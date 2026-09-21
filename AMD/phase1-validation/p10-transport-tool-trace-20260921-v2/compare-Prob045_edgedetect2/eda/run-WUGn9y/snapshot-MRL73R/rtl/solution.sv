
module TopModule (
    input  wire       clk,
    input  wire [7:0] in,
    output wire [7:0] anyedge
);

    reg [7:0] prev_in;

    always @(posedge clk) begin
        prev_in <= in;
    end

    assign anyedge = in ^ prev_in;

endmodule
