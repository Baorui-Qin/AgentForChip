`timescale 1ns/1ps
`define OK 12
`define INCORRECT 13


module stimulus_gen (
	input clk,
	output reg d, done_counting, ack,
	output reg [9:0] state,
	input tb_match
);
integer netlist_random_seed=1;


	initial begin #101;
		{d, done_counting, ack} <= 3'h0;
		state <= 10'h0;
		
		repeat(300) @(posedge clk, negedge clk) begin
			{d, done_counting, ack} = $random(netlist_random_seed);
			state <= 1<< ($unsigned($random(netlist_random_seed)) % 10);
		end

		#1 $finish;
	end
	
endmodule


`default_nettype wire
`timescale 1ns/1ps

module oracle_RefModule (
  input d,
  input done_counting,
  input ack,
  input [9:0] state, // 10-bit one-hot current state
  output B3_next,
  output S_next,
  output S1_next,
  output Count_next,
  output Wait_next,
  output done,
  output counting,
  output shift_ena
);

  parameter S=0, S1=1, S11=2, S110=3, B0=4, B1=5, B2=6, B3=7, Count=8, Wait=9;

  assign B3_next = state[B2];
  assign S_next = state[S]&~d | state[S1]&~d | state[S110]&~d | state[Wait]&ack;
  assign S1_next = state[S]&d;
  assign Count_next = state[B3] | state[Count]&~done_counting;
  assign Wait_next = state[Count]&done_counting | state[Wait]&~ack;

  assign done = state[Wait];
  assign counting = state[Count];
  assign shift_ena = |state[B3:B0];

endmodule


`timescale 1ns/1ps
module netlist_tb;
reg clk=0; integer checks=0, mismatches=0; bit started=0;
wire raw_d; wire drive_d; assign #0.1 drive_d=raw_d;
wire raw_done_counting; wire drive_done_counting; assign #0.1 drive_done_counting=raw_done_counting;
wire raw_ack; wire drive_ack; assign #0.1 drive_ack=raw_ack;
wire [9:0] raw_state; wire [9:0] drive_state; assign #0.1 drive_state=raw_state;
wire gold_B3_next, dut_B3_next, raw_dut_B3_next; reg seen_B3_next='0;
wire gold_S_next, dut_S_next, raw_dut_S_next; reg seen_S_next='0;
wire gold_S1_next, dut_S1_next, raw_dut_S1_next; reg seen_S1_next='0;
wire gold_Count_next, dut_Count_next, raw_dut_Count_next; reg seen_Count_next='0;
wire gold_Wait_next, dut_Wait_next, raw_dut_Wait_next; reg seen_Wait_next='0;
wire gold_done, dut_done, raw_dut_done; reg seen_done='0;
wire gold_counting, dut_counting, raw_dut_counting; reg seen_counting='0;
wire gold_shift_ena, dut_shift_ena, raw_dut_shift_ena; reg seen_shift_ena='0;
stimulus_gen stim1(.clk(clk),.d(raw_d),.done_counting(raw_done_counting),.ack(raw_ack),.state(raw_state),.tb_match(1'b1));
oracle_RefModule gold(.d(drive_d),.done_counting(drive_done_counting),.ack(drive_ack),.state(drive_state),.B3_next(gold_B3_next),.S_next(gold_S_next),.S1_next(gold_S1_next),.Count_next(gold_Count_next),.Wait_next(gold_Wait_next),.done(gold_done),.counting(gold_counting),.shift_ena(gold_shift_ena));
TopModule dut(.d(drive_d),.done_counting(drive_done_counting),.ack(drive_ack),.state(drive_state),.B3_next(raw_dut_B3_next),.S_next(raw_dut_S_next),.S1_next(raw_dut_S1_next),.Count_next(raw_dut_Count_next),.Wait_next(raw_dut_Wait_next),.done(raw_dut_done),.counting(raw_dut_counting),.shift_ena(raw_dut_shift_ena));
assign dut_B3_next=raw_dut_B3_next;
assign dut_S_next=raw_dut_S_next;
assign dut_S1_next=raw_dut_S1_next;
assign dut_Count_next=raw_dut_Count_next;
assign dut_Wait_next=raw_dut_Wait_next;
assign dut_done=raw_dut_done;
assign dut_counting=raw_dut_counting;
assign dut_shift_ena=raw_dut_shift_ena;
initial begin #101;  started=1; forever #5 clk=~clk; end
task sample;
bit known, bad;
begin known=0; bad=0;
for(integer b=0;b<1;b=b+1) begin
if(gold_B3_next === 1'b0 || gold_B3_next === 1'b1) begin
known=1; seen_B3_next=1'b1;
if(dut_B3_next !== gold_B3_next) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_S_next === 1'b0 || gold_S_next === 1'b1) begin
known=1; seen_S_next=1'b1;
if(dut_S_next !== gold_S_next) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_S1_next === 1'b0 || gold_S1_next === 1'b1) begin
known=1; seen_S1_next=1'b1;
if(dut_S1_next !== gold_S1_next) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_Count_next === 1'b0 || gold_Count_next === 1'b1) begin
known=1; seen_Count_next=1'b1;
if(dut_Count_next !== gold_Count_next) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_Wait_next === 1'b0 || gold_Wait_next === 1'b1) begin
known=1; seen_Wait_next=1'b1;
if(dut_Wait_next !== gold_Wait_next) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_done === 1'b0 || gold_done === 1'b1) begin
known=1; seen_done=1'b1;
if(dut_done !== gold_done) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_counting === 1'b0 || gold_counting === 1'b1) begin
known=1; seen_counting=1'b1;
if(dut_counting !== gold_counting) bad=1;
end end
for(integer b=0;b<1;b=b+1) begin
if(gold_shift_ena === 1'b0 || gold_shift_ena === 1'b1) begin
known=1; seen_shift_ena=1'b1;
if(dut_shift_ena !== gold_shift_ena) bad=1;
end end
if(known) begin checks=checks+1; if(bad) mismatches=mismatches+1; end
end endtask
always @(posedge clk, negedge clk) if(started) begin #0.5; sample(); #4.3; sample(); end
initial begin #10000101; $fatal(1,"NETLIST_STIMULUS_TIMEOUT"); end
final begin
if((&seen_B3_next) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:B3_next");
if((&seen_S_next) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:S_next");
if((&seen_S1_next) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:S1_next");
if((&seen_Count_next) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Count_next");
if((&seen_Wait_next) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:Wait_next");
if((&seen_done) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:done");
if((&seen_counting) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:counting");
if((&seen_shift_ena) !== 1'b1) $error("NETLIST_OUTPUT_UNOBSERVED:shift_ena");
$display("Mismatches: %0d in %0d samples",mismatches,checks);
end
endmodule
