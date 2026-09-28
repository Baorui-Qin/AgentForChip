
module TopModule (
    input  clk,
    input  reset,
    input  s,
    input  w,
    output z
);

    // State encoding:
    // A  : reset/wait state
    // B  : first w sample of a 3-cycle group
    // C0 : after one sample, count = 0
    // C1 : after one sample, count = 1
    // D0 : after two samples, count = 0
    // D1 : after two samples, count = 1
    // D2 : after two samples, count = 2
    // E0 : output cycle, previous group did not have exactly two ones
    // E1 : output cycle, previous group had exactly two ones
    localparam A  = 4'd0;
    localparam B  = 4'd1;
    localparam C0 = 4'd2;
    localparam C1 = 4'd3;
    localparam D0 = 4'd4;
    localparam D1 = 4'd5;
    localparam D2 = 4'd6;
    localparam E0 = 4'd7;
    localparam E1 = 4'd8;

    reg [3:0] state, next_state;

    always @(*) begin
        case (state)
            A:  next_state = s ? B : A;

            B:  next_state = w ? C1 : C0;

            C0: next_state = w ? D1 : D0;
            C1: next_state = w ? D2 : D1;

            D0: next_state = w ? E1 : E0;
            D1: next_state = w ? E1 : E0;
            D2: next_state = w ? E0 : E1;

            E0: next_state = B;
            E1: next_state = B;

            default: next_state = A;
        endcase
    end

    always @(posedge clk) begin
        if (reset)
            state <= A;
        else
            state <= next_state;
    end

    assign z = (state == E1);

endmodule
