
module TopModule (
    input  logic         clk,
    input  logic         load,
    input  logic [255:0] data,
    output logic [255:0] q
);

    logic [255:0] next_q;

    integer r, c, dr, dc;
    integer nr, nc;
    integer cnt;

    always_comb begin
        for (r = 0; r < 16; r = r + 1) begin
            for (c = 0; c < 16; c = c + 1) begin
                cnt = 0;

                for (dr = -1; dr <= 1; dr = dr + 1) begin
                    for (dc = -1; dc <= 1; dc = dc + 1) begin
                        if (!(dr == 0 && dc == 0)) begin
                            nr = (r + dr + 16) % 16;
                            nc = (c + dc + 16) % 16;
                            cnt = cnt + q[nr * 16 + nc];
                        end
                    end
                end

                if (cnt == 3)
                    next_q[r * 16 + c] = 1'b1;
                else if (cnt == 2)
                    next_q[r * 16 + c] = q[r * 16 + c];
                else
                    next_q[r * 16 + c] = 1'b0;
            end
        end
    end

    always_ff @(posedge clk) begin
        if (load)
            q <= data;
        else
            q <= next_q;
    end

endmodule
