module TopModule(
    input  wire clk,
    input  wire areset,
    input  wire bump_left,
    input  wire bump_right,
    input  wire ground,
    output wire walk_left,
    output wire walk_right,
    output wire aaah
);
    // State encoding
    // 2'b00 - WALK_LEFT
    // 2'b01 - WALK_RIGHT
    // 2'b10 - FALLING
    // 2'b11 - unused
    typedef enum logic [1:0] {
        WALK_LEFT = 2'b00,
        WALK_RIGHT = 2'b01,
        FALLING = 2'b10
    } state_t;

    // State registers
    state_t current_state, next_state;
    logic [1:0] state_reg;
    assign current_state = state_reg;

    // Output registers (Moore)
    logic walk_left_reg, walk_right_reg, aaah_reg;
    assign walk_left = walk_left_reg;
    assign walk_right = walk_right_reg;
    assign aaah = aaah_reg;

    // State transition logic
    always_comb begin
        // Default next state = current state
        next_state = current_state;
        case (current_state)
            WALK_LEFT: begin
                // Bump left forces right walk
                if (bump_left) begin
                    next_state = WALK_RIGHT;
                end else if (!ground) begin
                    // ground low -> start falling
                    next_state = FALLING;
                end
            end
            WALK_RIGHT: begin
                if (bump_right) begin
                    next_state = WALK_LEFT;
                end else if (!ground) begin
                    next_state = FALLING;
                end
            end
            FALLING: begin
                // While falling, stay in FALLING until ground appears
                if (ground) begin
                    // resume previous walk direction (the one before fall)
                    // we need to remember which direction we were walking before fall
                    // We'll store that in a separate register `prev_dir`
                    next_state = walk_left_reg ? WALK_LEFT : WALK_RIGHT;
                end
            end
            default: next_state = WALK_LEFT;
        endcase
    end

    // Output logic (Moore)
    always_comb begin
        // Default outputs: idle
        walk_left_reg = 1'b0;
        walk_right_reg = 1'b0;
        aaah_reg = 1'b0;
        case (current_state)
            WALK_LEFT: begin
                walk_left_reg = 1'b1;
            end
            WALK_RIGHT: begin
                walk_right_reg = 1'b1;
            end
            FALLING: begin
                aaah_reg = 1'b1;
            end
            default: begin
                // keep defaults
            end
        endcase
    end

    // Register to hold previous walking direction before falling
    logic prev_dir;
    always_ff @(posedge clk or posedge areset) begin
        if (areset) begin
            state_reg <= WALK_LEFT;
            prev_dir <= 1'b1; // 1 indicates walking left (arbitrary)
            walk_left_reg <= 1'b1;
            walk_right_reg <= 1'b0;
            aaah_reg <= 1'b0;
        end else begin
            state_reg <= next_state;
            // Update prev_dir only when falling starts (ground low) from a walk state
            if (current_state == WALK_LEFT && !ground) begin
                prev_dir <= 1'b1; // remember left walk
            end else if (current_state == WALK_RIGHT && !ground) begin
                prev_dir <= 1'b0; // remember right walk
            end else begin
                prev_dir <= prev_dir; // hold
            end
        end
    end

    // Optional: detect ground edge for more precise behavior, but not required
    // No extra modules defined.
endmodule