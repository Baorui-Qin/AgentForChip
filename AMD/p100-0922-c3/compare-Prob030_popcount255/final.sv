
module TopModule (
    input  logic [254:0] in,
    output logic [7:0]   out
);

    logic [255:0] padded;
    assign padded = {1'b0, in};

    function automatic logic [3:0] popcount8(input logic [7:0] x);
        integer j;
        begin
            popcount8 = 4'd0;
            for (j = 0; j < 8; j = j + 1) begin
                popcount8 = popcount8 + x[j];
            end
        end
    endfunction

    logic [3:0] cnt [0:31];
    logic [4:0] s1  [0:15];
    logic [5:0] s2  [0:7];
    logic [6:0] s3  [0:3];
    logic [7:0] s4  [0:1];
    logic [8:0] s5;

    always_comb begin
        for (int i = 0; i < 32; i = i + 1) begin
            cnt[i] = popcount8(padded[i*8 +: 8]);
        end
        for (int i = 0; i < 16; i = i + 1) begin
            s1[i] = cnt[2*i] + cnt[2*i+1];
        end
        for (int i = 0; i < 8; i = i + 1) begin
            s2[i] = s1[2*i] + s1[2*i+1];
        end
        for (int i = 0; i < 4; i = i + 1) begin
            s3[i] = s2[2*i] + s2[2*i+1];
        end
        for (int i = 0; i < 2; i = i + 1) begin
            s4[i] = s3[2*i] + s3[2*i+1];
        end
        s5 = s4[0] + s4[1];
        out = s5[7:0];
    end

endmodule
