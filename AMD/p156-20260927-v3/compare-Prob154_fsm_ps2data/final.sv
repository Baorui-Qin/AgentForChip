module TopModule (
    input  logic        clk,
    input  logic        reset,
    input  logic [7:0]  in,
    output logic [23:0] out_bytes,
    output logic        done
);

    typedef enum logic [1:0] {
        SEEK = 2'd0,  // discarding bytes, looking for a start byte (in[3]=1)
        GOT1 = 2'd1,  // received byte 1, waiting for byte 2
        GOT2 = 2'd2,  // received bytes 1-2, waiting for byte 3
        DONE = 2'd3   // received all 3 bytes; report the message
    } state_t;

    state_t     state, next;
    logic [7:0] b1, b2;

    // Next-state decode (combinational)
    always_comb begin
        case (state)
            SEEK: next = in[3] ? GOT1 : SEEK;
            GOT1: next = GOT2;
            GOT2: next = DONE;
            DONE: next = in[3] ? GOT1 : SEEK;
            default: next = SEEK;
        endcase
    end

    // Sequential datapath. done and out_bytes are registered on the
    // transition INTO DONE, so they are valid during the very next cycle
    // (the cycle immediately after the third byte was received).
    always_ff @(posedge clk) begin
        if (reset) begin
            state     <= SEEK;
            done      <= 1'b0;
            out_bytes <= 24'h000000;
            b1        <= 8'h00;
            b2        <= 8'h00;
        end else begin
            state <= next;
            done  <= (next == DONE);

            case (next)
                GOT1: b1 <= in;                  // capture byte 1
                GOT2: b2 <= in;                  // capture byte 2
                DONE: out_bytes <= {b1, b2, in}; // capture byte 3, form message
                default: ;
            endcase
        end
    end

endmodule
