
module TopModule (
    input  logic clk,
    input  logic areset,
    input  logic bump_left,
    input  logic bump_right,
    input  logic ground,
    output logic walk_left,
    output logic walk_right,
    output logic aaah
);

    typedef enum logic [1:0] {
        LEFT,
        RIGHT,
        FALL_L,
        FALL_R
    } state_t;

    state_t state, next_state;

    // State register with asynchronous reset
    always_ff @(posedge clk or posedge areset) begin
        if (areset) begin
            state <= LEFT;
        end else begin
            state <= next_state;
        end
    end

    // Next-state logic (Moore)
    always_comb begin
        next_state = state;
        case (state)
            LEFT: begin
                if (!ground)
                    next_state = FALL_L;
                else if (bump_left)
                    next_state = RIGHT;
                else
                    next_state = LEFT;
            end
            RIGHT: begin
                if (!ground)
                    next_state = FALL_R;
                else if (bump_right)
                    next_state = LEFT;
                else
                    next_state = RIGHT;
            end
            FALL_L: begin
                if (ground)
                    next_state = LEFT;
                else
                    next_state = FALL_L;
            end
            FALL_R: begin
                if (ground)
                    next_state = RIGHT;
                else
                    next_state = FALL_R;
            end
            default: next_state = LEFT;
        endcase
    end

    // Output logic (Moore)
    always_comb begin
        walk_left  = 1'b0;
        walk_right = 1'b0;
        aaah       = 1'b0;
        case (state)
            LEFT: begin
                walk_left = 1'b1;
            end
            RIGHT: begin
                walk_right = 1'b1;
            end
            FALL_L, FALL_R: begin
                aaah = 1'b1;
            end
            default: begin
                walk_left = 1'b1;
            end
        endcase
    end

endmodule
