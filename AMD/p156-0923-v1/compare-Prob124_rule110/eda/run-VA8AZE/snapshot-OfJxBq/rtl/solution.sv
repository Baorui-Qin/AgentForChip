
module TopModule (
    input  logic clk,
    input  logic load,
    input  logic [511:0] data,
    output logic [511:0] q
);

    logic [511:0] next;

    always_comb begin
        next[0] = q[0];
        for (int i = 1; i < 511; i++) begin
            next[i] = (~q[i+1] & q[i]) | (~q[i] & q[i-1]) | (q[i] & ~q[i-1]);
        end
        next[511] = q[511] | q[510];
    end

    always_ff @(posedge clk) begin
        if (load)
            q <= data;
        else
            q <= next;
    end

endmodule
