`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic j, k,
	output logic areset,
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


	
	reg [0:11][1:0] d = 24'b000101010010101111111111;
	
	initial begin #101;
		reset <= 1;
		j <= 0;
		k <= 0;
		@(posedge clk);
		reset <= 0;
		j <= 1;
		@(posedge clk);
		j <= 0;
		wavedrom_start("Reset and transitions");
		reset_test(1);
		for (int i=0;i<12;i++)
			@(posedge clk) {k, j} <= d[i];
		wavedrom_stop();
		repeat(200) @(posedge clk, negedge clk) begin
			{j,k} <= $random(netlist_random_seed);
			reset <= !($random(netlist_random_seed) & 7);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input j,
  input k,
  input areset,
  output out
);

  parameter A=0, B=1;
  reg state;
  reg next;

    always_comb begin
    case (state)
      A: next = j ? B : A;
      B: next = k ? A : B;
    endcase
    end

    always @(posedge clk, posedge areset) begin
    if (areset) state <= A;
        else state <= next;
  end

  assign out = (state==B);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_areset; wire drive_areset; assign #0.1 drive_areset=raw_areset;
wire raw_j; wire drive_j; assign #0.1 drive_j=raw_j;
wire raw_k; wire drive_k; assign #0.1 drive_k=raw_k;
wire gold_out, dut_out, raw_dut_out; reg seen_out='0;
stimulus_gen stim1(.clk(clk),.j(raw_j),.k(raw_k),.areset(raw_areset),.wavedrom_title(),.wavedrom_enable(),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.areset(drive_areset),.j(drive_j),.k(drive_k),.out(gold_out));
TopModule dut(.clk(clk),.areset(drive_areset),.j(drive_j),.k(drive_k),.out(raw_dut_out));
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
if((&seen_out) !== 1'b1) $fatal(1,"NETLIST_OUTPUT_UNOBSERVED:out");
if(checks != 481) $fatal(1,"RTL_CHECK_COUNT_CHANGED");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end

initial begin $timeformat(-12,0,"",0); $dumpfile("wave.vcd"); $dumpvars(1,netlist_tb); $dumpvars(1,netlist_tb.dut); end
always @(mismatches) if(mismatches==1) $display("RTL_FIRST_MISMATCH time_ps=%0t checks=%0d",$time,checks);
endmodule
