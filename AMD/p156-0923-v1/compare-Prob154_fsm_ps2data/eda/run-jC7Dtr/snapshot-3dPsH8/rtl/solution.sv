module TopModule (
    input  logic clk,
    input  logic reset,
    input  logic [7:0] in,
    output logic [23:0] out_bytes,
    output logic done
);

    logic [1:0] count;
    logic [7:0] byte1, byte2, byte3;

    always_ff @(posedge clk) begin
        if (reset) begin
            count     <= 2'd0;
            done      <= 1'b0;
            out_bytes <= 24'd0;
            byte1     <= 8'd0;
            byte2     <= 8'd0;
            byte3     <= 8'd0;
        end else begin
            done <= 1'b0;

            if (count == 2'd0) begin
                if (in[3]) begin
                    count <= 2'd1;
                    byte1 <= in;
                end
            end else if (count == 2'd1) begin
                count <= 2'd2;
                byte2 <= in;
            end else if (count == 2'd2) begin
                count     <= 2'd0;
                byte3     <= in;
                out_bytes <= {byte1, byte2, in};
                done      <= 1'b1;
            end
        end
    end

endmodule
