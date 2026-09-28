module TopModule (
    input  logic        clk,
    input  logic        areset,
    input  logic        predict_valid,
    input  logic [6:0]  predict_pc,
    output logic        predict_taken,
    output logic [6:0]  predict_history,
    input  logic        train_valid,
    input  logic        train_taken,
    input  logic        train_mispredicted,
    input  logic [6:0]  train_history,
    input  logic [6:0]  train_pc
);

    logic [6:0] history;
    logic [1:0] pht [0:127];

    // gshare index: 7-bit pc XOR 7-bit global history
    wire [6:0] predict_index = predict_pc ^ history;
    wire [6:0] train_index   = train_pc   ^ train_history;

    // Prediction reads the PHT state as it is in the current cycle
    // (training only takes effect at the next positive clock edge).
    assign predict_history = history;
    assign predict_taken   = pht[predict_index][1];

    always_ff @(posedge clk or posedge areset) begin
        if (areset) begin
            history <= 7'b0;
            for (int i = 0; i < 128; i = i + 1) begin
                pht[i] <= 2'b01;   // weakly not-taken
            end
        end else begin
            // Train the 2-bit saturating counter for the trained branch
            if (train_valid) begin
                if (train_taken)
                    pht[train_index] <= (pht[train_index] == 2'b11) ? 2'b11
                                                                    : pht[train_index] + 2'b01;
                else
                    pht[train_index] <= (pht[train_index] == 2'b00) ? 2'b00
                                                                    : pht[train_index] - 2'b01;
            end

            // History register: misprediction recovery has priority over the
            // update for a newly predicted (younger, to be discarded) branch.
            if (train_valid && train_mispredicted)
                history <= {train_history[5:0], train_taken};
            else if (predict_valid)
                history <= {history[5:0], predict_taken};
        end
    end

endmodule
