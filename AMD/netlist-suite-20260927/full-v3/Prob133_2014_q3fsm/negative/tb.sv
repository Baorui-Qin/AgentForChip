`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output logic reset,
	output logic s, w,
	input tb_match
);
integer netlist_random_seed=1;


	bit spulse_fail = 0;
	bit failed = 0;
	
	always @(posedge clk, negedge clk)
		if (!tb_match) failed = 1;
		
		
	initial begin #101;
		reset <= 1;
		s <= 0;
		w <= 0;
		@(posedge clk);
		@(posedge clk);
		reset <= 0;
		@(posedge clk);
		@(posedge clk);
		
		s <= 1;

		repeat(200) @(posedge clk, negedge clk) begin
			w <= $random(netlist_random_seed);
		end

		reset <= 1;
		@(posedge clk);
		reset <= 0;
		@(posedge clk);
		@(posedge clk);

		repeat(200) @(posedge clk, negedge clk) begin
			w <= $random(netlist_random_seed);
		end
		
		@(posedge clk)		
			spulse_fail <= failed;
		
		repeat(500) @(negedge clk) begin
			reset <= !($random(netlist_random_seed) & 63);
			s <= !($random(netlist_random_seed) & 7);
			w <= $random(netlist_random_seed);
		end

		if (failed && !spulse_fail) begin
			$display ("Hint: Your state machine should ignore input 's' after the state A to B transition.");
		end
		
		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input clk,
  input reset,
  input s,
  input w,
  output reg z
);

  parameter A=0, B=1, C=2, S10=3, S11=4, S20=5, S21=6, S22=7;
  reg [2:0] state, next;

  always @(posedge clk) begin
    if (reset) state <= A;
    else state <= next;
  end

  always_comb begin
    case (state)
      A: next = s ? B : A;
      B: next = w ? S11 : S10;
      C: next = w ? S11 : S10;
      S10: next = w ? S21 : S20;
      S11: next = w ? S22 : S21;
      S20: next = B;
      S21: next = w ? C : B;
      S22: next = w ? B : C;
      default: next = 'x;
    endcase
  end

  assign z = (state == C);

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_reset; wire drive_reset; assign #0.1 drive_reset=raw_reset;
wire raw_s; wire drive_s; assign #0.1 drive_s=raw_s;
wire raw_w; wire drive_w; assign #0.1 drive_w=raw_w;
wire gold_z, dut_z, raw_dut_z; reg seen_z='0;
stimulus_gen stim1(.clk(clk),.reset(raw_reset),.s(raw_s),.w(raw_w),.tb_match(1'b1));
oracle_RefModule gold(.clk(clk),.reset(drive_reset),.s(drive_s),.w(drive_w),.z(gold_z));
TopModule dut(.clk(clk),.reset(drive_reset),.s(drive_s),.w(drive_w),.z(raw_dut_z));
assign dut_z=~raw_dut_z;
initial begin #101; if(glbl.GSR !== 1'b0 || glbl.GTS !== 1'b0) $fatal(1,"GSR_STARTUP_INVALID"); started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_z === 1'b0 || gold_z === 1'b1) begin
known=1; seen_z=1'b1;
if(dut_z !== gold_z) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_z) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:z");
$display("PHASE1_COMPLETE checks=%0d mismatches=%0d",checks,mismatches);
end
endmodule
