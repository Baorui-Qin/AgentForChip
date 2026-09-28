
module TopModule (
    input  logic clk,
    input  logic areset,
    input  logic bump_left,
    input  logic bump_right,
    output logic walk_left,
    output logic walk_right
);

    logic state; // 0 = walking left, 1 = walking right

    always_ff @(posedge clk or posedge areset) begin
        if (areset) begin
            state <= 1'b0;
        end else begin
            if (bump_left && bump_right) begin
                state <= ~state;
            end else if (bump_left) begin
                state <= 1'b1;
            end else if (bump_right) begin
                state <= 1'b0;
            end
        end
    end

    assign walk_left  = ~state;
    assign walk_right =  state;

endmodule
