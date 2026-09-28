`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen(
	input clk,
	output logic areset,
	output logic train_valid,
	output train_taken,

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
	logic train_taken_r;
	assign train_taken = train_valid ? train_taken_r : 1'bx;
	
	initial begin integer netlist_seed, netlist_discard; netlist_seed=1; netlist_discard=$urandom(netlist_seed); #101; begin
		@(posedge clk);
		@(posedge clk) reset <= 1;
		@(posedge clk) reset <= 0;
		train_taken_r <= 1;
		train_valid <= 1;
	
		wavedrom_start("Asynchronous reset");
			reset_test(1); // Test for asynchronous reset
		wavedrom_stop();
		@(posedge clk) reset <= 1;
		train_taken_r <= 1;
		train_valid <= 0;
		@(posedge clk) reset <= 0;

		wavedrom_start("Count up, then down");
		train_taken_r <= 1;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 0;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 0;
			@(posedge clk) train_valid <= 1;
		train_taken_r <= 0;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 0;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 1;
			@(posedge clk) train_valid <= 0;
			@(posedge clk) train_valid <= 1;		
		wavedrom_stop();

		repeat(1000) @(posedge clk,negedge clk) 
			{train_valid, train_taken_r} <= {$urandom} ;

		#1 $finish;
	end end
	
	
endmodule

`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input areset,
  input train_valid,
  input train_taken,
  output logic [1:0] state
);

  always @(posedge clk, posedge areset) begin
    if (areset)
      state <= 1;
    else if (train_valid) begin
      if(state < 3 && train_taken)
        state <= state + 1;
      else if(state > 0 && !train_taken)
        state <= state - 1;
    end
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_train_valid; wire drive_train_valid; assign #0.1 drive_train_valid=raw_train_valid;
wire raw_train_taken; wire drive_train_taken; assign #0.1 drive_train_taken=raw_train_taken;
wire [1:0] gold_state, dut_state, raw_dut_state; reg [1:0] seen_state='0;
stimulus_gen stim1(.clk(clk),.areset(raw_areset),.train_valid(raw_train_valid),.train_taken(raw_train_taken),.tb_match(1'b1),.wavedrom_title(),.wavedrom_enable(),.wavedrom_hide_after_time());
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.state(gold_state));
TopModule dut(.clk(clk),.areset(drive_areset),.train_valid(drive_train_valid),.train_taken(drive_train_taken),.state(raw_dut_state));
assign dut_state=raw_dut_state;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<2;b=b+1) begin
if(gold_state[b] === 1'b0 || gold_state[b] === 1'b1) begin
known=1; seen_state[b]=1'b1;
if(dut_state[b] !== gold_state[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_state) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:state");
if(checks != 2097) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
