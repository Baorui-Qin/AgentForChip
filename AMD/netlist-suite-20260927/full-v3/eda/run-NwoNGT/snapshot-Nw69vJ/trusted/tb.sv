`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic in,
	output logic reset,
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


	
	initial begin #101;
		reset <= 1;
		in <= 0;
		@(posedge clk);
		@(posedge clk) reset <= 0; in <= 0;
		@(posedge clk) in <= 1;
		wavedrom_start();
			reset_test(0);
			@(posedge clk) in <= 0;
			@(posedge clk) in <= 0;
			@(posedge clk) in <= 0;
			@(posedge clk) in <= 1;
			@(posedge clk) in <= 1;
		@(negedge clk);
		wavedrom_stop();
		repeat(200) @(posedge clk, negedge clk) begin
			in <= $random(netlist_random_seed);
			reset <= !($random(netlist_random_seed) & 7);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input in,
  input reset,
  output out
);

  parameter A=0, B=1;
  reg state;
  reg next;

    always_comb begin
    case (state)
      A: next = in ? A : B;
      B: next = in ? B : A;
    endcase
    end

    always @(posedge clk) begin
    if (reset) state <= B;
        else state <= next;
  end

  assign out = (state==B);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_in; wire drive_in; assign #0.1 drive_in=raw_in;
wire gold_out, dut_out, raw_dut_out; reg seen_out='0;
stimulus_gen stim1(.clk(clk),.in(raw_in),.reset(raw_reset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.in(drive_in),.out(gold_out));
TopModule dut(.clk(clk),.reset(drive_reset),.in(drive_in),.out(raw_dut_out));
assign dut_out=raw_dut_out;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_out === 1'b0 || gold_out === 1'b1) begin
known=1; seen_out=1'b1;
if(dut_out !== gold_out) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_out) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:out");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
