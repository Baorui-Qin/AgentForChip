
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

    state_t state, next;

    always_ff @(posedge clk or posedge areset) begin
        if (areset) begin
            state <= LEFT;
        end else begin
            state <= next;
        end
    end

    always_comb begin
        next = state;

        case (state)
            LEFT: begin
                if (!ground) begin
                    next = FALL_L;
                end else if (bump_left) begin
                    next = RIGHT;
                end else begin
                    next = LEFT;
                end
            end

            RIGHT: begin
                if (!ground) begin
                    next = FALL_R;
                end else if (bump_right) begin
                    next = LEFT;
                end else begin
                    next = RIGHT;
                end
            end

            FALL_L: begin
                if (ground) begin
                    next = LEFT;
                end else begin
                    next = FALL_L;
                end
            end

            FALL_R: begin
                if (ground) begin
                    next = RIGHT;
                end else begin
                    next = FALL_R;
                end
            end

            default: begin
                next = LEFT;
            end
        endcase
    end

    assign walk_left  = (state == LEFT);
    assign walk_right = (state == RIGHT);
    assign aaah       = (state == FALL_L) || (state == FALL_R);

endmodule
