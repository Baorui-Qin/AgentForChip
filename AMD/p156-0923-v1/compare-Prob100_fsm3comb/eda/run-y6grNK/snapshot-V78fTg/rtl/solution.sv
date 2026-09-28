
module TopModule (
    input  logic in,
    input  logic [1:0] state,
    output logic [1:0] next_state,
    output logic out
);

    always_comb begin
        case (state)
            2'b00: next_state = in ? 2'b01 : 2'b00; // A
            2'b01: next_state = in ? 2'b01 : 2'b10; // B
            2'b10: next_state = in ? 2'b11 : 2'b00; // C
            2'b11: next_state = in ? 2'b01 : 2'b10; // D
            default: next_state = 2'b00;
        endcase

        out = (state == 2'b11);
    end

endmodule
