
module TopModule (
    input  logic clk,
    input  logic load,
    input  logic [255:0] data,
    output logic [255:0] q
);

    logic [255:0] next_q;
    integer i;
    logic [7:0] idx;
    logic [3:0] rr, cc, nr, nc;
    logic [7:0] nidx;
    integer sum;

    always_comb begin
        for (i = 0; i < 256; i = i + 1) begin
            idx = i[7:0];
            rr = idx[7:4];
            cc = idx[3:0];
            sum = 0;

            nr = rr - 1;
            nc = cc - 1;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr - 1;
            nc = cc;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr - 1;
            nc = cc + 1;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr;
            nc = cc - 1;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr;
            nc = cc + 1;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr + 1;
            nc = cc - 1;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr + 1;
            nc = cc;
            nidx = {nr, nc};
            sum += q[nidx];

            nr = rr + 1;
            nc = cc + 1;
            nidx = {nr, nc};
            sum += q[nidx];

            next_q[i] = (sum == 3) || (sum == 2 && q[i]);
        end
    end

    always_ff @(posedge clk) begin
        if (load)
            q <= data;
        else
            q <= next_q;
    end

endmodule
