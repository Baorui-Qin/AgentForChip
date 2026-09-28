`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output areset,
	output reg load,
	output reg ena,
	output reg[3:0] data,
	
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
);
integer netlist_random_seed=1;

	reg reset;
	assign areset = reset;

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


// Add two ports to module stimulus_gen:
//    output [511:0] wavedrom_title
//    output reg wavedrom_enable

	task wavedrom_start(input[511:0] title = "");
	endtask
	
	task wavedrom_stop;
		#1;
	endtask	


	

	initial begin #101;
		{load, ena, reset, data} <= 7'h40;
		@(posedge clk) {load, ena, reset, data} <= 7'h4f;
		wavedrom_start("Load and reset");
		@(posedge clk) {load, ena, reset, data} <= 7'h0x;
		@(posedge clk) {load, ena, reset, data} <= 7'h2x;
		@(posedge clk) {load, ena, reset, data} <= 7'h2x;
		@(posedge clk) {load, ena, reset, data} <= 7'h0x;
		reset_test(1);
		@(posedge clk);
		@(posedge clk);
		wavedrom_stop();
		
		repeat(400) @(posedge clk, negedge clk) begin
			reset <= !($random(netlist_random_seed) & 31);
			load <= !($random(netlist_random_seed) & 15);
			ena <= |($random(netlist_random_seed) & 31);
			data <= $random(netlist_random_seed);
		end
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input areset,
  input load,
  input ena,
  input [3:0] data,
  output reg [3:0] q
);

  always @(posedge clk, posedge areset) begin
    if (areset)
      q <= 0;
    else if (load)
      q <= data;
    else if (ena)
      q <= q[3:1];
  end

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_load; wire drive_load; assign #0.1 drive_load=raw_load;
wire raw_ena; wire drive_ena; assign #0.1 drive_ena=raw_ena;
wire [3:0] raw_data; wire [3:0] drive_data; assign #0.1 drive_data=raw_data;
wire [3:0] gold_q, dut_q, raw_dut_q; reg [3:0] seen_q='0;
stimulus_gen stim1(.clk(clk),.areset(raw_areset),.load(raw_load),.ena(raw_ena),.data(raw_data),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(gold_q));
TopModule dut(.clk(clk),.areset(drive_areset),.load(drive_load),.ena(drive_ena),.data(drive_data),.q(raw_dut_q));
assign dut_q=raw_dut_q;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<4;b=b+1) begin
if(gold_q[b] === 1'b0 || gold_q[b] === 1'b1) begin
known=1; seen_q[b]=1'b1;
if(dut_q[b] !== gold_q[b]) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_q) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:q");
if(checks != 853) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
