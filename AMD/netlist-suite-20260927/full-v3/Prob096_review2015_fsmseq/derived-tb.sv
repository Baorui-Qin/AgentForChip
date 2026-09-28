`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg reset, data,
	output reg[511:0] wavedrom_title,
	output reg wavedrom_enable,
	input tb_match
);
integer netlist_random_seed=1;


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


	wire [0:9] d = 10'b1110110011;
	
	
	initial begin #101;
		reset <= 1;
		@(posedge clk) reset <= 0;
		data <= 1;
		repeat(2) @(posedge clk) ;
		data <= 0;
		@(posedge clk);
		data <= 1;
		@(posedge clk);
		data <= 0;
	
		wavedrom_start("Reset and sequence detect");
		reset_test();
		for (int i=0;i<10;i++) begin
			@(posedge clk) data <= d[i];
		end
		wavedrom_stop();
		repeat(600) @(posedge clk, negedge clk) begin
			reset <= !($random(netlist_random_seed) & 31);
			data <= $random(netlist_random_seed);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input data,
  output start_shifting
);

  parameter S=0, S1=1, S11=2, S110=3, Done=4;

  reg [2:0] state, next;

  always_comb begin
    case (state)
      S: next = data ? S1: S;
      S1: next = data ? S11: S;
      S11: next = data ? S11 : S110;
      S110: next = data ? Done : S;
      Done: next = Done;
    endcase
  end

  always @(posedge clk)
    if (reset) state <= S;
    else state <= next;

  assign start_shifting = state == Done;

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_data; wire drive_data; assign #0.1 drive_data=raw_data;
wire gold_start_shifting, dut_start_shifting, raw_dut_start_shifting; reg seen_start_shifting='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.data(raw_data),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.data(drive_data),.start_shifting(gold_start_shifting));
TopModule dut(.clk(clk),.reset(drive_reset),.data(drive_data),.start_shifting(raw_dut_start_shifting));
assign dut_start_shifting=raw_dut_start_shifting;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_start_shifting === 1'b0 || gold_start_shifting === 1'b1) begin
known=1; seen_start_shifting=1'b1;
if(dut_start_shifting !== gold_start_shifting) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_start_shifting) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:start_shifting");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
