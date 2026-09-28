`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13

module stimulus_gen
(
	input clk,
	output logic areset,
	
	output logic predict_valid,
	output predict_taken,
	
	output logic train_mispredicted,
	output train_taken,
	output [31:0] train_history,

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
	logic predict_taken_r;
	assign predict_taken = predict_valid ? predict_taken_r : 1'bx;
	
	logic train_taken_r;
	logic [31:0] train_history_r;
	assign train_taken = train_mispredicted ? train_taken_r : 1'bx;
	assign train_history = train_mispredicted ? train_history_r : 32'hx;
	
	
	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		@(posedge clk) reset <= 1;
		@(posedge clk) reset <= 0;
		predict_taken_r <= 1;
		predict_valid <= 1;
		train_mispredicted <= 0;
		train_history_r <= 32'h5;
		train_taken_r <= 1;
	
		wavedrom_start("Asynchronous reset");
			reset_test(1); // Test for asynchronous reset
		wavedrom_stop();
		@(posedge clk) reset <= 1;
		predict_valid <= 0;

		wavedrom_start("Predictions: Shift in");
		repeat(2) @(posedge clk) {predict_valid, predict_taken_r} <= {$urandom};
		reset <= 0;
		predict_valid <= 1;
		repeat(6) @(posedge clk) {predict_taken_r} <= {$urandom};
		predict_valid <= 0;
		repeat(3) @(posedge clk) {predict_taken_r} <= {$urandom};
		predict_valid <= 1;
		train_mispredicted <= 1;
		@(posedge clk) train_mispredicted <= 0;
		repeat(6) @(posedge clk) {predict_taken_r} <= {$urandom};
		wavedrom_stop();

		repeat(2000) @(posedge clk,negedge clk) begin
			{predict_valid, predict_taken_r, train_taken_r} <= {$urandom};
			train_history_r <= $urandom;
			train_mispredicted <= !($urandom_range(0,31));
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
  input predict_taken,
  output logic [31:0] predict_history,

  input train_mispredicted,
  input train_taken,
  input [31:0] train_history
);

  always@(posedge clk, posedge areset)
    if (areset) begin
      predict_history = 0;
        end  else begin
      if (train_mispredicted)
        predict_history <= {train_history, train_taken};
      else if (predict_valid)
        predict_history <= {predict_history, predict_taken};
    end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_predict_valid; wire drive_predict_valid; assign #0.1 drive_predict_valid=raw_predict_valid;
wire raw_predict_taken; wire drive_predict_taken; assign #0.1 drive_predict_taken=raw_predict_taken;
wire raw_train_mispredicted; wire drive_train_mispredicted; assign #0.1 drive_train_mispredicted=raw_train_mispredicted;
wire raw_train_taken; wire drive_train_taken; assign #0.1 drive_train_taken=raw_train_taken;
wire [31:0] raw_train_history; wire [31:0] drive_train_history; assign #0.1 drive_train_history=raw_train_history;
wire [31:0] gold_predict_history, dut_predict_history, raw_dut_predict_history; reg [31:0] seen_predict_history='0;
stimulus_gen stim1(.clk(clk),.areset(raw_areset),.predict_valid(raw_predict_valid),.predict_taken(raw_predict_taken),.train_mispredicted(raw_train_mispredicted),.train_taken(raw_train_taken),.train_history(raw_train_history),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_taken(drive_predict_taken),.train_mispredicted(drive_train_mispredicted),.train_taken(drive_train_taken),.train_history(drive_train_history),.predict_history(gold_predict_history));
TopModule dut(.clk(clk),.areset(drive_areset),.predict_valid(drive_predict_valid),.predict_taken(drive_predict_taken),.train_mispredicted(drive_train_mispredicted),.train_taken(drive_train_taken),.train_history(drive_train_history),.predict_history(raw_dut_predict_history));
assign dut_predict_history=raw_dut_predict_history;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<32;b=b+1) begin
if(gold_predict_history[b] === 1'b0 || gold_predict_history[b] === 1'b1) begin
known=1; seen_predict_history[b]=1'b1;
if(dut_predict_history[b] !== gold_predict_history[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_predict_history) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:predict_history");
if(checks != 4109) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
