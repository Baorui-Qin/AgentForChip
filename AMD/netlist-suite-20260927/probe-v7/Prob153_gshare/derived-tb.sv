`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen
#(parameter N=7)
(
	input clk,
	output logic areset,
	
	output logic predict_valid,
	output [N-1:0] predict_pc,
	
	output logic train_valid,
	output train_taken,
	output train_mispredicted,
	output [N-1:0] train_history,
	output [N-1:0] train_pc,

	input tb_match,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	output int wavedrom_hide_after_time	
);


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	


	reg reset;
	task reset_test(input async=0);
		bit arfail, srfail, datafail;
	
		@(posedge clk);
		@(posedge clk) reset <= 0;
		repeat(3) @(posedge clk);
	
		@(negedge clk) begin datafail = !tb_match ; reset <= 1; end
		@(posedge clk) arfail = !tb_match;
		@(posedge clk) begin
			srfail = !tb_match;
			reset <= 0;
		end
		if (srfail)
			$display("Hint: Your reset doesn't seem to be working.");
		else if (arfail && (async || !datafail))
			$display("Hint: Your reset should be %0s, but doesn't appear to be.", async ? "asynchronous" : "synchronous");
		// Don't warn about synchronous reset if the half-cycle before is already wrong. It's more likely
		// a functionality error than the reset being implemented asynchronously.
	
	endtask

	
	assign areset = reset;
	
	logic [N-1:0] predict_pc_r;
	logic train_taken_r;
	logic train_mispredicted_r;
	logic [N-1:0] train_history_r;
	logic [N-1:0] train_pc_r;
	
	assign predict_pc = predict_valid ? predict_pc_r : {N{1'bx}};
	assign train_taken = train_valid ? train_taken_r : 1'bx;
	assign train_mispredicted = train_valid ? train_mispredicted_r : 1'bx;
	assign train_history = train_valid ? train_history_r : {N{1'bx}};
	assign train_pc = train_valid ? train_pc_r : {N{1'bx}};
	
	
	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		@(posedge clk) reset <= 1;
		@(posedge clk) reset <= 0;
		predict_valid <= 1;
		train_mispredicted_r <= 1;
		train_history_r <= 7'h7f;
		train_pc_r <= 7'h4;
		train_taken_r <= 1;
		train_valid <= 1;
		predict_valid <= 1;
		predict_pc_r <= 4;
	
		wavedrom_start("Asynchronous reset");
			reset_test(1); // Test for asynchronous reset
		wavedrom_stop();
		@(posedge clk) reset <= 1;
		predict_valid <= 0;

		wavedrom_start("Training entries (pc = 0xa, history = 0 and 2)");
		predict_pc_r <= 7'ha;
		predict_valid <= 1;

		train_history_r <= 7'h0;
		train_pc_r <= 7'ha;
		train_taken_r <= 1;
		train_valid <= 0;
		train_mispredicted_r <= 0;
		
		@(negedge clk) reset <= 0;
		@(posedge clk) train_valid <= 1;
		@(posedge clk) train_history_r <= 7'h2;
		@(posedge clk) train_valid <= 0;

		repeat(4) @(posedge clk);
		train_history_r <= 7'h0;
		train_taken_r <= 0;
		train_valid <= 1;
		@(posedge clk) train_valid <= 0;
		
		repeat(8) @(posedge clk);
		wavedrom_stop();

		@(posedge clk);

		wavedrom_start("History register recovery on misprediction");
		reset <= 1;
		predict_pc_r <= 7'ha;
		predict_valid <= 1;

		train_history_r <= 7'h0;
		train_pc_r <= 7'ha;
		train_taken_r <= 1;
		train_valid <= 0;
		train_mispredicted_r <= 1;
		
		@(negedge clk) reset <= 0;
		@(posedge clk);
		@(posedge clk) train_valid <= 1;
		@(posedge clk) train_valid <= 0;
		@(posedge clk) train_valid <= 1;
		train_history_r <= 7'h10;
		train_taken_r <= 0;
		@(posedge clk) train_valid <= 0;

		repeat(4) @(posedge clk);
		train_history_r <= 7'h0;
		train_taken_r <= 0;
		train_valid <= 1;
		@(posedge clk) train_valid <= 0;
		@(posedge clk) train_valid <= 1;
		train_history_r <= 7'h20;
		@(posedge clk) train_valid <= 0;
		
		repeat(3) @(posedge clk);
		wavedrom_stop();

		repeat(1000) @(posedge clk,negedge clk) begin
			{predict_valid, predict_pc_r, train_pc_r, train_taken_r, train_valid} <= {$urandom};
			train_history_r <= $urandom;
			train_mispredicted_r <= !($urandom_range(0,31));
		end

		#1 $finish;
	end end
	
	
endmodule

`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input areset,

  input predict_valid,
  input [6:0] predict_pc,
  output predict_taken,
  output [6:0] predict_history,

  input train_valid,
  input train_taken,
  input train_mispredicted,
  input [6:0] train_history,
  input [6:0] train_pc
);

  parameter n = 7;
  logic [1:0] pht [2**n-1:0];

  parameter [1:0] SNT = 0, LNT = 1, LT = 2, ST = 3;

  logic [n-1:0] predict_history_r;
  wire [n-1:0] predict_index = predict_history_r ^ predict_pc;
  wire [n-1:0] train_index = train_history ^ train_pc;

  always@(posedge clk, posedge areset)
    if (areset) begin
      for (integer i=0; i<2**n; i=i+1)
        pht[i] = LNT;
      predict_history_r = 0;
        end  else begin
      if (predict_valid)
        predict_history_r <= {predict_history_r, predict_taken};
      if(train_valid) begin
        if(pht[train_index] < 3 && train_taken)
          pht[train_index] <= pht[train_index] + 1;
        else if(pht[train_index] > 0 && !train_taken)
          pht[train_index] <= pht[train_index] - 1;
        if (train_mispredicted)
          predict_history_r <= {train_history, train_taken};
      end
    end

  assign predict_taken = predict_valid ? pht[predict_index][1] : 1'bx;
  assign predict_history = predict_valid ? predict_history_r : {n{1'bx}};

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_predict_valid; wire drive_predict_valid; assign #0.1 drive_predict_valid=raw_predict_valid;
wire [6:0] raw_predict_pc; wire [6:0] drive_predict_pc; assign #0.1 drive_predict_pc=raw_predict_pc;
wire raw_train_valid; wire drive_train_valid; assign #0.1 drive_train_valid=raw_train_valid;
wire raw_train_taken; wire drive_train_taken; assign #0.1 drive_train_taken=raw_train_taken;
wire raw_train_mispredicted; wire drive_train_mispredicted; assign #0.1 drive_train_mispredicted=raw_train_mispredicted;
wire [6:0] raw_train_history; wire [6:0] drive_train_history; assign #0.1 drive_train_history=raw_train_history;
wire [6:0] raw_train_pc; wire [6:0] drive_train_pc; assign #0.1 drive_train_pc=raw_train_pc;
wire gold_predict_taken, dut_predict_taken, raw_dut_predict_taken; reg seen_predict_taken='0;
wire [6:0] gold_predict_history, dut_predict_history, raw_dut_predict_history; reg [6:0] seen_predict_history='0;
stimulus_gen stim1(.clk(clk),.areset(raw_areset),.predict_valid(raw_predict_valid),.predict_pc(raw_predict_pc),.train_valid(raw_train_valid),.train_taken(raw_train_taken),.train_mispredicted(raw_train_mispredicted),.train_history(raw_train_history),.train_pc(raw_train_pc),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_pc(drive_predict_pc),.predict_taken(gold_predict_taken),.predict_history(gold_predict_history),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.train_mispredicted(drive_train_mispredicted),.train_history(drive_train_history),.train_pc(drive_train_pc));
TopModule dut(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_pc(drive_predict_pc),.predict_taken(raw_dut_predict_taken),.predict_history(raw_dut_predict_history),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.train_mispredicted(drive_train_mispredicted),.train_history(drive_train_history),.train_pc(drive_train_pc));
assign dut_predict_taken=raw_dut_predict_taken;
assign dut_predict_history=raw_dut_predict_history;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_predict_taken === 1'b0 || gold_predict_taken === 1'b1) begin
known=1; seen_predict_taken=1'b1;
if(dut_predict_taken !== gold_predict_taken) bad=1;
end end
for(integer b=0;b<7;b=b+1) begin
if(gold_predict_history[b] === 1'b0 || gold_predict_history[b] === 1'b1) begin
known=1; seen_predict_history[b]=1'b1;
if(dut_predict_history[b] !== gold_predict_history[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_predict_taken) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:predict_taken");
if((&seen_predict_history) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:predict_history");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
