
module TopModule (
    input  logic clk,
    input  logic reset,
    input  logic x,
    output logic z
);
    logic [2:0] state, next;

    always_ff @(posedge clk) begin
        if (reset)
            state <= 3'b000;
        else
            state <= next;
    end

    always_comb begin
        next = 3'b000;
        z = 1'b0;

        case (state)
            3'b000: begin
                next = x ? 3'b001 : 3'b000;
                z = 1'b0;
            end
            3'b001: begin
                next = x ? 3'b100 : 3'b001;
                z = 1'b0;
            end
            3'b010: begin
                next = x ? 3'b001 : 3'b010;
                z = 1'b0;
            end
            3'b011: begin
                next = x ? 3'b010 : 3'b001;
                z = 1'b1;
            end
            3'b100: begin
                next = x ? 3'b100 : 3'b011;
                z = 1'b1;
            end
            default: begin
                next = 3'b000;
                z = 1'b0;
            end
        endcase
    end
endmodule
